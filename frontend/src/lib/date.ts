/** Normalize UI/API date strings to `YYYY-MM-DD` for date inputs. */
export function toDateOnly(value: string | null | undefined): string {
  if (!value?.trim()) return "";
  const trimmed = value.trim();

  const iso = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (iso) return `${iso[1]}-${iso[2]}-${iso[3]}`;

  const digits = trimmed.replace(/\D/g, "");
  if (digits.length === 8) {
    // Prefer YYYYMMDD when the string clearly starts with a year
    if (/^(19|20)\d{6}$/.test(digits)) {
      return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6, 8)}`;
    }
    // Legacy care-profile entry: DDMMYYYY
    return `${digits.slice(4, 8)}-${digits.slice(2, 4)}-${digits.slice(0, 2)}`;
  }

  const parsed = new Date(trimmed);
  if (Number.isNaN(parsed.getTime())) return "";

  const year = parsed.getFullYear();
  const month = String(parsed.getMonth() + 1).padStart(2, "0");
  const day = String(parsed.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** Convert UI/API date values to Nest-style ISO 8601 datetime. */
export function toIso8601Date(value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) return undefined;

  if (/^\d{4}-\d{2}-\d{2}T/.test(trimmed)) {
    const parsed = new Date(trimmed);
    return Number.isNaN(parsed.getTime()) ? undefined : parsed.toISOString();
  }

  const dateOnly = toDateOnly(trimmed);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateOnly)) return undefined;

  const [year, month, day] = dateOnly.split("-").map(Number);
  const iso = `${dateOnly}T00:00:00.000Z`;
  const parsed = new Date(iso);
  if (Number.isNaN(parsed.getTime())) return undefined;
  if (
    parsed.getUTCFullYear() !== year ||
    parsed.getUTCMonth() + 1 !== month ||
    parsed.getUTCDate() !== day
  ) {
    return undefined;
  }
  return iso;
}

/** Format an API ISO date for form fields (`YYYY-MM-DD`). */
export function toDisplayDob(value: string | null | undefined): string {
  return toDateOnly(value);
}
