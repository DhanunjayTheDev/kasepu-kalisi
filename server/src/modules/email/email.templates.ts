interface TemplateResult {
  subject: string;
  html: string;
}

const BRAND = {
  ivory: "#F7F1E9",
  teal: "#1E6C71",
  terracotta: "#DB734D",
  gold: "#E8B03F",
};

function wrap(bodyHtml: string): string {
  return `
  <div style="background:${BRAND.ivory};padding:32px 16px;font-family:'DM Sans',Arial,sans-serif;">
    <div style="max-width:520px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e5ded2;">
      <div style="background:${BRAND.teal};padding:24px 32px;">
        <p style="margin:0;color:${BRAND.ivory};font-size:20px;font-weight:600;letter-spacing:0.05em;">KASEPU KALISI</p>
      </div>
      <div style="padding:32px;color:#334155;font-size:15px;line-height:1.6;">
        ${bodyHtml}
      </div>
      <div style="padding:20px 32px;border-top:1px solid #eee;color:#94a3b8;font-size:12px;">
        Kasepu Kalisi · This is an automated message.
      </div>
    </div>
  </div>`;
}

export function bookingConfirmationTemplate(data: Record<string, unknown>): TemplateResult {
  const ticketIds = Array.isArray(data.ticketIds) ? (data.ticketIds as string[]) : [];
  return {
    subject: "Your Kasepu Kalisi Ticket is Confirmed",
    html: wrap(`
      <h2 style="color:${BRAND.teal};font-weight:600;">Booking confirmed</h2>
      <p>Your booking <strong>${data.bookingId}</strong> is confirmed.</p>
      <p>Tickets: ${ticketIds.join(", ")}</p>
      <p>Your digital tickets and QR codes are attached and also available under Your Tickets.</p>
    `),
  };
}

export function paymentFailedTemplate(data: Record<string, unknown>): TemplateResult {
  return {
    subject: "Payment Failed — Kasepu Kalisi",
    html: wrap(`
      <h2 style="color:${BRAND.terracotta};font-weight:600;">Payment didn't go through</h2>
      <p>Your payment for booking <strong>${data.bookingId}</strong> could not be processed. No amount has been deducted.</p>
    `),
  };
}

export function refundConfirmationTemplate(data: Record<string, unknown>): TemplateResult {
  return {
    subject: "Refund Processed — Kasepu Kalisi",
    html: wrap(`
      <h2 style="color:${BRAND.teal};font-weight:600;">Refund processed</h2>
      <p>₹${data.amount} has been refunded for booking <strong>${data.bookingId}</strong>. It will reflect in 7-10 business days.</p>
    `),
  };
}

export function eventUpdateTemplate(data: Record<string, unknown>): TemplateResult {
  return {
    subject: `${data.title} — Kasepu Kalisi`,
    html: wrap(`
      <h2 style="color:${BRAND.teal};font-weight:600;">${data.title}</h2>
      <p>${data.message}</p>
    `),
  };
}

export function staffInviteTemplate(data: Record<string, unknown>): TemplateResult {
  return {
    subject: "You've been invited to Kasepu Kalisi Admin",
    html: wrap(`
      <h2 style="color:${BRAND.teal};font-weight:600;">Welcome to the team</h2>
      <p>You've been invited as <strong>${data.role}</strong>. Set your password to get started.</p>
    `),
  };
}

const TEMPLATES: Record<string, (data: Record<string, unknown>) => TemplateResult> = {
  booking_confirmation: bookingConfirmationTemplate,
  payment_failed: paymentFailedTemplate,
  refund_confirmation: refundConfirmationTemplate,
  event_update: eventUpdateTemplate,
  event_cancelled: eventUpdateTemplate,
  event_postponed: eventUpdateTemplate,
  event_reminder: eventUpdateTemplate,
  post_event_thank_you: eventUpdateTemplate,
  staff_invite: staffInviteTemplate,
};

export function renderEmailTemplate(template: string, data: Record<string, unknown>): TemplateResult {
  const renderer = TEMPLATES[template] ?? eventUpdateTemplate;
  return renderer(data);
}
