export type PayUCheckoutOptions = {
  actionUrl: string;
  params: Record<string, string>;
};

export function submitPayUForm({ actionUrl, params }: PayUCheckoutOptions): void {
  if (typeof window === "undefined") return;

  const form = document.createElement("form");
  form.method = "POST";
  form.action = actionUrl;

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = String(value);
      form.appendChild(input);
    }
  });

  document.body.appendChild(form);
  form.submit();
}
