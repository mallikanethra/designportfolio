const DB_NAME = "portfolio_video_db";
const STORE_NAME = "videos";
const DB_VERSION = 1;

export function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

async function uploadVideoToServer(key: string, blob: Blob): Promise<void> {
  try {
    const base64 = await blobToBase64(blob);
    const response = await fetch("/api/save-asset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, value: base64 }),
    });
    const data = await response.json();
    console.log(`[Video Sync] Permanent video saved to server at:`, data.url);
  } catch (err) {
    console.error(`Failed to upload video ${key} to server:`, err);
  }
}

export async function saveVideo(key: string, blob: Blob): Promise<void> {
  // 1. Save locally first
  try {
    const db = await openDb();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const request = store.put(blob, key);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.error("IndexedDB save failed:", err);
    throw err;
  }

  // 2. Upload to server asynchronously for permanence
  uploadVideoToServer(key, blob).catch((err) => {
    console.error("Background video upload failed:", err);
  });
}

export async function getVideo(key: string): Promise<Blob | string | null> {
  // 1. Retrieve from local IndexedDB first (user's own uploads are always preferred)
  let storedBlob: Blob | null = null;
  try {
    const db = await openDb();
    storedBlob = await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const request = store.get(key);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.error("IndexedDB load failed:", err);
  }

  if (storedBlob) {
    // Sync to server in the background if it's stored locally
    uploadVideoToServer(key, storedBlob).catch((err) => {
      console.error(`Auto-sync video upload failed for ${key}:`, err);
    });
    return storedBlob;
  }

  // 2. Fallback to server manifest (for shared users who don't have it locally)
  try {
    const { fetchManifest } = await import("./portfolioDb");
    const manifest = await fetchManifest();
    if (manifest && manifest[key]) {
      const url = manifest[key];
      if (typeof url === "string") {
        return url;
      }
    }
  } catch (err) {
    console.warn(`Manifest lookup failed for video ${key}:`, err);
  }

  return null;
}

export async function deleteVideo(key: string): Promise<void> {
  // 1. Delete locally
  try {
    const db = await openDb();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const request = store.delete(key);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.error("IndexedDB delete failed:", err);
  }

  // 2. Delete from server
  try {
    await fetch("/api/save-asset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, value: null }),
    });
  } catch (err) {
    console.error(`Failed to delete video ${key} from server:`, err);
  }
}
