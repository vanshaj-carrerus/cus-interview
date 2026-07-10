const RAZORPAY_SCRIPT_SRC = "https://checkout.razorpay.com/v1/checkout.js";

export type RazorpayOrderCheckoutResponse = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

export type RazorpaySubscriptionCheckoutResponse = {
  razorpay_payment_id: string;
  razorpay_subscription_id: string;
  razorpay_signature: string;
};

export type RazorpayCheckoutInstance = {
  open: () => void;
  on: (
    event: "payment.failed",
    handler: (response: { error: { description: string } }) => void
  ) => void;
};

type RazorpayConstructor = new (
  options: Record<string, unknown>
) => RazorpayCheckoutInstance;

declare global {
  interface Window {
    Razorpay?: RazorpayConstructor;
  }
}

function waitForRazorpay(timeoutMs = 12_000): Promise<boolean> {
  return new Promise((resolve) => {
    const started = Date.now();

    const check = () => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      if (Date.now() - started >= timeoutMs) {
        resolve(false);
        return;
      }
      window.setTimeout(check, 50);
    };

    check();
  });
}

export async function loadRazorpayScript(): Promise<boolean> {
  if (typeof window === "undefined") {
    return false;
  }

  if (window.Razorpay) {
    return true;
  }

  const existing = document.querySelector<HTMLScriptElement>(
    `script[src="${RAZORPAY_SCRIPT_SRC}"]`
  );

  if (!existing) {
    const script = document.createElement("script");
    script.src = RAZORPAY_SCRIPT_SRC;
    script.async = true;
    document.body.appendChild(script);
  }

  return waitForRazorpay();
}

export type OpenRazorpayOrderCheckoutOptions = {
  keyId: string;
  orderId: string;
  amount: number;
  currency: string;
  name?: string;
  description?: string;
  prefill?: { name?: string; email?: string; contact?: string };
  themeColor?: string;
  onSuccess: (response: RazorpayOrderCheckoutResponse) => void | Promise<void>;
  onFailure?: (message: string, orderId: string) => void;
  onDismiss?: (orderId: string) => void;
};

export async function openRazorpayOrderCheckout(
  options: OpenRazorpayOrderCheckoutOptions
): Promise<{ ok: true } | { ok: false; error: string }> {
  const scriptLoaded = await loadRazorpayScript();
  if (!scriptLoaded || !window.Razorpay) {
    return { ok: false, error: "Could not load Razorpay checkout." };
  }

  try {
    const rzp = new window.Razorpay({
      key: options.keyId,
      amount: options.amount,
      currency: options.currency,
      order_id: options.orderId,
      name: options.name ?? "CareerUs Interview",
      description: options.description,
      prefill: options.prefill,
      theme: { color: options.themeColor ?? "#00a6f4" },
      retry: {
        enabled: true,
        max_count: 4,
      },
      config: {
        display: {
          sequence: ["card", "upi", "netbanking", "wallet"],
          preferences: {
            show_default_blocks: true,
          },
        },
      },
      handler: (response: RazorpayOrderCheckoutResponse) => {
        void options.onSuccess(response);
      },
      modal: {
        ondismiss: () => {
          options.onDismiss?.(options.orderId);
        },
        escape: true,
        confirm_close: true,
      },
    });

    rzp.on("payment.failed", (response) => {
      options.onFailure?.(
        response.error.description || "Payment failed. Please try again.",
        options.orderId
      );
    });

    rzp.open();
    return { ok: true };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Could not open Razorpay checkout.";
    return { ok: false, error: message };
  }
}

export type OpenRazorpaySubscriptionCheckoutOptions = {
  keyId: string;
  subscriptionId: string;
  name?: string;
  description?: string;
  prefill?: { name?: string; email?: string; contact?: string };
  themeColor?: string;
  onSuccess: (
    response: RazorpaySubscriptionCheckoutResponse
  ) => void | Promise<void>;
  onFailure?: (message: string) => void;
  onDismiss?: () => void;
};

export async function openRazorpaySubscriptionCheckout(
  options: OpenRazorpaySubscriptionCheckoutOptions
): Promise<{ ok: true } | { ok: false; error: string }> {
  const scriptLoaded = await loadRazorpayScript();
  if (!scriptLoaded || !window.Razorpay) {
    return { ok: false, error: "Could not load Razorpay checkout." };
  }

  try {
    const rzp = new window.Razorpay({
      key: options.keyId,
      subscription_id: options.subscriptionId,
      name: options.name ?? "CareerUs Interview",
      description: options.description,
      prefill: options.prefill,
      theme: { color: options.themeColor ?? "#00a6f4" },
      retry: {
        enabled: true,
        max_count: 4,
      },
      config: {
        display: {
          sequence: ["card", "upi", "netbanking", "wallet"],
          preferences: {
            show_default_blocks: true,
          },
        },
      },
      handler: (response: RazorpaySubscriptionCheckoutResponse) => {
        void options.onSuccess(response);
      },
      modal: {
        ondismiss: () => {
          options.onDismiss?.();
        },
        escape: true,
        confirm_close: true,
      },
    });

    rzp.on("payment.failed", (response) => {
      options.onFailure?.(
        response.error.description || "Payment failed. Please try again."
      );
    });

    rzp.open();
    return { ok: true };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Could not open Razorpay checkout.";
    return { ok: false, error: message };
  }
}
