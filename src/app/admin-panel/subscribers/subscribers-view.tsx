"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { X } from "lucide-react";
import type { AdminPlatformSubscriber, AdminServicePayment } from "@/lib/billing/admin-subscribers";

function StatusBadge({ label, tone }: { label: string; tone: string }) {
  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${tone}`}
    >
      {label}
    </span>
  );
}

function statusTone(status: string): string {
  switch (status) {
    case "trialing":
      return "bg-sky-100 text-sky-700";
    case "active":
      return "bg-emerald-100 text-emerald-700";
    case "past_due":
      return "bg-amber-100 text-amber-700";
    case "canceled":
      return "bg-slate-100 text-slate-600";
    default:
      return "bg-slate-100 text-slate-500";
  }
}

function Cell({ children, title }: { children: ReactNode; title?: string }) {
  return (
    <td className="whitespace-nowrap px-3 py-3 text-sm text-secondary/80" title={title}>
      {children}
    </td>
  );
}

function DetailRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="grid gap-1 border-b border-primary/8 py-3 sm:grid-cols-[140px_1fr] sm:gap-4">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-secondary/45">
        {label}
      </p>
      <div className="text-sm text-secondary break-words">{value}</div>
    </div>
  );
}

function DetailModal({
  title,
  subtitle,
  onClose,
  children,
}: {
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: ReactNode;
}) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [handleKeyDown]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/45 p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-primary/15 bg-white shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="subscriber-detail-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="sticky top-0 flex items-start justify-between gap-3 border-b border-primary/10 bg-white px-5 py-4">
          <div>
            <h3
              id="subscriber-detail-title"
              className="text-lg font-semibold text-secondary"
            >
              {title}
            </h3>
            {subtitle ? (
              <p className="mt-0.5 text-sm text-secondary/55">{subtitle}</p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-secondary/45 transition hover:bg-primary/5 hover:text-secondary"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="px-5 py-2">{children}</div>
      </div>
    </div>
  );
}

function PlatformSubscriberDetailModal({
  row,
  onClose,
}: {
  row: AdminPlatformSubscriber;
  onClose: () => void;
}) {
  return (
    <DetailModal
      title={row.fullName}
      subtitle="Platform plan subscriber"
      onClose={onClose}
    >
      <DetailRow label="First name" value={row.firstName || "—"} />
      <DetailRow label="Last name" value={row.lastName || "—"} />
      <DetailRow label="Email" value={row.email} />
      <DetailRow label="Mobile" value={row.phone} />
      <DetailRow label="Plan" value={row.planLabel} />
      <DetailRow
        label="Status"
        value={
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge label={row.statusLabel} tone={statusTone(row.status)} />
            {row.cancelAtPeriodEnd ? (
              <span className="text-xs text-amber-700">Cancel scheduled</span>
            ) : null}
          </div>
        }
      />
      <DetailRow label="Subscribed on" value={row.subscribedAt} />
      <DetailRow
        label="Days joined"
        value={
          row.daysSinceSubscribe !== null
            ? `${row.daysSinceSubscribe} days`
            : "—"
        }
      />
      <DetailRow label="Account created" value={row.accountJoinedAt} />
      <DetailRow label="Period ends" value={row.periodEndsAt} />
      <DetailRow
        label="Days left"
        value={
          row.daysRemaining !== null ? `${row.daysRemaining} days` : "—"
        }
      />
      <DetailRow label="Renewal" value={row.renewalLabel} />
      <DetailRow
        label="Razorpay sub ID"
        value={
          <span className="font-mono text-xs break-all">
            {row.razorpaySubscriptionId}
          </span>
        }
      />
    </DetailModal>
  );
}

function ServicePaymentDetailModal({
  row,
  onClose,
}: {
  row: AdminServicePayment;
  onClose: () => void;
}) {
  return (
    <DetailModal
      title={row.fullName}
      subtitle={row.serviceName}
      onClose={onClose}
    >
      <DetailRow label="First name" value={row.firstName || "—"} />
      <DetailRow label="Last name" value={row.lastName || "—"} />
      <DetailRow label="Email" value={row.email} />
      <DetailRow label="Mobile" value={row.phone} />
      <DetailRow label="Service" value={row.serviceName} />
      <DetailRow
        label="Amount paid"
        value={`₹${row.amountInr.toLocaleString("en-IN")} (incl. GST)`}
      />
      <DetailRow label="Paid on" value={row.paidAt} />
      <DetailRow
        label="Payment ID"
        value={<span className="font-mono text-xs break-all">{row.paymentId}</span>}
      />
      <DetailRow
        label="Order ID"
        value={<span className="font-mono text-xs break-all">{row.orderId}</span>}
      />
    </DetailModal>
  );
}

function PlatformSubscribersTable({
  rows,
  onSelect,
}: {
  rows: AdminPlatformSubscriber[];
  onSelect: (row: AdminPlatformSubscriber) => void;
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-primary/15">
      <table className="w-full min-w-[1200px] text-left">
        <thead>
          <tr className="border-b border-primary/10 bg-primary/[0.04] text-[10px] font-semibold uppercase tracking-wider text-secondary/55">
            <th className="px-3 py-3">First name</th>
            <th className="px-3 py-3">Last name</th>
            <th className="px-3 py-3">Email</th>
            <th className="px-3 py-3">Mobile</th>
            <th className="px-3 py-3">Plan</th>
            <th className="px-3 py-3">Status</th>
            <th className="px-3 py-3">Subscribed</th>
            <th className="px-3 py-3">Joined</th>
            <th className="px-3 py-3">Ends</th>
            <th className="px-3 py-3">Left</th>
            <th className="px-3 py-3">Renewal</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.id}
              onClick={() => onSelect(row)}
              className="cursor-pointer border-b border-primary/5 transition hover:bg-primary/[0.06]"
            >
              <Cell>{row.firstName || "—"}</Cell>
              <Cell>{row.lastName || "—"}</Cell>
              <Cell title={row.email}>
                <span className="block max-w-[180px] truncate">{row.email}</span>
              </Cell>
              <Cell>{row.phone}</Cell>
              <Cell>
                <span className="block max-w-[140px] truncate">{row.planLabel}</span>
              </Cell>
              <Cell>
                <div className="flex items-center gap-1.5">
                  <StatusBadge label={row.statusLabel} tone={statusTone(row.status)} />
                  {row.cancelAtPeriodEnd ? (
                    <span className="text-[10px] text-amber-600">↓</span>
                  ) : null}
                </div>
              </Cell>
              <Cell>{row.subscribedAt}</Cell>
              <Cell>
                {row.daysSinceSubscribe !== null
                  ? `${row.daysSinceSubscribe}d`
                  : "—"}
              </Cell>
              <Cell>{row.periodEndsAt}</Cell>
              <Cell>
                <span
                  className={
                    row.daysRemaining !== null && row.daysRemaining <= 3
                      ? "font-semibold text-amber-700"
                      : ""
                  }
                >
                  {row.daysRemaining !== null ? `${row.daysRemaining}d` : "—"}
                </span>
              </Cell>
              <Cell title={row.renewalLabel}>
                <span className="block max-w-[160px] truncate text-xs">
                  {row.renewalLabel}
                </span>
              </Cell>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ServicePaymentsTable({
  rows,
  onSelect,
}: {
  rows: AdminServicePayment[];
  onSelect: (row: AdminServicePayment) => void;
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-primary/15">
      <table className="w-full min-w-[900px] text-left">
        <thead>
          <tr className="border-b border-primary/10 bg-primary/[0.04] text-[10px] font-semibold uppercase tracking-wider text-secondary/55">
            <th className="px-3 py-3">First name</th>
            <th className="px-3 py-3">Last name</th>
            <th className="px-3 py-3">Email</th>
            <th className="px-3 py-3">Mobile</th>
            <th className="px-3 py-3">Service</th>
            <th className="px-3 py-3">Paid</th>
            <th className="px-3 py-3">Amount</th>
            <th className="px-3 py-3">Payment ID</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.id}
              onClick={() => onSelect(row)}
              className="cursor-pointer border-b border-primary/5 transition hover:bg-primary/[0.06]"
            >
              <Cell>{row.firstName || "—"}</Cell>
              <Cell>{row.lastName || "—"}</Cell>
              <Cell title={row.email}>
                <span className="block max-w-[180px] truncate">{row.email}</span>
              </Cell>
              <Cell>{row.phone}</Cell>
              <Cell>{row.serviceName}</Cell>
              <Cell>{row.paidAt}</Cell>
              <Cell>₹{row.amountInr.toLocaleString("en-IN")}</Cell>
              <Cell title={row.paymentId}>
                <span className="block max-w-[120px] truncate font-mono text-xs">
                  {row.paymentId}
                </span>
              </Cell>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

type SubscribersViewProps = {
  platformRows: AdminPlatformSubscriber[];
  serviceRows: AdminServicePayment[];
  stats: {
    platformTotal: number;
    platformActive: number;
    servicePaymentsTotal: number;
  };
};

export default function SubscribersView({
  platformRows,
  serviceRows,
  stats,
}: SubscribersViewProps) {
  const [selectedPlatform, setSelectedPlatform] =
    useState<AdminPlatformSubscriber | null>(null);
  const [selectedService, setSelectedService] =
    useState<AdminServicePayment | null>(null);

  return (
    <div className="min-w-0 space-y-8">
      {selectedPlatform ? (
        <PlatformSubscriberDetailModal
          row={selectedPlatform}
          onClose={() => setSelectedPlatform(null)}
        />
      ) : null}
      {selectedService ? (
        <ServicePaymentDetailModal
          row={selectedService}
          onClose={() => setSelectedService(null)}
        />
      ) : null}

      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
          Billing overview
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-secondary">
          Subscribers
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-secondary/65">
          Platform plan subscribers ane successful expert service payments. Row
          par click karo — full details popup ma dikhse.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Platform subscribers", value: stats.platformTotal },
          { label: "Active / trial", value: stats.platformActive },
          { label: "Service payments", value: stats.servicePaymentsTotal },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-primary/15 bg-primary/[0.04] px-4 py-3"
          >
            <p className="text-[10px] font-semibold uppercase tracking-wide text-primary">
              {stat.label}
            </p>
            <p className="mt-1 text-2xl font-bold text-secondary">{stat.value}</p>
          </div>
        ))}
      </div>

      <section className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-base font-semibold text-secondary">Platform plans</h3>
          <span className="text-xs text-secondary/50">
            {platformRows.length} users · click row for details
          </span>
        </div>

        {platformRows.length === 0 ? (
          <p className="rounded-xl border border-dashed border-primary/20 px-4 py-8 text-center text-sm text-secondary/55">
            No platform subscribers yet.
          </p>
        ) : (
          <PlatformSubscribersTable
            rows={platformRows}
            onSelect={setSelectedPlatform}
          />
        )}
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-base font-semibold text-secondary">Expert services</h3>
          <span className="text-xs text-secondary/50">
            {serviceRows.length} payments · click row for details
          </span>
        </div>

        {serviceRows.length === 0 ? (
          <p className="rounded-xl border border-dashed border-primary/20 px-4 py-8 text-center text-sm text-secondary/55">
            No successful service payments yet.
          </p>
        ) : (
          <ServicePaymentsTable
            rows={serviceRows}
            onSelect={setSelectedService}
          />
        )}
      </section>
    </div>
  );
}
