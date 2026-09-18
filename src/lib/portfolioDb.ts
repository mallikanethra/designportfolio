const DB_NAME = "portfolio_assets_db";
const STORE_NAME = "assets";
const DB_VERSION = 1;

export function openPortfolioDb(): Promise<IDBDatabase> {
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

let manifestCache: Record<string, any> | null = null;
let manifestPromise: Promise<Record<string, any>> | null = null;

export function fetchManifest(): Promise<Record<string, any>> {
  if (manifestCache) return Promise.resolve(manifestCache);
  if (manifestPromise) return manifestPromise;

  manifestPromise = fetch("/api/assets-manifest")
    .then((res) => res.json())
    .then((data) => {
      if (data.success && data.manifest) {
        manifestCache = data.manifest;
        return data.manifest;
      }
      return {};
    })
    .catch((err) => {
      console.error("Failed to load assets manifest:", err);
      return {};
    });

  return manifestPromise;
}

export async function uploadAssetToServer(key: string, value: any): Promise<void> {
  try {
    const response = await fetch("/api/save-asset", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ key, value }),
    });
    
    if (!response.ok) {
      console.warn(`Server responded with status ${response.status} for asset ${key}`);
      return;
    }

    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      console.warn(`Server did not respond with JSON for asset ${key} (Content-Type: ${contentType})`);
      return;
    }

    const data = await response.json();
    if (data && data.success) {
      if (data.url) {
        if (!manifestCache) {
          manifestCache = {};
        }
        if (typeof value === "object" && value !== null) {
          manifestCache[key] = { type: "json", url: data.url };
        } else {
          manifestCache[key] = data.url;
        }
      }

      // If server processed the value (e.g. extracted base64 images into URLs), 
      // sync the processed value back to local IndexedDB to keep it lightweight.
      if (data.processedValue) {
        try {
          const db = await openPortfolioDb();
          await new Promise<void>((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, "readwrite");
            const store = tx.objectStore(STORE_NAME);
            const request = store.put(data.processedValue, key);
            tx.oncomplete = () => resolve();
            request.onerror = () => reject(request.error);
          });
          console.log(`[Asset Sync] Synced processed lightweight value for "${key}" back to IndexedDB.`);
        } catch (dbErr) {
          console.error(`Failed to sync processed value back to IndexedDB for key ${key}:`, dbErr);
        }
      }
    }
  } catch (err) {
    console.error(`Failed to upload asset ${key} to server:`, err);
  }
}

