import {
  isValidIndianPhone,
  normalizeIndianPhone,
} from "@/lib/billing/phone";

export type CheckoutDetails = {
  firstName: string;
  lastName: string;
  email: string;
  contact: string;
};

export type CheckoutDetailsInput = {
  firstName: string;
  lastName: string;
  email: string;
  contact: string;
};

export function splitFullName(fullName: string): {
  firstName: string;
  lastName: string;
} {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return { firstName: "", lastName: "" };
  }
  if (parts.length === 1) {
    return { firstName: parts[0], lastName: "" };
  }
  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(" "),
  };
}

export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function parseCheckoutDetails(
  input: CheckoutDetailsInput
): { ok: true; details: CheckoutDetails } | { ok: false; error: string } {
  const firstName = input.firstName.trim();
  const lastName = input.lastName.trim();
  const email = input.email.trim().toLowerCase();
  const contact = normalizeIndianPhone(input.contact.trim());

  if (!firstName) {
    return { ok: false, error: "First name is required." };
  }
  if (!lastName) {
    return { ok: false, error: "Last name is required." };
  }
  if (!email || !isValidEmail(email)) {
    return { ok: false, error: "Enter a valid email address." };
  }
  if (!contact || !isValidIndianPhone(input.contact.trim())) {
    return { ok: false, error: "Enter a valid 10-digit mobile number." };
  }

  return {
    ok: true,
    details: { firstName, lastName, email, contact },
  };
}

export function getCheckoutFullName(details: CheckoutDetails): string {
  return `${details.firstName} ${details.lastName}`.trim();
}
