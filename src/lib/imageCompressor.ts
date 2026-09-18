export function compressImage(base64Str: string, maxWidth = 800, maxHeight = 800, quality = 0.6): Promise<string> {
  return new Promise((resolve) => {
    // If it is SVG, don't compress
    if (base64Str.startsWith("data:image/svg+xml")) {
      resolve(base64Str);
      return;
    }

    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      let width = img.width;
      let height = img.height;

      // Calculate new dimensions maintaining aspect ratio
      if (width > maxWidth || height > maxHeight) {
        if (width > height) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        } else {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(base64Str);
        return;
      }

      // Draw image on canvas (transparent background is preserved by default)
      ctx.drawImage(img, 0, 0, width, height);
      try {
        // Use image/webp by default since it has supreme compression and supports transparency
        let mimeType = "image/webp";
        let compressedDataUrl = canvas.toDataURL(mimeType, quality);

        // If webp is not supported by the browser, it falls back to image/png.
        // If it fell back to PNG and the original was not a PNG (meaning we don't necessarily need transparency),
        // we fallback to image/jpeg which supports quality compression in all browsers.
        if (compressedDataUrl.startsWith("data:image/png") && !base64Str.startsWith("data:image/png")) {
          mimeType = "image/jpeg";
          compressedDataUrl = canvas.toDataURL(mimeType, quality);
        }

        resolve(compressedDataUrl);
      } catch (e) {
        console.error("Failed to export canvas to compressed image", e);
        resolve(base64Str);
      }
    };
    img.onerror = () => {
      resolve(base64Str);
    };
  });
}
