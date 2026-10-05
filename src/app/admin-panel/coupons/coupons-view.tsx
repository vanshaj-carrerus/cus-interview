"use client";

import { Fragment, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { AdminCouponRecord } from "@/lib/billing/admin-coupons";
import { HUMAN_SERVICES, HUMAN_SERVICE_IDS } from "@/lib/billing/human-services";

type DiscountType = AdminCouponRecord["discountType"];

const PRODUCT_OPTIONS = [
  { id: "monthly", label: "Monthly plan" },
  { id: "quarterly", label: "Quarterly plan" },
  ...HUMAN_SERVICE_IDS.map((id) => ({ id, label: HUMAN_SERVICES[id].name })),
];

const FREE_DURATION_PRESETS = [
  { label: "7 days", days: "7" },
  { label: "1 month", days: "30" },
  { label: "3 months", days: "90" },
  { label: "1 year", days: "365" },
  { label: "Lifetime", days: "" },
];

const INPUT_CLASS =
  "mt-1 w-full rounded-lg border border-primary/20 bg-white px-3 py-2 text-sm text-secondary outline-none focus:border-primary";
const LABEL_CLASS = "text-[11px] font-semibold uppercase tracking-wider text-secondary/55";

type FormState = {
  code: string;
  description: string;
  discountType: DiscountType;
  discountValue: string;
  freeAccessDays: string;
  mockInterviewCredits: string;
  resumeAnalyzerCredits: string;
  appliesTo: string[];
  validFrom: string;
  expiresAt: string;
  maxUses: string;
  perUserLimit: string;
  inviteOnly: boolean;
  /** Emails to invite once the coupon is saved (invite-only coupons). */
  inviteEmails: string;
};

const EMPTY_FORM: FormState = {
  code: "",
  description: "",
  discountType: "percent",
  discountValue: "",
  freeAccessDays: "30",
  mockInterviewCredits: "10",
  resumeAnalyzerCredits: "5",
  appliesTo: [],
  validFrom: "",
  expiresAt: "",
  maxUses: "",
  perUserLimit: "1",
  inviteOnly: false,
  inviteEmails: "",
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function splitEmails(raw: string): string[] {
  return raw.split(/[\s,;]+/).filter(Boolean);
}

type InviteResult = {
  email: string;
  status: "activated" | "pending" | "failed";
  emailSent: boolean;
  message?: string;
};

const INVITE_STATUS: Record<
  AdminCouponRecord["invites"][number]["status"],
  { label: string; tone: string }
> = {
  pending: { label: "Waiting for signup", tone: "bg-sky-100 text-sky-700" },
  activated: { label: "Access active", tone: "bg-emerald-100 text-emerald-700" },
  failed: { label: "Not granted", tone: "bg-red-100 text-red-700" },
};

function toDateInput(iso: string | null): string {
  return iso ? iso.slice(0, 10) : "";
}

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function couponState(coupon: AdminCouponRecord): { label: string; tone: string } {
  const now = Date.now();
  if (!coupon.isActive) return { label: "Off", tone: "bg-slate-100 text-slate-600" };
  if (coupon.expiresAt && new Date(coupon.expiresAt).getTime() <= now) {
    return { label: "Expired", tone: "bg-red-100 text-red-700" };
  }
  if (coupon.validFrom && new Date(coupon.validFrom).getTime() > now) {
    return { label: "Scheduled", tone: "bg-sky-100 text-sky-700" };
  }
  if (coupon.maxUses != null && coupon.usedCount >= coupon.maxUses) {
    return { label: "Used up", tone: "bg-amber-100 text-amber-700" };
  }
  return { label: "Live", tone: "bg-emerald-100 text-emerald-700" };
}

function productLabel(ids: string[]): string {
  if (ids.length === 0) return "Everything";
  return ids
    .map((id) => PRODUCT_OPTIONS.find((option) => option.id === id)?.label ?? id)
    .join(", ");
}

export default function CouponsView({ coupons }: { coupons: AdminCouponRecord[] }) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [openUsageId, setOpenUsageId] = useState<string | null>(null);
  const [openInviteId, setOpenInviteId] = useState<string | null>(null);
  const [inviteEmails, setInviteEmails] = useState("");
  const [inviting, setInviting] = useState(false);
  const [inviteMessage, setInviteMessage] = useState<{ tone: "ok" | "error"; text: string } | null>(
    null
  );

  // Invites grant free access / free uses, so only those types can be invite-only.
  const canInviteOnly = form.discountType === "free" || form.discountType === "credits";
  const inviteOnlySelected = canInviteOnly && form.inviteOnly;

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setError(null);
  }

  function toggleProduct(id: string) {
    setForm((prev) => ({
      ...prev,
      appliesTo: prev.appliesTo.includes(id)
        ? prev.appliesTo.filter((item) => item !== id)
        : [...prev.appliesTo, id],
    }));
  }

  function startEdit(coupon: AdminCouponRecord) {
    setEditingId(coupon.id);
    setError(null);
    setForm({
      code: coupon.code,
      description: coupon.description,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue ? String(coupon.discountValue) : "",
      freeAccessDays: coupon.freeAccessDays ? String(coupon.freeAccessDays) : "",
      mockInterviewCredits: String(coupon.mockInterviewCredits),
      resumeAnalyzerCredits: String(coupon.resumeAnalyzerCredits),
      appliesTo: coupon.appliesTo,
      validFrom: toDateInput(coupon.validFrom),
      expiresAt: toDateInput(coupon.expiresAt),
      maxUses: coupon.maxUses ? String(coupon.maxUses) : "",
      perUserLimit: String(coupon.perUserLimit),
      inviteOnly: coupon.inviteOnly,
      inviteEmails: "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setError(null);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    const isFreeType = form.discountType === "free" || form.discountType === "credits";
    const inviteOnly = form.inviteOnly && isFreeType;
    const emails = inviteOnly ? splitEmails(form.inviteEmails) : [];
    const badEmail = emails.find((email) => !EMAIL_RE.test(email));
    if (badEmail) {
      setError(`Not a valid email: ${badEmail}`);
      return;
    }
    if (inviteOnly && !editingId && emails.length === 0) {
      setError("Add at least one email to invite.");
      return;
    }

    setSaving(true);

    // Date inputs are calendar days: start at 00:00, expire at the end of the chosen day (local time).
    const { inviteEmails: _emails, ...fields } = form;
    void _emails;
    const payload = {
      ...fields,
      inviteOnly,
      validFrom: form.validFrom ? new Date(`${form.validFrom}T00:00:00`).toISOString() : null,
      expiresAt: form.expiresAt ? new Date(`${form.expiresAt}T23:59:59`).toISOString() : null,
    };

    try {
      const res = await fetch(
        editingId ? `/api/admin-panel/coupons/${editingId}` : "/api/admin-panel/coupons",
        {
          method: editingId ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const data = (await res.json().catch(() => ({}))) as { error?: string; id?: string };
      if (!res.ok) {
        setError(data.error ?? "Could not save coupon.");
        return;
      }
      const couponId = editingId ?? data.id;
      cancelEdit();
      if (couponId && emails.length > 0) {
        // Show the send results (and invite list) under the coupon's row.
        setOpenInviteId(couponId);
        await sendInvites(couponId, emails.join("\n"));
      } else {
        router.refresh();
      }
    } catch {
      setError("Could not save coupon.");
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(coupon: AdminCouponRecord) {
    const givesFreeAccess =
      coupon.discountType === "free" || coupon.discountType === "credits";
    if (
      coupon.isActive &&
      givesFreeAccess &&
      coupon.usedCount > 0 &&
      !window.confirm(
        `Turn off ${coupon.code}? Users who got free access from it will lose it until you turn it back on.`
      )
    ) {
      return;
    }
    setBusyId(coupon.id);
    await fetch(`/api/admin-panel/coupons/${coupon.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !coupon.isActive }),
    });
    setBusyId(null);
    router.refresh();
  }

  async function deleteCoupon(coupon: AdminCouponRecord) {
    const givesFreeAccess =
      coupon.discountType === "free" || coupon.discountType === "credits";
    const warning =
      givesFreeAccess && coupon.usedCount > 0
        ? " Users who got free access from it will lose it permanently."
        : "";
    if (!window.confirm(`Delete coupon ${coupon.code}? This cannot be undone.${warning}`)) return;
    setBusyId(coupon.id);
    await fetch(`/api/admin-panel/coupons/${coupon.id}`, { method: "DELETE" });
    setBusyId(null);
    if (editingId === coupon.id) cancelEdit();
    router.refresh();
  }

  function toggleInvitePanel(coupon: AdminCouponRecord) {
    setOpenInviteId(openInviteId === coupon.id ? null : coupon.id);
    setInviteEmails("");
    setInviteMessage(null);
  }

  async function sendInvites(couponId: string, emails = inviteEmails) {
    setInviting(true);
    setInviteMessage(null);
    try {
      const res = await fetch(`/api/admin-panel/coupons/${couponId}/invites`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emails }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        results?: InviteResult[];
      };
      if (!res.ok || !data.results) {
        setInviteMessage({ tone: "error", text: data.error ?? "Could not send invites." });
        return;
      }
      const problems = data.results.filter((r) => r.status === "failed" || !r.emailSent);
      const sent = data.results.length - problems.length;
      setInviteMessage({
        tone: problems.length > 0 ? "error" : "ok",
        text: [
          sent > 0 ? `Invite sent to ${sent} email${sent === 1 ? "" : "s"}.` : "",
          ...problems.map((r) => `${r.email}: ${r.message ?? "Could not invite."}`),
        ]
          .filter(Boolean)
          .join(" "),
      });
      setInviteEmails("");
      router.refresh();
    } catch {
      setInviteMessage({ tone: "error", text: "Could not send invites." });
    } finally {
      setInviting(false);
    }
  }

  return (
    <div className="min-w-0 space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-secondary">Coupons</h2>
        <p className="mt-1 text-sm text-secondary/70">
          Create discount or free-access codes. Users enter them at checkout on the pricing page,
          or use Invite on a free coupon to email it — invited users get access as soon as they
          sign up.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-xl border border-primary/15 bg-white p-5"
      >
        <h3 className="text-sm font-semibold text-secondary">
          {editingId ? `Edit coupon ${form.code}` : "New coupon"}
        </h3>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className={LABEL_CLASS}>Code</label>
            <input
              value={form.code}
              onChange={(event) =>
                update("code", event.target.value.toUpperCase().replace(/[^A-Z0-9_-]/g, ""))
              }
              placeholder="WELCOME20"
              maxLength={30}
              className={INPUT_CLASS}
            />
          </div>

          <div>
            <label className={LABEL_CLASS}>Type</label>
            <select
              value={form.discountType}
              onChange={(event) => update("discountType", event.target.value as DiscountType)}
              className={INPUT_CLASS}
            >
              <option value="percent">% off</option>
              <option value="flat">Flat ₹ off</option>
              <option value="free">Free access</option>
              <option value="credits">Free uses (mock interviews / resume)</option>
            </select>
          </div>

          {form.discountType === "credits" || form.discountType === "free" ? (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={LABEL_CLASS}>
                  {form.discountType === "free" ? "Mock interview limit (0 = unlimited)" : "Free mock interviews"}
                </label>
                <input
                  type="number"
                  min={0}
                  value={form.mockInterviewCredits}
                  onChange={(event) => update("mockInterviewCredits", event.target.value)}
                  className={INPUT_CLASS}
                />
              </div>
              <div>
                <label className={LABEL_CLASS}>
                  {form.discountType === "free" ? "Resume analysis limit (0 = unlimited)" : "Free resume analyses"}
                </label>
                <input
                  type="number"
                  min={0}
                  value={form.resumeAnalyzerCredits}
                  onChange={(event) => update("resumeAnalyzerCredits", event.target.value)}
                  className={INPUT_CLASS}
                />
              </div>
            </div>
          ) : null}

          {form.discountType === "free" || form.discountType === "credits" ? (
            <div>
              <label className={LABEL_CLASS}>
                {form.discountType === "credits" ? "Free uses valid for" : "Free access for"}
              </label>
              <div className="mt-1 flex flex-wrap gap-1.5">
                {FREE_DURATION_PRESETS.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => update("freeAccessDays", preset.days)}
                    className={`rounded-full border px-2.5 py-1 text-xs font-medium ${
                      form.freeAccessDays === preset.days
                        ? "border-primary bg-primary text-white"
                        : "border-primary/20 text-secondary/70 hover:border-primary"
                    }`}
                  >
                    {form.discountType === "credits" && preset.days === "" ? "No expiry" : preset.label}
                  </button>
                ))}
              </div>
              <input
                type="number"
                min={1}
                value={form.freeAccessDays}
                onChange={(event) => update("freeAccessDays", event.target.value)}
                placeholder={form.discountType === "credits" ? "Days (empty = no expiry)" : "Days (empty = lifetime)"}
                className={INPUT_CLASS}
              />
            </div>
          ) : (
            <div>
              <label className={LABEL_CLASS}>
                {form.discountType === "percent" ? "Percent off (1–100)" : "Amount off (₹, before GST)"}
              </label>
              <input
                type="number"
                min={1}
                max={form.discountType === "percent" ? 100 : undefined}
                value={form.discountValue}
                onChange={(event) => update("discountValue", event.target.value)}
                placeholder={form.discountType === "percent" ? "20" : "100"}
                className={INPUT_CLASS}
              />
            </div>
          )}

          <div>
            <label className={LABEL_CLASS}>Starts on (optional)</label>
            <input
              type="date"
              value={form.validFrom}
              onChange={(event) => update("validFrom", event.target.value)}
              className={INPUT_CLASS}
            />
          </div>

          <div>
            <label className={LABEL_CLASS}>Expires on (empty = never)</label>
            <input
              type="date"
              value={form.expiresAt}
              onChange={(event) => update("expiresAt", event.target.value)}
              className={INPUT_CLASS}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={LABEL_CLASS}>Who can use</label>
              {canInviteOnly ? (
                <div className="mt-1 flex gap-1.5">
                  {[
                    { label: "Total users", inviteOnly: false },
                    { label: "Email invites", inviteOnly: true },
                  ].map((option) => (
                    <button
                      key={option.label}
                      type="button"
                      onClick={() => update("inviteOnly", option.inviteOnly)}
                      className={`rounded-full border px-2.5 py-1 text-xs font-medium ${
                        inviteOnlySelected === option.inviteOnly
                          ? "border-primary bg-primary text-white"
                          : "border-primary/20 text-secondary/70 hover:border-primary"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              ) : null}
              {inviteOnlySelected ? (
                <p className="mt-2 text-xs text-secondary/60">
                  Only the emails below can use it.
                </p>
              ) : (
                <input
                  type="number"
                  min={1}
                  value={form.maxUses}
                  onChange={(event) => update("maxUses", event.target.value)}
                  placeholder="Max total uses (empty = unlimited)"
                  className={INPUT_CLASS}
                />
              )}
            </div>
            <div>
              <label className={LABEL_CLASS}>Uses per user</label>
              <input
                type="number"
                min={1}
                value={form.perUserLimit}
                onChange={(event) => update("perUserLimit", event.target.value)}
                className={INPUT_CLASS}
              />
            </div>
          </div>
        </div>

        {inviteOnlySelected ? (
          <div>
            <label className={LABEL_CLASS}>
              {editingId ? "Invite more emails (optional)" : "Emails to invite"}
            </label>
            <p className="mt-0.5 text-xs text-secondary/60">
              One per line or comma separated. Each person gets an invite link by email when you
              save. Existing users get access right away; new users get it when they sign up.
            </p>
            <textarea
              value={form.inviteEmails}
              onChange={(event) => update("inviteEmails", event.target.value)}
              rows={3}
              placeholder={"student1@college.edu\nstudent2@college.edu"}
              className={INPUT_CLASS}
            />
          </div>
        ) : null}

        <div>
          <label className={LABEL_CLASS}>Works on (none selected = everything)</label>
          <div className="mt-2 flex flex-wrap gap-2">
            {PRODUCT_OPTIONS.map((option) => (
              <label
                key={option.id}
                className="flex cursor-pointer items-center gap-2 rounded-lg border border-primary/15 px-3 py-1.5 text-xs text-secondary"
              >
                <input
                  type="checkbox"
                  checked={form.appliesTo.includes(option.id)}
                  onChange={() => toggleProduct(option.id)}
                />
                {option.label}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className={LABEL_CLASS}>Note (admin only)</label>
          <input
            value={form.description}
            onChange={(event) => update("description", event.target.value)}
            placeholder="e.g. College partnership — Sept batch"
            className={INPUT_CLASS}
          />
        </div>

        {error ? (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        ) : null}

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white disabled:opacity-60"
          >
            {saving
              ? "Saving…"
              : editingId
                ? "Save changes"
                : inviteOnlySelected
                  ? "Create & send invites"
                  : "Create coupon"}
          </button>
          {editingId ? (
            <button
              type="button"
              onClick={cancelEdit}
              className="rounded-lg border border-primary/20 px-5 py-2 text-sm font-semibold text-secondary"
            >
              Cancel
            </button>
          ) : null}
        </div>
      </form>

      <div className="overflow-x-auto rounded-xl border border-primary/15 bg-white">
        <table className="w-full min-w-[900px] text-left">
          <thead>
            <tr className="border-b border-primary/10 bg-primary/[0.04] text-[10px] font-semibold uppercase tracking-wider text-secondary/55">
              <th className="px-3 py-3">Code</th>
              <th className="px-3 py-3">Discount</th>
              <th className="px-3 py-3">Works on</th>
              <th className="px-3 py-3">Valid</th>
              <th className="px-3 py-3">Used</th>
              <th className="px-3 py-3">Status</th>
              <th className="px-3 py-3" />
            </tr>
          </thead>
          <tbody>
            {coupons.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-3 py-8 text-center text-sm text-secondary/50">
                  No coupons yet.
                </td>
              </tr>
            ) : (
              coupons.map((coupon) => {
                const state = couponState(coupon);
                const usageOpen = openUsageId === coupon.id;
                const inviteOpen = openInviteId === coupon.id;
                const canInvite =
                  coupon.discountType === "free" || coupon.discountType === "credits";
                return (
                  <Fragment key={coupon.id}>
                  <tr className="border-b border-primary/5 text-sm text-secondary">
                    <td className="px-3 py-3">
                      <p className="font-mono font-semibold">{coupon.code}</p>
                      {coupon.description ? (
                        <p className="text-xs text-secondary/50">{coupon.description}</p>
                      ) : null}
                    </td>
                    <td className="px-3 py-3">{coupon.label}</td>
                    <td className="max-w-[200px] px-3 py-3 text-xs text-secondary/70">
                      {productLabel(coupon.appliesTo)}
                    </td>
                    <td className="px-3 py-3 text-xs text-secondary/70">
                      {formatDate(coupon.validFrom)} → {coupon.expiresAt ? formatDate(coupon.expiresAt) : "No expiry"}
                    </td>
                    <td className="px-3 py-3 text-xs">
                      {coupon.usedCount}
                      {coupon.inviteOnly
                        ? ` / ${coupon.invites.length} invited`
                        : coupon.maxUses != null
                          ? ` / ${coupon.maxUses}`
                          : ""}
                      <span className="block text-secondary/50">
                        {coupon.inviteOnly ? "Invite only" : `${coupon.perUserLimit}× per user`}
                      </span>
                      {coupon.redemptions.length > 0 ? (
                        <button
                          type="button"
                          onClick={() => setOpenUsageId(usageOpen ? null : coupon.id)}
                          className="mt-1 font-semibold text-primary hover:underline"
                        >
                          {usageOpen ? "Hide users" : `View users (${coupon.redemptions.length})`}
                        </button>
                      ) : null}
                    </td>
                    <td className="px-3 py-3">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${state.tone}`}
                      >
                        {state.label}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 text-right text-xs">
                      {canInvite ? (
                        <button
                          type="button"
                          onClick={() => toggleInvitePanel(coupon)}
                          disabled={busyId === coupon.id}
                          className="mr-3 font-semibold text-primary hover:underline"
                        >
                          {inviteOpen
                            ? "Close invites"
                            : `Invite${coupon.invites.length > 0 ? ` (${coupon.invites.length})` : ""}`}
                        </button>
                      ) : null}
                      <button
                        type="button"
                        onClick={() => startEdit(coupon)}
                        disabled={busyId === coupon.id}
                        className="mr-3 font-semibold text-primary hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleActive(coupon)}
                        disabled={busyId === coupon.id}
                        className="mr-3 font-semibold text-secondary/70 hover:underline"
                      >
                        {coupon.isActive ? "Turn off" : "Turn on"}
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteCoupon(coupon)}
                        disabled={busyId === coupon.id}
                        className="font-semibold text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                  {inviteOpen ? (
                    <tr className="border-b border-primary/5 bg-primary/[0.02]">
                      <td colSpan={7} className="space-y-3 px-3 py-3">
                        <div>
                          <label className={LABEL_CLASS}>Invite by email — {coupon.label}</label>
                          <p className="mt-0.5 text-xs text-secondary/60">
                            Paste one or more emails (comma or new line). Existing users get access
                            right away; new users get it automatically when they sign up with that email.
                          </p>
                          <textarea
                            value={inviteEmails}
                            onChange={(event) => {
                              setInviteEmails(event.target.value);
                              setInviteMessage(null);
                            }}
                            rows={3}
                            placeholder={"student1@college.edu\nstudent2@college.edu"}
                            className={INPUT_CLASS}
                          />
                        </div>
                        {inviteMessage ? (
                          <p
                            className={`text-xs ${inviteMessage.tone === "ok" ? "text-emerald-700" : "text-red-600"}`}
                            role="status"
                          >
                            {inviteMessage.text}
                          </p>
                        ) : null}
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => sendInvites(coupon.id)}
                            disabled={inviting || !inviteEmails.trim() || !coupon.isActive}
                            className="rounded-lg bg-primary px-4 py-1.5 text-xs font-semibold text-white disabled:opacity-60"
                          >
                            {inviting ? "Sending…" : "Send invite"}
                          </button>
                          {!coupon.isActive ? (
                            <span className="text-xs text-secondary/60">
                              Turn the coupon on to send invites.
                            </span>
                          ) : null}
                        </div>

                        {coupon.invites.length > 0 ? (
                          <table className="w-full text-left text-xs text-secondary">
                            <thead>
                              <tr className="text-[10px] font-semibold uppercase tracking-wider text-secondary/50">
                                <th className="px-2 py-1.5">Email</th>
                                <th className="px-2 py-1.5">Status</th>
                                <th className="px-2 py-1.5">Invited</th>
                                <th className="px-2 py-1.5">Last emailed</th>
                                <th className="px-2 py-1.5" />
                              </tr>
                            </thead>
                            <tbody>
                              {coupon.invites.map((invite) => (
                                <tr key={invite.id} className="border-t border-primary/5">
                                  <td className="px-2 py-1.5 font-medium">{invite.email}</td>
                                  <td className="px-2 py-1.5">
                                    <span
                                      className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${INVITE_STATUS[invite.status].tone}`}
                                    >
                                      {INVITE_STATUS[invite.status].label}
                                    </span>
                                    {invite.status === "failed" && invite.failureReason ? (
                                      <span className="ml-2 text-secondary/60">{invite.failureReason}</span>
                                    ) : null}
                                  </td>
                                  <td className="px-2 py-1.5">{formatDate(invite.invitedAt || null)}</td>
                                  <td className="px-2 py-1.5">{formatDate(invite.lastEmailedAt)}</td>
                                  <td className="px-2 py-1.5 text-right">
                                    <button
                                      type="button"
                                      onClick={() => sendInvites(coupon.id, invite.email)}
                                      disabled={inviting || !coupon.isActive}
                                      className="font-semibold text-primary hover:underline disabled:opacity-50"
                                    >
                                      Resend
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        ) : null}
                      </td>
                    </tr>
                  ) : null}
                  {usageOpen ? (() => {
                    const isCredits =
                      coupon.discountType === "credits" ||
                      (coupon.discountType === "free" &&
                        (coupon.mockInterviewCredits > 0 || coupon.resumeAnalyzerCredits > 0));
                    return (
                    <tr className="border-b border-primary/5 bg-primary/[0.02]">
                      <td colSpan={7} className="px-3 py-3">
                        <table className="w-full text-left text-xs text-secondary">
                          <thead>
                            <tr className="text-[10px] font-semibold uppercase tracking-wider text-secondary/50">
                              <th className="px-2 py-1.5">User</th>
                              <th className="px-2 py-1.5">Email</th>
                              {isCredits ? (
                                <>
                                  <th className="px-2 py-1.5">AI mock interviews used</th>
                                  <th className="px-2 py-1.5">Resume analyses used</th>
                                  <th className="px-2 py-1.5">Free uses expire</th>
                                </>
                              ) : (
                                <>
                                  <th className="px-2 py-1.5">Used on</th>
                                  <th className="px-2 py-1.5">Discount</th>
                                  <th className="px-2 py-1.5">Paid</th>
                                </>
                              )}
                              <th className="px-2 py-1.5">Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            {coupon.redemptions.map((r) => (
                              <tr key={r.id} className="border-t border-primary/5">
                                <td className="px-2 py-1.5 font-medium">{r.userName}</td>
                                <td className="px-2 py-1.5">{r.userEmail || "—"}</td>
                                {isCredits ? (
                                  <>
                                    <td className="px-2 py-1.5">
                                      {r.creditUsage
                                        ? `${r.creditUsage.mockInterviewUsed} / ${r.creditUsage.mockInterviewTotal}`
                                        : "—"}
                                    </td>
                                    <td className="px-2 py-1.5">
                                      {r.creditUsage
                                        ? `${r.creditUsage.resumeAnalyzerUsed} / ${r.creditUsage.resumeAnalyzerTotal}`
                                        : "—"}
                                    </td>
                                    <td className="px-2 py-1.5">
                                      {r.creditUsage
                                        ? r.creditUsage.expiresAt
                                          ? formatDate(r.creditUsage.expiresAt)
                                          : "No expiry"
                                        : "—"}
                                    </td>
                                  </>
                                ) : (
                                  <>
                                    <td className="px-2 py-1.5">{productLabel([r.productId])}</td>
                                    <td className="px-2 py-1.5">₹{r.discountAmount.toLocaleString("en-IN")}</td>
                                    <td className="px-2 py-1.5">
                                      {r.amountPaid === 0 ? "Free" : `₹${r.amountPaid.toLocaleString("en-IN")}`}
                                    </td>
                                  </>
                                )}
                                <td className="px-2 py-1.5">{formatDate(r.usedAt || null)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </td>
                    </tr>
                    );
                  })() : null}
                  </Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
