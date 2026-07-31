import crypto from "crypto";

export type PayUPaymentParams = {
  txnid: string;
  amount: string; // e.g. "499.00"
  productinfo: string;
  firstname: string;
  email: string;
  phone: string;
  surl: string;
  furl: string;
  udf1?: string; // e.g. userId or planId
  udf2?: string; // e.g. planId or product type
  udf3?: string;
  udf4?: string;
  udf5?: string;
  /** Raw JSON string — when set, uses PayU api_version=7 SI hash formula. */
  siDetails?: string;
};

export function getPayUMerchantKey(): string {
  return process.env.PAYU_MERCHANT_KEY?.trim() ?? "";
}

export function getPayUMerchantSalt(): string {
  return process.env.PAYU_MERCHANT_SALT?.trim() ?? "";
}

function isPayUProduction(): boolean {
  const env = (process.env.PAYU_ENV ?? "TEST").toUpperCase();
  return env === "PRODUCTION" || env === "PROD";
}

export function getPayUActionUrl(): string {
  if (isPayUProduction()) {
    return "https://secure.payu.in/_payment";
  }
  return "https://test.payu.in/_payment";
}

/** PayU merchant post-service API (recurring charges, verify, pre-debit). */
export function getPayUPostServiceUrl(): string {
  if (isPayUProduction()) {
    return "https://info.payu.in/merchant/postservice.php";
  }
  return "https://test.payu.in/merchant/postservice.php";
}

export function generatePayUPostServiceHash(command: string, var1: string): string {
  const key = getPayUMerchantKey();
  const salt = getPayUMerchantSalt();

  if (!key || !salt) {
    throw new Error("PayU credentials (PAYU_MERCHANT_KEY, PAYU_MERCHANT_SALT) are not configured.");
  }

  const hashString = `${key}|${command}|${var1}|${salt}`;
  return crypto.createHash("sha512").update(hashString).digest("hex");
}

export function generatePayUHash(params: PayUPaymentParams): {
  hash: string;
  key: string;
  actionUrl: string;
  apiVersion?: string;
} {
  const key = getPayUMerchantKey();
  const salt = getPayUMerchantSalt();

  if (!key || !salt) {
    throw new Error("PayU credentials (PAYU_MERCHANT_KEY, PAYU_MERCHANT_SALT) are not configured.");
  }

  const {
    txnid,
    amount,
    productinfo,
    firstname,
    email,
    udf1 = "",
    udf2 = "",
    udf3 = "",
    udf4 = "",
    udf5 = "",
    siDetails,
  } = params;

  // Standard: key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5||||||SALT
  // SI (api_version=7): key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5||||||si_details|SALT
  const hashString = siDetails
    ? `${key}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|${udf1}|${udf2}|${udf3}|${udf4}|${udf5}||||||${siDetails}|${salt}`
    : `${key}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|${udf1}|${udf2}|${udf3}|${udf4}|${udf5}||||||${salt}`;

  const hash = crypto.createHash("sha512").update(hashString).digest("hex");

  return {
    hash,
    key,
    actionUrl: getPayUActionUrl(),
    ...(siDetails ? { apiVersion: "7" } : {}),
  };
}

export function verifyPayUResponseHash(responseBody: Record<string, string>): boolean {
  const salt = getPayUMerchantSalt();
  const key = getPayUMerchantKey();

  if (!salt || !key) return false;

  const {
    status = "",
    txnid = "",
    amount = "",
    productinfo = "",
    firstname = "",
    email = "",
    udf1 = "",
    udf2 = "",
    udf3 = "",
    udf4 = "",
    udf5 = "",
    hash = "",
    additionalCharges,
  } = responseBody;

  // Standard reverse hash formula:
  // sha512(SALT|status|udf10|udf9|udf8|udf7|udf6|udf5|udf4|udf3|udf2|udf1|email|firstname|productinfo|amount|txnid|key)
  // which simplifies to:
  // sha512(SALT|status||||||udf5|udf4|udf3|udf2|udf1|email|firstname|productinfo|amount|txnid|key)
  let reverseHashSequence = `${salt}|${status}||||||${udf5}|${udf4}|${udf3}|${udf2}|${udf1}|${email}|${firstname}|${productinfo}|${amount}|${txnid}|${key}`;

  if (additionalCharges) {
    reverseHashSequence = `${additionalCharges}|${reverseHashSequence}`;
  }

  const calculatedHash = crypto
    .createHash("sha512")
    .update(reverseHashSequence)
    .digest("hex");

  return calculatedHash.toLowerCase() === hash.toLowerCase();
}

export function getAppOrigin(): string {
  return (
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ??
    "http://localhost:3000"
  );
}
