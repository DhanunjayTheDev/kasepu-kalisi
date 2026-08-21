import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/button";
import { Section } from "@/components/section";
import { AuthGate } from "@/components/auth-gate";
import { LoadingState } from "@/components/query-states";
import { usePageTitle } from "@/lib/use-page-title";
import { useBooking, useCreatePaymentOrder, useVerifyPayment } from "@/lib/queries";
import { formatCurrency } from "@/lib/format";
import { loadRazorpayScript } from "@/lib/load-razorpay";
import { ApiError } from "@/lib/api-client";
import type { EventItem, TicketTypeItem } from "@/types/api";

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
    <div className="grid gap-10 lg:grid-cols-3 lg:gap-12">
      <div className="lg:col-span-2">
        <span className="eyebrow text-gold">Checkout</span>
        <h1 className="mt-2 text-4xl">Review &amp; pay</h1>

        <div className="mt-8 rounded-2xl border border-slate/15 p-6">
          <p className="eyebrow text-gold">Gathering</p>
          <p className="mt-2 font-display text-2xl text-teal">{event.title}</p>

          <div className="mt-6 flex items-center justify-between border-t border-slate/10 pt-5 text-sm">
            <span className="text-slate">
              {booking.quantity} × {ticketType.name}
            </span>
            <span className="font-semibold text-teal">{formatCurrency(booking.subtotal)}</span>
          </div>

          <div className="mt-6 border-t border-slate/10 pt-5 text-sm text-slate">
            {booking.bookingId}
          </div>
        </div>
      </div>

      <aside className="lg:sticky lg:top-28 lg:h-fit">
        <div className="rounded-3xl border border-slate/10 bg-teal p-7">
          <span className="eyebrow text-gold">Order Summary</span>
          <div className="mt-5 flex flex-col gap-2.5 font-sans text-sm text-ivory/80">
            <span className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatCurrency(booking.subtotal)}</span>
            </span>
            {booking.discount > 0 && (
              <span className="flex justify-between">
                <span>Discount</span>
                <span>-{formatCurrency(booking.discount)}</span>
              </span>
            )}
            <span className="flex justify-between">
              <span>Taxes &amp; fees</span>
              <span>{formatCurrency(booking.tax)}</span>
            </span>
          </div>
          <div className="mt-5 flex justify-between border-t border-ivory/15 pt-5 font-sans text-lg font-semibold text-ivory">
            <span>Total</span>
            <span>{formatCurrency(booking.total)}</span>
          </div>

          <Button variant="primary" className="mt-6 w-full" onClick={handlePay} disabled={paying || booking.status !== "payment_pending"}>
            {booking.status !== "payment_pending" ? "Already Processed" : paying ? "Opening Razorpay…" : `Pay ${formatCurrency(booking.total)}`}
          </Button>
          {payError && <p className="mt-3 text-xs text-ivory/80">{payError}</p>}
          <p className="mt-3 flex items-center gap-2 text-xs text-ivory/60">
            <ShieldCheck size={14} className="text-gold" />
            Payments are processed securely by Razorpay.
          </p>
        </div>

        <p className="mt-4 text-center text-xs text-slate">
          Need help? <Link to="/contact" className="text-terracotta underline">Contact us</Link>
        </p>
      </aside>
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
