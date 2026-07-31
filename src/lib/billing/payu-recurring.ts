import {
  generatePayUPostServiceHash,
  getPayUMerchantKey,
  getPayUPostServiceUrl,
} from "@/lib/payu";
import { formatDateYYYYMMDD } from "@/lib/billing/payu-billing-dates";
import { getPayUMandateToken } from "@/lib/billing/payu-mandate";

type PayUPostServiceResponse = {
  status?: number;
  message?: string;
  msg?: string;
  details?: Record<
    string,
    {
      status?: string;
      field9?: string;
      payuid?: string;
    }
  >;
};

type MandateUserLike = {
  _id: { toString(): string };
  payuMandateToken?: string | null;
  payuAuthPayuId?: string | null;
  phone?: string | null;
  email?: string | null;
};

async function callPayUPostService(
  command: string,
  var1: Record<string, unknown>
): Promise<PayUPostServiceResponse> {
  const var1Json = JSON.stringify(var1);
  const hash = generatePayUPostServiceHash(command, var1Json);
  const body = new URLSearchParams({
    form: "2",
    key: getPayUMerchantKey(),
    command,
    var1: var1Json,
    hash,
  });

  const response = await fetch(`${getPayUPostServiceUrl()}?form=2`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });

  return (await response.json().catch(() => ({}))) as PayUPostServiceResponse;
}

export type PayURecurringChargeResult = {
  ok: boolean;
  status?: string;
  message?: string;
  payuId?: string;
  txnid?: string;
};

type RecurringChargeOptions = {
  authPayuId: string;
  amount: string;
  txnid: string;
  phone?: string;
  email?: string;
  invoiceDisplayNumber?: string;
  mandateSeqNo?: number;
  debitDate?: string;
};

/**
 * PayU Pre-Debit Notification — must be sent ≥24 hours before `debitDate` (RBI rule).
 * @see https://docs.payu.in/reference/subscriptions-pdn-rp
 */
export async function sendPayUPreDebitNotification(
  input: RecurringChargeOptions
): Promise<PayURecurringChargeResult> {
  const requestId = `${input.txnid}-predebit`;
  const var1: Record<string, unknown> = {
    authpayuid: input.authPayuId,
    requestId,
    debitDate: input.debitDate ?? formatDateYYYYMMDD(new Date()),
    amount: input.amount,
  };

  if (input.invoiceDisplayNumber) {
    var1.invoiceDisplayNumber = input.invoiceDisplayNumber;
  }

  const response = await callPayUPostService("pre_debit_SI", var1);
  if (response.status !== 1) {
    return {
      ok: false,
      message: response.msg ?? response.message ?? "Pre-debit notification failed.",
    };
  }

  return { ok: true, message: response.message, txnid: input.txnid };
}

/**
 * PayU Recurring Payment Transaction API (`si_transaction`).
 * Call only after pre_debit_SI was sent ≥24 hours earlier for the same debit date.
 * @see https://docs.payu.in/reference/recurring_payment_api
 */
export async function executePayURecurringTransaction(
  input: RecurringChargeOptions
): Promise<PayURecurringChargeResult> {
  const var1: Record<string, unknown> = {
    authpayuid: input.authPayuId,
    amount: input.amount,
    txnid: input.txnid,
    phone: input.phone ?? "",
    email: input.email ?? "",
    udf1: "recurring-subscription",
  };

  if (input.invoiceDisplayNumber) {
    var1.invoiceDisplayNumber = input.invoiceDisplayNumber;
  }

  if (input.mandateSeqNo !== undefined) {
    var1.mandateSeqNo = input.mandateSeqNo;
  }

  const response = await callPayUPostService("si_transaction", var1);
  if (response.status !== 1) {
    return {
      ok: false,
      txnid: input.txnid,
      message: response.msg ?? response.message ?? "Recurring charge failed.",
    };
  }

  const details = response.details?.[input.txnid];
  const chargeStatus = details?.status?.toLowerCase() ?? "";
  const successStatuses = new Set([
    "captured",
    "pending",
    "in progress",
    "in-progress",
  ]);

  if (!successStatuses.has(chargeStatus)) {
    return {
      ok: false,
      status: chargeStatus,
      txnid: input.txnid,
      message: details?.field9 ?? "Recurring charge was not successful.",
    };
  }

  return {
    ok: true,
    status: chargeStatus,
    txnid: input.txnid,
    message: details?.field9 ?? response.message,
    payuId: details?.payuid,
  };
}

function buildRecurringTxnId(userId: string): string {
  return `rec${Date.now()}${userId.slice(-6)}`;
}

type PreDebitInput = MandateUserLike & {
  planAmount: number;
  nextBillingDate: Date;
};

/** Sends pre_debit_SI for an upcoming `nextBillingDate` (no si_transaction). */
export async function sendPreDebitForUpcomingBilling(
  user: PreDebitInput
): Promise<PayURecurringChargeResult> {
  const authPayuId = getPayUMandateToken(user);
  if (!authPayuId) {
    return { ok: false, message: "Missing PayU mandate token (mihpayid)." };
  }

  const txnid = buildRecurringTxnId(user._id.toString());
  return sendPayUPreDebitNotification({
    authPayuId,
    amount: user.planAmount.toFixed(2),
    txnid,
    phone: user.phone ?? "",
    email: user.email ?? "",
    invoiceDisplayNumber: `INV-${txnid}`,
    debitDate: formatDateYYYYMMDD(user.nextBillingDate),
  });
}

/**
 * Executes si_transaction only — pre_debit_SI must already have been sent ≥24h prior.
 */
export async function chargeRecurringSubscription(
  user: MandateUserLike,
  amount: number
): Promise<PayURecurringChargeResult> {
  const authPayuId = getPayUMandateToken(user);
  if (!authPayuId) {
    return { ok: false, message: "Missing PayU mandate token (mihpayid)." };
  }

  const txnid = buildRecurringTxnId(user._id.toString());

  return executePayURecurringTransaction({
    authPayuId,
    amount: amount.toFixed(2),
    txnid,
    phone: user.phone ?? "",
    email: user.email ?? "",
    invoiceDisplayNumber: `INV-${txnid}`,
    mandateSeqNo: 2,
  });
}
