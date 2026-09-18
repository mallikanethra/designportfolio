import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;

// Body parser supporting large media files (up to 150MB)
app.use(express.json({ limit: "150mb" }));
app.use(express.urlencoded({ limit: "150mb", extended: true }));

const PUBLIC_DIR = path.join(process.cwd(), "public");
const ASSETS_DIR = path.join(PUBLIC_DIR, "assets");
const MANIFEST_PATH = path.join(ASSETS_DIR, "manifest.json");

// Ensure assets directories exist
if (!fs.existsSync(PUBLIC_DIR)) {
  fs.mkdirSync(PUBLIC_DIR, { recursive: true });
}
if (!fs.existsSync(ASSETS_DIR)) {
  fs.mkdirSync(ASSETS_DIR, { recursive: true });
}

// Ensure manifest.json exists
if (!fs.existsSync(MANIFEST_PATH)) {
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify({}, null, 2), "utf8");
}

// Detect video extension from binary signature (magic numbers)
function detectVideoExtension(buffer: Buffer): string {
  if (buffer.length >= 4) {
    // EBML header (WebM): 1A 45 DF A3
    if (buffer[0] === 0x1A && buffer[1] === 0x45 && buffer[2] === 0xDF && buffer[3] === 0xA3) {
      return "webm";
    }
    // Check MP4 (usually has ftyp brand at offset 4)
    if (buffer.length >= 8) {
      const brand = buffer.toString("ascii", 4, 8);
      if (brand === "ftyp") {
        return "mp4";
      }
    }
  }
  return "webm"; // Default fallback for compressed video files in this template
}

// Run startup migration to fix any existing video assets stored with .bin extensions
try {
  const manifestContent = fs.readFileSync(MANIFEST_PATH, "utf8");
  const manifest = JSON.parse(manifestContent);
  let updated = false;

  const binKeys = Object.keys(manifest).filter(
    (key) => typeof manifest[key] === "string" && manifest[key].endsWith(".bin")
  );

  for (const key of binKeys) {
    const relativePath = manifest[key]; // e.g. "/assets/about_uploaded_video.bin"
    const fileName = path.basename(relativePath); // "about_uploaded_video.bin"
    const fullBinPath = path.join(PUBLIC_DIR, relativePath);

    if (fs.existsSync(fullBinPath)) {
      const buffer = fs.readFileSync(fullBinPath);
      const ext = detectVideoExtension(buffer);
      const newFileName = fileName.replace(/\.bin$/, `.${ext}`);
      const newRelativePath = `/assets/${newFileName}`;
      const newFullPath = path.join(ASSETS_DIR, newFileName);

      fs.renameSync(fullBinPath, newFullPath);
      manifest[key] = newRelativePath;
      updated = true;
      console.log(`[Startup Migration] Migrated ${fileName} to ${newFileName}`);
    }
  }

  if (updated) {
    fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2), "utf8");
    console.log("[Startup Migration] Manifest updated successfully with correct video extensions!");
  }
} catch (err: any) {
  console.error("[Startup Migration Error]", err);
}

// Run startup validation for manifest.json to remove entries pointing to non-existent files on disk
try {
  const manifestContent = fs.readFileSync(MANIFEST_PATH, "utf8");
  const manifest = JSON.parse(manifestContent);
  let updated = false;

  for (const key of Object.keys(manifest)) {
    const val = manifest[key];
    let relativePath = "";
    if (typeof val === "string") {
      relativePath = val;
    } else if (typeof val === "object" && val !== null && val.url) {
      relativePath = val.url;
    }

    if (relativePath && !relativePath.startsWith("http://") && !relativePath.startsWith("https://")) {
      const fullPath = path.join(PUBLIC_DIR, relativePath);
      if (!fs.existsSync(fullPath)) {
        console.log(`[Startup Manifest Cleanup] Removing non-existent asset reference: ${key} -> ${relativePath}`);
        delete manifest[key];
        updated = true;
      }
    }
  }

  if (updated) {
    fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2), "utf8");
    console.log("[Startup Manifest Cleanup] Manifest cleaned successfully!");
  }
} catch (err: any) {
  console.error("[Startup Manifest Cleanup Error]", err);
}

