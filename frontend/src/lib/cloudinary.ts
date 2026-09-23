const CLOUDINARY_HOST = "https://res.cloudinary.com";

/**
 * Build a Cloudinary delivery URL.
 * Prefer storing full Cloudinary URLs in content; use this helper when composing from cloud name + public id.
 */
export function cloudinaryUrl(
  cloudName: string,
  publicId: string,
  transforms = "f_auto,q_auto",
): string {
  const cleanId = publicId.replace(/^\/+/, "");
  return `${CLOUDINARY_HOST}/${cloudName}/image/upload/${transforms}/${cleanId}`;
}

export function isCloudinaryUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.hostname === "res.cloudinary.com";
  } catch {
    return false;
  }
}
