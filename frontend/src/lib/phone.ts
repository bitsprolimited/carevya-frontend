/** Nigerian mobile: 0803… / +234803… style numbers. */
export function isValidNigerianMobile(value: string): boolean {
  const digits = value.trim().replace(/\D/g, "");
  if (!digits) return false;

  let local = digits;
  if (local.startsWith("234") && local.length >= 13) local = local.slice(3);
  if (local.startsWith("0") && local.length >= 11) local = local.slice(1);

  return local.length >= 10 && local.length <= 11;
}

export const NIGERIAN_PHONE_ERROR =
  "Enter a valid phone number, e.g. +234 803 123 4567.";

/** Returns null when valid; otherwise an error message (or `"required"` if empty). */
export function validateNigerianMobile(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return "required";
  if (!isValidNigerianMobile(trimmed)) return NIGERIAN_PHONE_ERROR;
  return null;
}
