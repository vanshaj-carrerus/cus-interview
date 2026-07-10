export type RazorpaySubscriptionEntity = {
  id: string;
  entity: "subscription";
  plan_id: string;
  customer_id: string | null;
  status:
    | "created"
    | "authenticated"
    | "active"
    | "pending"
    | "halted"
    | "cancelled"
    | "completed"
    | "expired"
    | "paused";
  current_start: number | null;
  current_end: number | null;
  ended_at: number | null;
  quantity: number;
  notes?: Record<string, string>;
  charge_at: number | null;
  start_at: number | null;
  end_at: number | null;
  auth_attempts: number;
  total_count: number;
  paid_count: number;
  remaining_count: number | string;
};

export type RazorpayWebhookEvent = {
  entity: "event";
  event: string;
  payload: {
    subscription?: {
      entity: RazorpaySubscriptionEntity;
    };
  };
};
