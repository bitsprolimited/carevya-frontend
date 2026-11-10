import { backendFetch } from "@/lib/backend-api";

export type UploadKind = "photo" | "nin" | "issue_attachment";

export type UploadResult = {
  url: string;
  publicId: string;
  kind: UploadKind;
  isPrivate: boolean;
};

/** POST /uploads — photo, NIN, or issue attachment. */
export async function uploadFile(
  kind: UploadKind,
  file: File,
): Promise<UploadResult> {
  const form = new FormData();
  form.append("kind", kind);
  form.append("file", file);
  return backendFetch<UploadResult>("/uploads", {
    method: "POST",
    body: form,
  });
}