export async function setAsset(key: string, value: any): Promise<void> {
  // 1. Save locally first for fast interaction
  try {
    const db = await openPortfolioDb();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const request = store.put(value, key);
      tx.oncomplete = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.error(`IndexedDB set failed for key ${key}:`, err);
    // Fallback to localStorage for tiny configs if IndexedDB fails
    try {
      if (typeof value === "string" && value.length < 100000) {
        localStorage.setItem(key, value);
      } else {
        localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (e) {
      console.error("localStorage fallback failed:", e);
    }
  }

  // 2. Upload to server asynchronously for permanence
  uploadAssetToServer(key, value).catch((err) => {
    console.error(`Background upload to server failed for key ${key}:`, err);
  });
}

export async function getAsset(key: string): Promise<any> {
  try {
    // 1. Check server manifest first (production/shared deployments)
    const manifest = await fetchManifest();
    if (manifest && manifest[key]) {
      const manifestVal = manifest[key];
      if (typeof manifestVal === "object" && manifestVal.type === "json") {
        const fileRes = await fetch(manifestVal.url);
        if (fileRes.ok && (fileRes.headers.get("content-type") || "").includes("application/json")) {
          return await fileRes.json();
        }
      } else if (typeof manifestVal === "string") {
        return manifestVal;
      }
    }
  } catch (err) {
    console.warn(`Manifest lookup failed for ${key}, falling back to local DB:`, err);
  }

  // 2. Fetch from local IndexedDB
  let localValue: any = null;
  try {
    const db = await openPortfolioDb();
    localValue = await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const request = store.get(key);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.error(`IndexedDB get failed for key ${key}:`, err);
    // Fallback to localStorage
    try {
      const val = localStorage.getItem(key);
      if (val) {
        if (val.startsWith("[") || val.startsWith("{")) {
          localValue = JSON.parse(val);
        } else {
          localValue = val;
        }
      }
    } catch (e) {
      localValue = null;
    }
  }

  // 3. If asset exists locally but not in the server manifest, sync it to the server in the background
  if (localValue) {
    uploadAssetToServer(key, localValue).catch((err) => {
      console.error(`Auto-sync upload failed for key ${key}:`, err);
    });
  }

  return localValue;
}

export async function deleteAsset(key: string): Promise<void> {
  // 1. Delete locally
  try {
    const db = await openPortfolioDb();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const request = store.delete(key);
      tx.oncomplete = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.error(`IndexedDB delete failed for key ${key}:`, err);
    try {
      localStorage.removeItem(key);
    } catch (e) {}
  }

  // 2. Delete from server
  try {
    await fetch("/api/save-asset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, value: null }),
    });
    if (manifestCache) {
      delete manifestCache[key];
    }
  } catch (err) {
    console.error(`Failed to delete asset ${key} from server:`, err);
  }
}

import { APP_ASSETS } from "../assets/assets";

export async function reloadDefaultAssets(): Promise<void> {
  try {
    // 1. Website Logo
    await setAsset("homepage_uploaded_image", APP_ASSETS.websiteLogo);
    localStorage.setItem("homepage_uploaded_image", APP_ASSETS.websiteLogo);

    // 2. Profile Image & Banners
    await setAsset("about_uploaded_image", APP_ASSETS.profileImage);
    localStorage.setItem("about_uploaded_image", APP_ASSETS.profileImage);
    
    await setAsset("about_uploaded_video", APP_ASSETS.profileVideoBanner);
    localStorage.setItem("about_uploaded_video", APP_ASSETS.profileVideoBanner);
    localStorage.setItem("about_profile_video_banner", APP_ASSETS.profileVideoBanner);

    await setAsset("contact_uploaded_video", APP_ASSETS.contactVideoBanner);
    localStorage.setItem("contact_uploaded_video", APP_ASSETS.contactVideoBanner);
    localStorage.setItem("about_contact_video_banner", APP_ASSETS.contactVideoBanner);

    try {
      const { deleteVideo } = await import("./videoDb");
      await deleteVideo("about_uploaded_video");
      await deleteVideo("contact_uploaded_video");
    } catch (e) {
      console.warn("Could not clear old videoDb entries:", e);
    }

    // 3. Category 16:9 Banners
    await setAsset("about_product_banner", APP_ASSETS.categoryTemplates.product);
    await setAsset("about_furniture_banner", APP_ASSETS.categoryTemplates.furniture);
    await setAsset("about_transport_banner", APP_ASSETS.categoryTemplates.transport);
    await setAsset("about_visual_banner", APP_ASSETS.categoryTemplates.visual);
    await setAsset("about_experience_banner", APP_ASSETS.categoryTemplates.experience);

    localStorage.setItem("about_product_banner", APP_ASSETS.categoryTemplates.product);
    localStorage.setItem("about_furniture_banner", APP_ASSETS.categoryTemplates.furniture);
    localStorage.setItem("about_transport_banner", APP_ASSETS.categoryTemplates.transport);
    localStorage.setItem("about_visual_banner", APP_ASSETS.categoryTemplates.visual);
    localStorage.setItem("about_experience_banner", APP_ASSETS.categoryTemplates.experience);

    // Portfolio '26 link
    await setAsset("portfolio_26_link", APP_ASSETS.portfolio26Link);
    localStorage.setItem("portfolio_26_link", APP_ASSETS.portfolio26Link);

    // 4. Experience Logos and Names and URLs
    for (let i = 0; i < APP_ASSETS.experienceLogos.length; i++) {
      const item = APP_ASSETS.experienceLogos[i];
      await setAsset(`about_partner_logo_${i}`, item.logo);
      localStorage.setItem(`about_partner_logo_${i}`, item.logo);
      localStorage.setItem(`about_partner_name_${i}`, item.name);
      localStorage.setItem(`about_partner_url_${i}`, item.url);
    }
    
    // Clear any leftover logo slots beyond index 5
    for (let i = APP_ASSETS.experienceLogos.length; i < 15; i++) {
      await deleteAsset(`about_partner_logo_${i}`);
      localStorage.removeItem(`about_partner_logo_${i}`);
      localStorage.removeItem(`about_partner_name_${i}`);
      localStorage.removeItem(`about_partner_url_${i}`);
    }

    // 5. Vertical Carousels default slides and links
    const categories = ["product", "furniture", "transport", "visual", "experience"] as const;
    for (const cat of categories) {
      const slides = APP_ASSETS.carouselSlides[cat];
      const links = APP_ASSETS.carouselLinks[cat];
      const formatted = slides.map((img, idx) => ({
        id: idx + 1,
        image: img,
        link: links[idx] || ""
      }));
      await setAsset(`vertical_carousel_slides_${cat}`, formatted);
      localStorage.setItem(`vertical_carousel_slides_${cat}`, JSON.stringify(formatted));
    }
    
    localStorage.setItem("reloaded_assets_v12", "true");
  } catch (error) {
    console.error("Error in reloadDefaultAssets:", error);
  }
}
