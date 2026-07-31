import {
  generatePayUPostServiceHash,
  getPayUMerchantKey,
  getPayUPostServiceUrl,
} from "@/lib/payu";

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

  const data = (await response.json().catch(() => ({}))) as PayUPostServiceResponse;
  return data;
}

function formatDebitDate(date = new Date()): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export type PayURecurringChargeInput = {
  authPayuId: string;
  amount: string;
  txnid: string;
  phone?: string;
  email?: string;
  invoiceDisplayNumber?: string;
  mandateSeqNo?: number;
};

export type PayURecurringChargeResult = {
  ok: boolean;
  status?: string;
  message?: string;
  payuId?: string;
};

export async function sendPayUPreDebitNotification(
  input: PayURecurringChargeInput
): Promise<PayURecurringChargeResult> {
  const requestId = `${input.txnid}-predebit`;
  const var1: Record<string, unknown> = {
    authpayuid: input.authPayuId,
    requestId,
    debitDate: formatDebitDate(),
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

  return { ok: true, message: response.message };
}

export async function executePayURecurringCharge(
  input: PayURecurringChargeInput
): Promise<PayURecurringChargeResult> {
  const preDebit = await sendPayUPreDebitNotification(input);
  if (!preDebit.ok) {
    return preDebit;
  }

  const var1: Record<string, unknown> = {
    authpayuid: input.authPayuId,
    amount: input.amount,
    txnid: input.txnid,
    phone: input.phone ?? "",
    email: input.email ?? "",
    udf1: "plan-first-charge",
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
      message: response.msg ?? response.message ?? "Recurring charge failed.",
    };
  }

  const details = response.details?.[input.txnid];
  const chargeStatus = details?.status?.toLowerCase() ?? "";
  const successStatuses = new Set(["captured", "pending", "in progress", "in-progress"]);

  if (!successStatuses.has(chargeStatus)) {
    return {
      ok: false,
      status: chargeStatus,
      message: details?.field9 ?? "Recurring charge was not successful.",
    };
  }

  return {
    ok: true,
    status: chargeStatus,
    message: details?.field9 ?? response.message,
    payuId: details?.payuid,
  };
}
