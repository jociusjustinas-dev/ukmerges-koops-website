export type EnquiryType = "contact" | "supplier" | "restaurant" | "job";

type EnquiryResponse = {
  success?: boolean;
  message?: string;
};

export async function submitEnquiry(form: HTMLFormElement, type: EnquiryType): Promise<void> {
  const body = new FormData(form);
  body.set("type", type);

  const response = await fetch("/api/uzklausos", {
    method: "POST",
    body,
    headers: { Accept: "application/json" },
  });
  const result = (await response.json().catch(() => ({}))) as EnquiryResponse;

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Užklausos išsiųsti nepavyko. Pabandykite dar kartą.");
  }
}
