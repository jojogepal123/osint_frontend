const imageUrlToJpegBase64 = async (url, { maxSize = 320, quality = 0.85 } = {}) => {
  if (!url) return null;

  try {
    const res = await fetch(url, { mode: "cors", credentials: "omit" });
    if (!res.ok) return null;
    const blob = await res.blob();

    const dataUrl = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error("read failed"));
      reader.readAsDataURL(blob);
    });

    const img = await new Promise((resolve, reject) => {
      const i = new Image();
      i.onload = () => resolve(i);
      i.onerror = () => reject(new Error("image load failed"));
      i.src = dataUrl;
    });

    const ratio = Math.min(1, maxSize / Math.max(img.width, img.height));
    const w = Math.max(1, Math.round(img.width * ratio));
    const h = Math.max(1, Math.round(img.height * ratio));

    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, w, h);
    ctx.drawImage(img, 0, 0, w, h);

    return canvas.toDataURL("image/jpeg", quality);
  } catch {
    return null;
  }
};

export const embedProfileImages = async (results) => {
  if (!results?.profile?.profileImages?.length) return results;

  const next = { ...results, profile: { ...results.profile, profileImages: [] } };

  for (const img of results.profile.profileImages) {
    const base64 = await imageUrlToJpegBase64(img.value);
    next.profile.profileImages.push({ ...img, base64 });
  }

  return next;
};

export default imageUrlToJpegBase64;
