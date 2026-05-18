const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const parsePercent = (value, fallback) => {
  const numeric = Number.parseFloat(String(value).replace("%", ""));
  return Number.isFinite(numeric) ? clamp(numeric, 0, 100) : fallback;
};

export const parseObjectPosition = (value) => {
  const tokens = String(value || "")
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);

  let x = null;
  let y = null;

  tokens.forEach((token) => {
    if (token === "left") {
      x = 0;
    } else if (token === "right") {
      x = 100;
    } else if (token === "top") {
      y = 0;
    } else if (token === "bottom") {
      y = 100;
    } else if (token === "center") {
      if (x === null) {
        x = 50;
      } else if (y === null) {
        y = 50;
      }
    } else if (token.endsWith("%") || /^-?\d+(\.\d+)?$/.test(token)) {
      if (x === null) {
        x = parsePercent(token, 50);
      } else if (y === null) {
        y = parsePercent(token, 50);
      }
    }
  });

  return {
    x: x ?? 50,
    y: y ?? 50
  };
};

export const formatObjectPosition = ({ x, y }) => `${Math.round(clamp(x, 0, 100))}% ${Math.round(clamp(y, 0, 100))}%`;

export const parseThumbnailZoom = (value) => {
  const numeric = Number.parseFloat(String(value || "").trim());
  return Number.isFinite(numeric) ? clamp(numeric, 1, 3) : 1;
};

const loadImage = (src) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Image could not be loaded for crop export."));
    image.src = src;
  });

export const drawCroppedThumbnail = async (canvas, src, position, zoom) => {
  const image = await loadImage(src);
  const size = canvas.width;
  const context = canvas.getContext("2d");
  const safePosition = parseObjectPosition(position);
  const safeZoom = parseThumbnailZoom(zoom);
  const coverScale = Math.max(size / image.naturalWidth, size / image.naturalHeight) * safeZoom;
  const renderWidth = image.naturalWidth * coverScale;
  const renderHeight = image.naturalHeight * coverScale;
  const dx = (size - renderWidth) * (safePosition.x / 100);
  const dy = (size - renderHeight) * (safePosition.y / 100);

  context.clearRect(0, 0, size, size);
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, size, size);
  context.drawImage(image, dx, dy, renderWidth, renderHeight);
};

export const clearCanvas = (canvas) => {
  const context = canvas.getContext("2d");
  context.clearRect(0, 0, canvas.width, canvas.height);
};

export const downloadCanvasAsPng = (canvas, filename) => {
  canvas.toBlob((blob) => {
    if (!blob) {
      return;
    }

    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  }, "image/png");
};