// 1. GET /api/assets-manifest - Returns the current manifest of permanent assets
app.get("/api/assets-manifest", (req, res) => {
  try {
    const manifestContent = fs.readFileSync(MANIFEST_PATH, "utf8");
    const manifest = JSON.parse(manifestContent);
    res.json({ success: true, manifest });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Helper to determine extension from base64 MIME type with query/codec parameter support
function getExtensionFromMime(dataUrl: string): string {
  // Matches everything between data: and ;base64,
  const match = dataUrl.match(/^data:(.*?);base64,/);
  if (!match) return "bin";
  const mimeWithParams = match[1]; // e.g. "video/webm;codecs=vp8" or "image/png"
  
  if (mimeWithParams.includes("webp")) return "webp";
  if (mimeWithParams.includes("png")) return "png";
  if (mimeWithParams.includes("jpeg") || mimeWithParams.includes("jpg")) return "jpg";
  if (mimeWithParams.includes("svg")) return "svg";
  if (mimeWithParams.includes("mp4")) return "mp4";
  if (mimeWithParams.includes("webm")) return "webm";
  if (mimeWithParams.includes("ogg")) return "ogg";
  if (mimeWithParams.includes("json")) return "json";
  
  // Clean up to get the base mime type before splitting
  const cleanMime = mimeWithParams.split(";")[0]; // e.g. "video/webm"
  return cleanMime.split("/")[1] || "bin";
}

// Run startup migration to extract base64 slide images from vertical_carousel_slides_*.json files
try {
  const manifestContent = fs.readFileSync(MANIFEST_PATH, "utf8");
  const manifest = JSON.parse(manifestContent);
  let updated = false;

  const files = fs.readdirSync(ASSETS_DIR);
  for (const file of files) {
    if (file.startsWith("vertical_carousel_slides_") && file.endsWith(".json")) {
      const key = path.basename(file, ".json");
      const filePath = path.join(ASSETS_DIR, file);
      try {
        const content = fs.readFileSync(filePath, "utf8");
        const slides = JSON.parse(content);
        if (Array.isArray(slides)) {
          let fileUpdated = false;
          for (const slide of slides) {
            if (slide && typeof slide.image === "string" && slide.image.startsWith("data:")) {
              const ext = getExtensionFromMime(slide.image);
              const commaIndex = slide.image.indexOf(",");
              const base64Data = commaIndex !== -1 ? slide.image.slice(commaIndex + 1) : slide.image;
              const buffer = Buffer.from(base64Data, "base64");
              const imgName = `${key}_slide_${slide.id}.${ext}`;
              const imgPath = path.join(ASSETS_DIR, imgName);
              fs.writeFileSync(imgPath, buffer);
              slide.image = `/assets/${imgName}`;
              fileUpdated = true;
              console.log(`[Startup Migration] Extracted base64 slide image to ${imgName}`);
            }
          }
          if (fileUpdated) {
            fs.writeFileSync(filePath, JSON.stringify(slides, null, 2), "utf8");
            console.log(`[Startup Migration] Updated ${file} with extracted image URLs.`);
            if (!manifest[key]) {
              manifest[key] = { type: "json", url: `/assets/${file}` };
              updated = true;
            }
          }
        }
      } catch (e) {
        console.error(`Error migrating slides in ${file}:`, e);
      }
    }
  }

  if (updated) {
    fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2), "utf8");
    console.log("[Startup Migration] Manifest updated successfully with processed slides!");
  }
} catch (err: any) {
  console.error("[Startup Slides Migration Error]", err);
}

// Run startup cleanup to verify image paths in vertical_carousel_slides_*.json files exist on disk
try {
  const files = fs.readdirSync(ASSETS_DIR);
  for (const file of files) {
    if (file.startsWith("vertical_carousel_slides_") && file.endsWith(".json")) {
      const filePath = path.join(ASSETS_DIR, file);
      try {
        const content = fs.readFileSync(filePath, "utf8");
        const slides = JSON.parse(content);
        if (Array.isArray(slides)) {
          let fileUpdated = false;
          for (const slide of slides) {
            if (slide && typeof slide.image === "string" && slide.image.startsWith("/assets/")) {
              const localPath = path.join(PUBLIC_DIR, slide.image);
              if (!fs.existsSync(localPath)) {
                console.log(`[Startup Cleanup] Image file ${slide.image} not found on disk, resetting slide ${slide.id} image to null`);
                slide.image = null;
                fileUpdated = true;
              }
            }
          }
          if (fileUpdated) {
            fs.writeFileSync(filePath, JSON.stringify(slides, null, 2), "utf8");
            console.log(`[Startup Cleanup] Cleaned up missing image references in ${file}.`);
          }
        }
      } catch (e) {
        console.error(`Error cleaning slides in ${file}:`, e);
      }
    }
  }
} catch (err: any) {
  console.error("[Startup Slides Cleanup Error]", err);
}

// 2. POST /api/save-asset - Receives base64/JSON content and writes it directly to disk
app.post("/api/save-asset", (req, res) => {
  const { key, value } = req.body;

  if (!key) {
    return res.status(400).json({ success: false, error: "Key is required" });
  }

  try {
    const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8"));

    if (value === null || value === undefined) {
      // Deleting asset
      if (manifest[key]) {
        const entry = manifest[key];
        const relUrl = typeof entry === "object" && entry !== null ? entry.url : entry;
        if (typeof relUrl === "string") {
          const filePath = path.join(PUBLIC_DIR, relUrl);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        }
        delete manifest[key];
        fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2), "utf8");
      }
      return res.json({ success: true, message: "Asset deleted" });
    }

    let assetRelativeUrl = "";

    if (typeof value === "string") {
      if (value.startsWith("data:")) {
        // It is a base64 Data URL (image/video)
        const ext = getExtensionFromMime(value);
        const commaIndex = value.indexOf(",");
        const base64Data = commaIndex !== -1 ? value.slice(commaIndex + 1) : value;
        const buffer = Buffer.from(base64Data, "base64");
        
        const fileName = `${key}.${ext}`;
        const filePath = path.join(ASSETS_DIR, fileName);
        
        fs.writeFileSync(filePath, buffer);
        assetRelativeUrl = `/assets/${fileName}`;
        manifest[key] = assetRelativeUrl;
        
        // Save updated manifest
        fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2), "utf8");
        console.log(`[Asset Saved] Permanent file written: ${assetRelativeUrl} for key "${key}"`);
        
        // If the homepage brand logo was updated, synchronize the favicons directly
        if (key === "homepage_uploaded_image") {
          try {
            fs.writeFileSync(path.join(PUBLIC_DIR, "favicon.png"), buffer);
            fs.writeFileSync(path.join(PUBLIC_DIR, "favicon.ico"), buffer);
            console.log("[Favicon Synced] Synchronized favicon.png and favicon.ico with the uploaded homepage brand logo!");
          } catch (favErr) {
            console.error("Error syncing favicon files:", favErr);
          }
        }
        
        return res.json({ success: true, url: assetRelativeUrl });
      } else if (value.startsWith("http://") || value.startsWith("https://") || value.startsWith("/")) {
        // It is a direct external or root-relative URL string (e.g. Cloudinary URL)
        manifest[key] = value;
        fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2), "utf8");
        console.log(`[Asset Saved] Direct URL saved in manifest: "${value}" for key "${key}"`);
        return res.json({ success: true, url: value });
      }
    } else {
      // It is a JSON object or other structural config
      let processedValue = value;
      if (Array.isArray(value) && key.startsWith("vertical_carousel_slides_")) {
        processedValue = value.map((slide: any) => {
          if (slide && typeof slide.image === "string" && slide.image.startsWith("data:")) {
            try {
              const ext = getExtensionFromMime(slide.image);
              const commaIndex = slide.image.indexOf(",");
              const base64Data = commaIndex !== -1 ? slide.image.slice(commaIndex + 1) : slide.image;
              const buffer = Buffer.from(base64Data, "base64");
              const imgName = `${key}_slide_${slide.id}.${ext}`;
              const imgPath = path.join(ASSETS_DIR, imgName);
              fs.writeFileSync(imgPath, buffer);
              console.log(`[Save Asset] Extracted slide image to ${imgName}`);
              return { ...slide, image: `/assets/${imgName}` };
            } catch (err) {
              console.error(`Failed to extract slide image for ${key} slide ${slide.id}:`, err);
            }
          }
          return slide;
        });
      }

      const fileName = `${key}.json`;
      const filePath = path.join(ASSETS_DIR, fileName);
      
      fs.writeFileSync(filePath, JSON.stringify(processedValue, null, 2), "utf8");
      assetRelativeUrl = `/assets/${fileName}`;
      manifest[key] = { type: "json", url: assetRelativeUrl };
      
      // Save updated manifest
      fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2), "utf8");
      console.log(`[Asset Saved] Permanent file written: ${assetRelativeUrl} for key "${key}"`);
      return res.json({ success: true, url: assetRelativeUrl, processedValue });
    }
  } catch (err: any) {
    console.error("Error saving asset:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Explicitly serve /assets from public/assets
app.use("/assets", express.static(ASSETS_DIR));

// Setup Vite Dev Server / Prod Server
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
