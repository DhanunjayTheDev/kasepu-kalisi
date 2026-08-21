import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { CalendarDays, Lock, MapPin, RotateCcw, ShieldCheck, Ticket as TicketIcon } from "lucide-react";
import { Button } from "@/components/button";
import { Section } from "@/components/section";
import { AuthGate } from "@/components/auth-gate";
import { LoadingState } from "@/components/query-states";
import { usePageTitle } from "@/lib/use-page-title";
import { useBooking, useCreatePaymentOrder, useVerifyPayment } from "@/lib/queries";
import { formatCurrency, formatDate } from "@/lib/format";
import { loadRazorpayScript } from "@/lib/load-razorpay";
import { imageForSlug } from "@/lib/media";
import { ApiError } from "@/lib/api-client";
import type { EventItem, TicketTypeItem } from "@/types/api";

const TRUST = [
  { icon: Lock, label: "Card details never touch our servers" },
  { icon: ShieldCheck, label: "Processed securely by Razorpay" },
  { icon: RotateCcw, label: "Refunds follow the event's stated policy" },
];

function CheckoutContent() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const { data: booking, isLoading, isError } = useBooking(bookingId);
  const createOrder = useCreatePaymentOrder();
  const verifyPayment = useVerifyPayment();
  const [payError, setPayError] = useState<string | null>(null);
  const [paying, setPaying] = useState(false);

  if (isLoading) return <LoadingState label="Loading your order…" />;

  if (isError || !booking) {
    return (
      <div className="max-w-md">
        <h1 className="text-3xl">Booking not found</h1>
        <p className="mt-3 text-sm text-slate">Start a registration to see your order summary here.</p>
        <Button href="/events" variant="primary" className="mt-6">
          Explore Gatherings
        </Button>
      </div>
    );
  }

  const event = booking.event as EventItem;
  const ticketType = booking.ticketType as TicketTypeItem;
  const alreadyPaid = booking.status !== "payment_pending";

  async function handlePay() {
    setPayError(null);
    setPaying(true);
    try {
      const order = await createOrder.mutateAsync(booking!._id);
      if (!order.keyId) {
        setPayError("Payment gateway is not configured yet. Add Razorpay keys to enable checkout.");
        return;
      }

      await loadRazorpayScript();

      const razorpay = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        order_id: order.orderId,
        name: "Kasepu Kalisi",
        description: event.title,
        prefill: { name: booking!.contact.fullName, email: booking!.contact.email, contact: booking!.contact.mobile },
        theme: { color: "#1E6C71" },
        handler: async (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
          try {
            await verifyPayment.mutateAsync(response);
            navigate("/payment/success");
          } catch {
            navigate("/payment/failed");
          }
        },
        modal: {
          ondismiss: () => setPaying(false),
        },
      });

      razorpay.open();
    } catch (err) {
      setPayError(err instanceof ApiError ? err.message : "Couldn't start payment. Please try again.");
    } finally {
      setPaying(false);
    }
  }

  return (
    <div>
      <span className="eyebrow flex items-center gap-3 text-gold">
        <span className="rule-gold" aria-hidden />
        Checkout
      </span>
      <h1 className="mt-4 text-[2.1rem] leading-tight xs:text-4xl sm:text-5xl">
        Review &amp; <span className="italic text-terracotta">pay.</span>
      </h1>
      <p className="mt-3 max-w-lg text-sm leading-relaxed text-slate">
        Your seats are held while you complete payment. Tickets arrive by email and WhatsApp the moment it clears.
      </p>

      <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,23rem)] lg:gap-12">
        <div className="flex flex-col gap-5">
          {/* The gathering being paid for, shown with its imagery. */}
          <article className="overflow-hidden rounded-2xl border border-slate/12 bg-white">
            <div className="flex flex-col sm:flex-row">
              <div className="aspect-[16/10] shrink-0 sm:aspect-auto sm:w-44">
                <img src={imageForSlug(event.slug)} alt="" className="h-full w-full object-cover" loading="lazy" />
              </div>
              <div className="min-w-0 flex-1 p-6">
                <span className="eyebrow text-gold">Your Gathering</span>
                <h2 className="mt-2 font-display text-2xl leading-snug text-teal">{event.title}</h2>
                <div className="mt-3 flex flex-col gap-1.5 font-sans text-sm text-slate">
                  <span className="flex items-center gap-2">
                    <CalendarDays size={14} className="text-gold" />
                    {formatDate(event.date)}
                    {event.startTime ? ` · ${event.startTime}` : ""}
                  </span>
                  <span className="flex items-center gap-2">
                    <MapPin size={14} className="shrink-0 text-gold" />
                    {event.venue.name}, {event.city}
                  </span>
                </div>
              </div>
            </div>
          </article>

          <article className="rounded-2xl border border-slate/12 bg-white p-6 sm:p-7">
            <span className="eyebrow text-gold">Order</span>

            <div className="mt-5 flex items-start justify-between gap-4 border-t border-slate/10 pt-5">
              <div className="min-w-0">
                <p className="flex items-center gap-2 font-sans text-sm font-semibold text-teal">
                  <TicketIcon size={15} className="shrink-0 text-terracotta" />
                  {ticketType.name}
                </p>
                {ticketType.description && (
                  <p className="mt-1.5 text-sm leading-relaxed text-slate">{ticketType.description}</p>
                )}
                <p className="mt-2 font-sans text-xs text-slate/75">
                  {booking.quantity} × {formatCurrency(ticketType.price)}
                </p>
              </div>
              <p className="shrink-0 font-sans text-sm font-semibold text-teal">{formatCurrency(booking.subtotal)}</p>
            </div>

            <div className="mt-5 border-t border-slate/10 pt-5">
              <span className="eyebrow text-slate/70">Booked By</span>
              <p className="mt-1.5 font-sans text-sm text-teal">{booking.contact.fullName}</p>
              <p className="font-sans text-sm text-slate">
                {booking.contact.email} · {booking.contact.mobile}
              </p>
              <p className="mt-3 font-mono text-xs text-slate/75">{booking.bookingId}</p>
            </div>
          </article>

          <ul className="flex flex-col gap-3 rounded-2xl border border-slate/12 bg-white p-6 sm:p-7">
            {TRUST.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-start gap-3 font-sans text-sm text-slate">
                <Icon size={16} className="mt-0.5 shrink-0 text-teal" />
                {label}
              </li>
            ))}
          </ul>
        </div>

        <aside className="lg:sticky lg:top-28 lg:h-fit">
          <div className="grain relative isolate overflow-hidden rounded-2xl bg-teal p-6 sm:p-7">
            <span className="eyebrow relative text-gold">Order Summary</span>

            <div className="relative mt-5 flex flex-col gap-2.5 font-sans text-sm text-ivory/80">
              <span className="flex justify-between gap-4">
                <span>Subtotal</span>
                <span>{formatCurrency(booking.subtotal)}</span>
              </span>
              {booking.discount > 0 && (
                <span className="flex justify-between gap-4 text-gold">
                  <span>Discount</span>
                  <span>−{formatCurrency(booking.discount)}</span>
                </span>
              )}
              <span className="flex justify-between gap-4">
                <span>Taxes &amp; fees</span>
                <span>{formatCurrency(booking.tax)}</span>
              </span>
            </div>

            <div className="relative mt-5 flex items-baseline justify-between gap-4 border-t border-ivory/15 pt-5">
              <span className="font-sans text-sm text-ivory/80">Total</span>
              <span className="font-display text-3xl leading-none text-ivory">{formatCurrency(booking.total)}</span>
            </div>

            <Button
              variant="primary"
              className="relative mt-6 w-full"
              onClick={handlePay}
              disabled={paying || alreadyPaid}
            >
              {alreadyPaid ? "Already Processed" : paying ? "Opening Razorpay…" : `Pay ${formatCurrency(booking.total)}`}
            </Button>

            {payError && (
              <p className="relative mt-3 rounded-lg bg-ivory/10 px-3 py-2 font-sans text-xs leading-relaxed text-ivory/90">
                {payError}
              </p>
            )}

            <p className="relative mt-4 flex items-center gap-2 font-sans text-xs text-ivory/60">
              <ShieldCheck size={14} className="shrink-0 text-gold" />
              Secured by Razorpay
            </p>
          </div>

          <p className="mt-4 text-center text-xs text-slate">
            Need help?{" "}
            <Link to="/contact" className="font-semibold text-terracotta underline-offset-4 hover:underline">
              Contact us
            </Link>
          </p>
        </aside>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  usePageTitle("Checkout");

  return (
    <Section>
      <AuthGate>
        <CheckoutContent />
      </AuthGate>
    </Section>
  );
}
