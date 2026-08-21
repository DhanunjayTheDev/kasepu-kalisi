// Development seed data only — never run against a production database.
// Populates every collection so each admin screen and public page has realistic rows.
import bcrypt from "bcryptjs";
import { connectDatabase, disconnectDatabase } from "./config/db";
import { Staff } from "./modules/staff/staff.model";
import { User } from "./modules/users/user.model";
import { Event } from "./modules/events/event.model";
import { TicketType } from "./modules/tickets/ticketType.model";
import { Ticket } from "./modules/tickets/ticket.model";
import { Schedule } from "./modules/schedules/schedule.model";
import { Artist } from "./modules/artists/artist.model";
import { MenuItem } from "./modules/menus/menuItem.model";
import { GalleryItem } from "./modules/gallery/galleryItem.model";
import { Coupon } from "./modules/coupons/coupon.model";
import { Booking } from "./modules/bookings/booking.model";
import { Attendee } from "./modules/attendees/attendee.model";
import { Payment } from "./modules/payments/payment.model";
import { Refund } from "./modules/refunds/refund.model";
import { Invoice } from "./modules/invoices/invoice.model";
import { CheckIn } from "./modules/checkin/checkIn.model";
import { Waitlist } from "./modules/waitlist/waitlist.model";
import { Announcement } from "./modules/announcements/announcement.model";
import { Notification } from "./modules/notifications/notification.model";
import { EmailLog } from "./modules/email/emailLog.model";
import { WhatsAppLog } from "./modules/whatsapp/whatsappLog.model";
import { AuditLog } from "./modules/auditLogs/auditLog.model";
import { SupportTicket } from "./modules/support/supportTicket.model";
import { getSettings } from "./modules/settings/settings.model";
import { getCmsContent } from "./modules/cms/cmsContent.model";
import { FaqItem } from "./modules/cms/faqItem.model";
import { Testimonial } from "./modules/cms/testimonial.model";
import { generateBookingId, generateTicketId } from "./utils/ids";
import type { BookingStatus } from "./types/enums";
import { generateQrToken } from "./utils/qr-token";

const IMG = (id: string, w = 1600) => `https://images.unsplash.com/photo-${id}?w=${w}&q=80&auto=format&fit=crop`;

function daysFromNow(days: number) {
  return new Date(Date.now() + days * 86_400_000);
}

async function seed() {
  await connectDatabase();
  await getSettings();

  // Materialises the homepage/about/contact defaults so the CMS editors open with content.
  await Promise.all(["homepage", "about", "contact"].map((key) => getCmsContent(key)));

  // ---------------------------------------------------------------- staff
  let superAdmin = await Staff.findOne({ email: "admin@kasepukalisi.com" });
  if (!superAdmin) {
    const passwordHash = await bcrypt.hash("ChangeMe123!", 10);
    superAdmin = await Staff.create({
      name: "Super Admin",
      email: "admin@kasepukalisi.com",
      passwordHash,
      role: "super_admin",
      status: "active",
    });

    await Staff.insertMany([
      { name: "Divya Menon", email: "divya@kasepukalisi.com", passwordHash, role: "event_manager", status: "active" },
      { name: "Rohit Bansal", email: "rohit@kasepukalisi.com", passwordHash, role: "finance_manager", status: "active" },
      { name: "Priya Iyer", email: "priya@kasepukalisi.com", passwordHash, role: "registration_manager", status: "active" },
      { name: "Sameer Khan", email: "sameer@kasepukalisi.com", passwordHash, role: "checkin_staff", status: "active" },
      { name: "Nikita Rao", email: "nikita@kasepukalisi.com", passwordHash, role: "content_manager", status: "invited" },
      { name: "Farhan Ali", email: "farhan@kasepukalisi.com", passwordHash, role: "support_staff", status: "active" },
    ]);
    console.log("Seeded staff. Admin login: admin@kasepukalisi.com / ChangeMe123! (change this immediately)");
  }

  const checkinStaff = (await Staff.findOne({ role: "checkin_staff" })) ?? superAdmin;

  // Everything below hangs off the flagship event; if it exists the seed already ran.
  const alreadySeeded = await Event.findOne({ slug: "kasepu-kalisi-bengaluru-2026" });
  if (alreadySeeded) {
    console.log("Demo data already exists, skipping.");
    await disconnectDatabase();
    return;
  }

  // --------------------------------------------------------------- events
  const [bengaluru, hyderabad, chennai] = await Event.create([
    {
      title: "Kasepu Kalisi, Bengaluru",
      slug: "kasepu-kalisi-bengaluru-2026",
      tagline: "A night of people, stories, food and music.",
      description:
        "An evening built around a long table, a live band and a menu that moves through the country course by course.",
      city: "Bengaluru",
      date: daysFromNow(45),
      startTime: "6:00 PM",
      endTime: "11:00 PM",
      status: "registration_open",
      priceFrom: 2499,
      featured: true,
      multiEntryEnabled: true,
      photographyConsentNotice: "Photographs taken during the evening may be used in our archive and promotion.",
      venue: {
        name: "The Courtyard House",
        address: "14 Lavelle Road, Bengaluru, Karnataka 560001",
        city: "Bengaluru",
        state: "Karnataka",
        pincode: "560001",
        parkingAvailable: true,
        parkingCapacity: 120,
        parkingFee: 150,
        parkingInstructions: "Enter from the rear gate on Museum Road. Valet available until 9 PM.",
        directions: "Five minutes from MG Road Metro, exit towards Trinity Circle.",
        landmarks: ["Opposite Cubbon Park", "Next to the old bookshop"],
        publicTransport: "MG Road Metro (Purple Line), 700m walk.",
        contactNumber: "+91 98765 43210",
      },
      cancellationPolicy: { deadlineDays: 3, refundPercentage: 100, fixedFee: 100 },
      createdBy: superAdmin._id,
    },
    {
      title: "Kasepu Kalisi, Hyderabad",
      slug: "kasepu-kalisi-hyderabad-2026",
      tagline: "Old city flavours, new city energy.",
      description: "A courtyard dinner in the old quarter, with qawwali after sundown.",
      city: "Hyderabad",
      date: daysFromNow(96),
      startTime: "7:00 PM",
      endTime: "11:30 PM",
      status: "published",
      priceFrom: 2199,
      venue: {
        name: "Deccan Courtyard",
        address: "22 Road No. 2, Banjara Hills, Hyderabad, Telangana 500034",
        city: "Hyderabad",
        state: "Telangana",
        pincode: "500034",
        parkingAvailable: true,
        parkingCapacity: 80,
        parkingFee: 0,
        contactNumber: "+91 98765 43211",
      },
      cancellationPolicy: { deadlineDays: 5, refundPercentage: 80, fixedFee: 150 },
      createdBy: superAdmin._id,
    },
    {
      title: "Kasepu Kalisi, Chennai",
      slug: "kasepu-kalisi-chennai-2025",
      tagline: "The one by the sea.",
      description: "Our first coastal gathering — filter coffee at midnight and a Carnatic set at dusk.",
      city: "Chennai",
      date: daysFromNow(-120),
      startTime: "6:30 PM",
      endTime: "11:00 PM",
      status: "completed",
      priceFrom: 1999,
      venue: {
        name: "Besant House",
        address: "8 Beach Road, Besant Nagar, Chennai, Tamil Nadu 600090",
        city: "Chennai",
        state: "Tamil Nadu",
        pincode: "600090",
        parkingAvailable: false,
        contactNumber: "+91 98765 43212",
      },
      cancellationPolicy: { deadlineDays: 3, refundPercentage: 100, fixedFee: 100 },
      createdBy: superAdmin._id,
    },
  ]);

  // --------------------------------------------------------- ticket types
  const [standard, premium, vip] = await TicketType.create([
    {
      event: bengaluru._id,
      name: "Standard",
      description: "Seated dinner, welcome drink and full evening access.",
      price: 2499,
      capacity: 120,
      sold: 0,
      maxPerBooking: 6,
      benefits: ["Seated dinner", "Welcome drink", "Live music access"],
      dinnerIncluded: true,
      status: "on_sale",
    },
    {
      event: bengaluru._id,
      name: "Premium",
      description: "Front-section seating with a curated tasting menu.",
      price: 3999,
      capacity: 40,
      sold: 0,
      maxPerBooking: 6,
      benefits: ["Front-section seating", "Tasting menu", "Artist meet & greet"],
      dinnerIncluded: true,
      status: "on_sale",
    },
    {
      event: bengaluru._id,
      name: "VIP Table",
      description: "A private table of four with dedicated service.",
      price: 12999,
      capacity: 8,
      sold: 0,
      maxPerBooking: 4,
      benefits: ["Private table for 4", "Dedicated host", "Parking pass included"],
      dinnerIncluded: true,
      parkingIncluded: true,
      vipAccess: true,
      status: "on_sale",
    },
  ]);

  const [hydStandard] = await TicketType.create([
    {
      event: hyderabad._id,
      name: "Standard",
      description: "Courtyard dinner and the full qawwali set.",
      price: 2199,
      capacity: 90,
      maxPerBooking: 6,
      benefits: ["Courtyard dinner", "Welcome sherbet", "Qawwali performance"],
      dinnerIncluded: true,
      status: "on_sale",
    },
    {
      event: hyderabad._id,
      name: "Premium",
      description: "Raised seating with a chef's tasting menu.",
      price: 3499,
      capacity: 30,
      maxPerBooking: 4,
      benefits: ["Raised seating", "Tasting menu"],
      dinnerIncluded: true,
      status: "on_sale",
    },
    {
      event: chennai._id,
      name: "Standard",
      description: "Beachside dinner and evening programme.",
      price: 1999,
      capacity: 100,
      sold: 96,
      maxPerBooking: 6,
      dinnerIncluded: true,
      status: "sold_out",
    },
  ]);

  // ------------------------------------------------------------ schedules
  await Schedule.insertMany([
    { event: bengaluru._id, time: "5:30 PM", title: "Guest Arrival", description: "Check-in opens, welcome drinks served in the courtyard.", order: 1 },
    { event: bengaluru._id, time: "6:00 PM", title: "Welcome", description: "A short opening from the hosts.", order: 2 },
    { event: bengaluru._id, time: "6:30 PM", title: "Cultural Performance", description: "The Tabla Collective open the evening.", order: 3 },
    { event: bengaluru._id, time: "7:15 PM", title: "Live Music", description: "Anahita Rao performs her fusion set.", order: 4 },
    { event: bengaluru._id, time: "8:30 PM", title: "Dinner", description: "Long-table dinner served course by course.", order: 5 },
    { event: bengaluru._id, time: "10:00 PM", title: "Closing", description: "Dessert, filter coffee and slow goodbyes.", order: 6 },
    { event: hyderabad._id, time: "6:30 PM", title: "Guest Arrival", order: 1 },
    { event: hyderabad._id, time: "7:00 PM", title: "Welcome & Sherbet", order: 2 },
    { event: hyderabad._id, time: "8:00 PM", title: "Qawwali Set", order: 3 },
    { event: hyderabad._id, time: "9:00 PM", title: "Dinner", order: 4 },
  ]);

  // -------------------------------------------------------------- artists
  await Artist.insertMany([
    {
      event: bengaluru._id,
      name: "Anahita Rao",
      genre: "Fusion Vocals",
      bio: "Blends Carnatic roots with contemporary sound. Has performed at NH7 and Echoes of Earth.",
      performanceTime: "7:15 PM",
      photoUrl: IMG("1493225457124-a3eb161ffa5f", 900),
      videoUrl: "https://assets.mixkit.co/videos/4640/4640-720.mp4",
      status: "confirmed",
    },
    {
      event: bengaluru._id,
      name: "The Tabla Collective",
      genre: "Percussion Ensemble",
      bio: "A three-piece percussion group built around classical tabla and modern rhythm.",
      performanceTime: "6:30 PM",
      photoUrl: IMG("1516450360452-9312f5e86fc7", 900),
      status: "confirmed",
    },
    {
      event: hyderabad._id,
      name: "Nizami Brothers",
      genre: "Qawwali",
      bio: "Seventh-generation qawwals from the old city.",
      performanceTime: "8:00 PM",
      photoUrl: IMG("1501612780327-45045538702b", 900),
      status: "pending",
    },
  ]);

  // ---------------------------------------------------------------- menus
  await MenuItem.insertMany([
    { event: bengaluru._id, category: "welcome_drink", name: "Jaljeera Spritz", dietary: "vegan" },
    { event: bengaluru._id, category: "starters", name: "Tandoori Mushroom", dietary: "vegetarian" },
    { event: bengaluru._id, category: "starters", name: "Chettinad Chicken Roast", dietary: "non_vegetarian" },
    { event: bengaluru._id, category: "main_course", name: "Slow-cooked Mutton Curry", dietary: "non_vegetarian" },
    { event: bengaluru._id, category: "curries", name: "Dal Bukhara", dietary: "vegetarian" },
    { event: bengaluru._id, category: "rice", name: "Hyderabadi Vegetable Biryani", dietary: "vegetarian" },
    { event: bengaluru._id, category: "bread", name: "Laccha Paratha", dietary: "vegetarian" },
    { event: bengaluru._id, category: "desserts", name: "Saffron Phirni", dietary: "vegetarian" },
    { event: bengaluru._id, category: "beverages", name: "Filter Coffee", dietary: "vegetarian" },
    { event: hyderabad._id, category: "welcome_drink", name: "Rose Sherbet", dietary: "vegan" },
    { event: hyderabad._id, category: "main_course", name: "Dum Biryani", dietary: "non_vegetarian" },
    { event: hyderabad._id, category: "desserts", name: "Double Ka Meetha", dietary: "vegetarian" },
  ]);

  // -------------------------------------------------------------- gallery
  await GalleryItem.insertMany([
    { event: chennai._id, album: "Chennai 2025", type: "image", url: IMG("1511795409834-ef04bbd61622"), featured: true, status: "published" },
    { event: chennai._id, album: "Chennai 2025", type: "image", url: IMG("1529193591184-b1d58069ecdd"), status: "published" },
    { event: chennai._id, album: "Chennai 2025", type: "image", url: IMG("1478147427282-58a87a120781"), status: "published" },
    { event: chennai._id, album: "Chennai 2025", type: "image", url: IMG("1519671482749-fd09be7ccebf"), status: "published" },
    { event: chennai._id, album: "Chennai 2025", type: "image", url: IMG("1555244162-803834f70033"), status: "published" },
    { event: chennai._id, album: "Chennai 2025", type: "image", url: IMG("1543007630-9710e4a00a20"), status: "published" },
    { event: chennai._id, album: "Chennai 2025", type: "image", url: IMG("1533422902779-aff35862e462"), status: "published" },
    { event: chennai._id, album: "Chennai 2025", type: "image", url: IMG("1414235077428-338989a2e8c0"), status: "published" },
    { event: bengaluru._id, album: "Behind the Scenes", type: "image", url: IMG("1414235077428-338989a2e8c0"), status: "draft" },
  ]);

  // -------------------------------------------------------------- coupons
  const [welcomeCoupon] = await Coupon.create([
    {
      code: "WELCOME10",
      type: "percentage",
      value: 10,
      minOrderAmount: 2000,
      maxDiscountAmount: 750,
      usageLimit: 100,
      usageCount: 1,
      perUserLimit: 1,
      startDate: daysFromNow(-30),
      endDate: daysFromNow(60),
      active: true,
    },
    {
      code: "TABLEFOR4",
      type: "fixed",
      value: 1000,
      minOrderAmount: 10000,
      event: bengaluru._id,
      ticketType: vip._id,
      usageLimit: 20,
      usageCount: 0,
      active: true,
    },
    {
      code: "EARLYBIRD",
      type: "percentage",
      value: 15,
      usageLimit: 50,
      usageCount: 50,
      endDate: daysFromNow(-10),
      active: false,
    },
  ]);

  // ---------------------------------------------------------------- users
  const users = await User.create([
    { fullName: "Meera Krishnan", mobile: "9876500001", email: "meera@example.com", gender: "female", age: 34, city: "Bengaluru", mobileVerifiedAt: new Date() },
    { fullName: "Arjun Nair", mobile: "9876500002", email: "arjun@example.com", gender: "male", age: 29, city: "Kochi", mobileVerifiedAt: new Date() },
    { fullName: "Sneha Reddy", mobile: "9876500003", email: "sneha@example.com", gender: "female", age: 31, city: "Hyderabad", mobileVerifiedAt: new Date() },
    { fullName: "Fatima Sheikh", mobile: "9876500004", email: "fatima@example.com", gender: "female", age: 38, city: "Mumbai", mobileVerifiedAt: new Date() },
    { fullName: "Vikram Desai", mobile: "9876500005", email: "vikram@example.com", gender: "male", age: 42, city: "Pune" },
  ]);

  const settings = await getSettings();
  const taxRate = (settings.tax!.cgstPercent! + settings.tax!.sgstPercent!) / 100;

  // ------------------------------------- bookings + payments + tickets etc
  const bookingPlans: {
    user: (typeof users)[number];
    ticketType: typeof standard;
    quantity: number;
    status: BookingStatus;
    coupon: typeof welcomeCoupon | null;
    checkIn: boolean;
  }[] = [
    { user: users[0], ticketType: standard, quantity: 2, status: "confirmed", coupon: welcomeCoupon, checkIn: true },
    { user: users[1], ticketType: premium, quantity: 2, status: "confirmed", coupon: null, checkIn: true },
    { user: users[2], ticketType: vip, quantity: 4, status: "confirmed", coupon: null, checkIn: false },
    { user: users[3], ticketType: standard, quantity: 1, status: "payment_pending", coupon: null, checkIn: false },
    { user: users[4], ticketType: standard, quantity: 3, status: "refund_requested", coupon: null, checkIn: false },
  ];

  let invoiceSeq = 1;

  for (const plan of bookingPlans) {
    const subtotal = plan.ticketType.price * plan.quantity;
    const discount = plan.coupon ? Math.min(Math.round(subtotal * 0.1), 750) : 0;
    const tax = Math.round((subtotal - discount) * taxRate);
    const total = subtotal - discount + tax;

    const booking = await Booking.create({
      bookingId: await generateBookingId(),
      user: plan.user._id,
      event: bengaluru._id,
      ticketType: plan.ticketType._id,
      quantity: plan.quantity,
      contact: {
        fullName: plan.user.fullName,
        mobile: plan.user.mobile,
        email: plan.user.email ?? undefined,
        gender: plan.user.gender ?? undefined,
        age: plan.user.age ?? undefined,
        city: plan.user.city ?? undefined,
      },
      subtotal,
      discount,
      tax,
      total,
      coupon: plan.coupon?._id,
      status: plan.status,
      dietaryPreference: plan.quantity > 2 ? "vegetarian" : "non_vegetarian",
      photoConsent: true,
    });

    const attendees = await Attendee.insertMany(
      Array.from({ length: plan.quantity }, (_, i) => ({
        booking: booking._id,
        name: i === 0 ? plan.user.fullName : `${plan.user.fullName.split(" ")[0]}'s Guest ${i}`,
        age: 25 + i * 3,
        gender: i % 2 === 0 ? "female" : "male",
      }))
    );

    const paid = plan.status === "confirmed" || plan.status === "refund_requested";

    const payment = await Payment.create({
      booking: booking._id,
      razorpayOrderId: `order_seed_${booking.bookingId}`,
      razorpayPaymentId: paid ? `pay_seed_${booking.bookingId}` : undefined,
      amount: total,
      currency: "INR",
      status: paid ? "captured" : "created",
      method: paid ? "upi" : undefined,
      webhookProcessedAt: paid ? new Date() : undefined,
    });

    booking.payment = payment._id;
    await booking.save();

    if (paid) {
      await TicketType.updateOne({ _id: plan.ticketType._id }, { $inc: { sold: plan.quantity } });

      await Invoice.create({
        invoiceNumber: `${settings.tax!.invoicePrefix}${String(invoiceSeq++).padStart(6, "0")}`,
        booking: booking._id,
        subtotal,
        discount,
        tax,
        total,
        businessName: settings.general!.businessName,
        gstin: settings.tax!.gstin,
      });

      const tickets = await Ticket.insertMany(
        attendees.map((attendee) => {
          const ticketId = generateTicketId();
          return {
            ticketId,
            booking: booking._id,
            event: bengaluru._id,
            ticketType: plan.ticketType._id,
            attendee: attendee._id,
            qrToken: generateQrToken(ticketId),
            status: "active",
            multiEntry: true,
          };
        })
      );

      if (plan.checkIn) {
        for (const ticket of tickets) {
          await CheckIn.create({
            ticket: ticket._id,
            event: bengaluru._id,
            staff: checkinStaff._id,
            gate: "Main Gate",
            device: "Scanner-01",
            direction: "in",
          });
          await Ticket.updateOne(
            { _id: ticket._id },
            { $set: { status: "used", lastCheckInAt: new Date() }, $inc: { entryCount: 1 } }
          );
        }
      }
    }

    if (plan.status === "refund_requested") {
      await Refund.create({
        booking: booking._id,
        payment: payment._id,
        amount: total - 100,
        reason: "Travel plans changed",
        status: "requested",
      });
    }

    await Notification.create({
      user: plan.user._id,
      event: bengaluru._id,
      title: paid ? "Booking confirmed" : "Complete your payment",
      message: paid
        ? `Your tickets for ${bengaluru.title} are ready.`
        : `Your seats for ${bengaluru.title} are held until payment completes.`,
      channel: "website",
    });

    await EmailLog.create({ to: plan.user.email!, template: paid ? "booking-confirmed" : "payment-pending", status: "sent" });
    await WhatsAppLog.create({ to: plan.user.mobile, template: paid ? "booking_confirmed" : "payment_pending", status: "sent" });
  }

  await Coupon.updateOne({ _id: welcomeCoupon._id }, { $set: { usageCount: 1 } });

  // ------------------------------------------------------------- waitlist
  await Waitlist.insertMany([
    { name: "Ananya Bose", mobile: "9876500011", email: "ananya@example.com", event: bengaluru._id, ticketType: vip._id, quantity: 4 },
    { name: "Karthik Subramanian", mobile: "9876500012", email: "karthik@example.com", event: bengaluru._id, ticketType: premium._id, quantity: 2 },
    { name: "Zoya Merchant", mobile: "9876500013", event: hyderabad._id, ticketType: hydStandard._id, quantity: 2, notifiedAt: new Date() },
  ]);

  // -------------------------------------------------------- announcements
  await Announcement.insertMany([
    {
      event: bengaluru._id,
      title: "Parking update",
      content: "The rear gate on Museum Road is now open for valet. Please avoid the main entrance.",
      priority: "high",
      status: "active",
      createdBy: superAdmin._id,
    },
    {
      event: bengaluru._id,
      title: "Dinner starts at 8:30",
      content: "Please make your way to the long table — dinner service begins shortly.",
      priority: "normal",
      status: "scheduled",
      startTime: daysFromNow(45),
      createdBy: superAdmin._id,
    },
  ]);

  // ------------------------------------------------------------- support
  await SupportTicket.insertMany([
    {
      name: "Meera Krishnan",
      email: "meera@example.com",
      subject: "Can I change an attendee name?",
      message: "One of my guests can no longer make it. Can I swap the name on their ticket?",
      priority: "normal",
      status: "open",
    },
    {
      name: "Vikram Desai",
      email: "vikram@example.com",
      subject: "Refund status",
      message: "I requested a refund last week and wanted to check where it stands.",
      priority: "high",
      status: "in_progress",
    },
    {
      name: "Sneha Reddy",
      email: "sneha@example.com",
      subject: "Dietary requirements",
      message: "Two of our table are vegan — is that something the kitchen can handle?",
      priority: "low",
      status: "resolved",
    },
  ]);

  // ------------------------------------------------------------ audit log
  await AuditLog.insertMany([
    { actor: superAdmin._id, action: "event.created", resource: String(bengaluru._id), metadata: { via: "seed" } },
    { actor: superAdmin._id, action: "event.created", resource: String(hyderabad._id), metadata: { via: "seed" } },
    { actor: superAdmin._id, action: "event.status_changed", resource: String(chennai._id), before: { status: "registration_open" }, after: { status: "completed" } },
    { actor: superAdmin._id, action: "coupon.created", resource: String(welcomeCoupon._id) },
    { actor: superAdmin._id, action: "staff.invited", resource: String(checkinStaff._id), metadata: { role: "checkin_staff" } },
  ]);

  // ----------------------------------------------------------------- FAQ
  await FaqItem.insertMany([
    {
      question: "How do I book a seat?",
      answer:
        "Choose a gathering from the Events page, select your ticket type and complete registration. You'll receive a confirmation with your digital ticket right after payment.",
      order: 1,
    },
    {
      question: "How do I receive my ticket?",
      answer:
        "Your ticket is emailed to you immediately after a successful payment, and is always available under Your Tickets on this site.",
      order: 2,
    },
    {
      question: "Can I get a refund?",
      answer:
        "Refunds follow each event's cancellation policy, shown at checkout. Review our Refund Policy page for full details.",
      order: 3,
    },
    {
      question: "Can I transfer my ticket to someone else?",
      answer:
        "Yes, where enabled for an event. Go to your ticket and use the transfer option before the event's transfer deadline.",
      order: 4,
    },
    {
      question: "Is there parking at the venue?",
      answer:
        "Most venues offer parking — availability, capacity and any fee are listed on the Venue page for each gathering.",
      order: 5,
    },
    {
      question: "Can you cater to dietary requirements?",
      answer:
        "Yes. Choose your preference during registration and add anything else in the special requirements box — the kitchen sees every note.",
      order: 6,
    },
  ]);

  // --------------------------------------------------------- testimonials
  await Testimonial.insertMany([
    {
      name: "Meera Krishnan",
      role: "Architect",
      city: "Bengaluru",
      quote:
        "I came alone, which I never do. By the second course I was three conversations deep with people I'd never met. That doesn't happen by accident — the whole evening is built for it.",
      rating: 5,
      eventName: "Kasepu Kalisi, Chennai",
      order: 1,
    },
    {
      name: "Arjun Nair",
      role: "Product Designer",
      city: "Kochi",
      quote:
        "The food alone was worth the ticket. But it was the music — a tabla set that had the entire room quiet — that I still think about months later.",
      rating: 5,
      eventName: "Kasepu Kalisi, Chennai",
      order: 2,
    },
    {
      name: "Sneha & Rahul",
      role: "Attended together",
      city: "Hyderabad",
      quote:
        "We've been to a lot of 'curated' events that are really just loud parties with better branding. This was the opposite. Small, warm, unhurried. We've booked the next one already.",
      rating: 5,
      eventName: "Kasepu Kalisi, Chennai",
      order: 3,
    },
    {
      name: "Fatima Sheikh",
      role: "Journalist",
      city: "Mumbai",
      quote:
        "Everything ran on time without ever feeling scheduled. Check-in took ten seconds with the QR code. Someone had clearly thought about every small thing so we didn't have to.",
      rating: 5,
      eventName: "Kasepu Kalisi, Chennai",
      order: 4,
    },
    {
      name: "Vikram Desai",
      role: "Founder, Studio Loop",
      city: "Pune",
      quote:
        "I've hosted enough corporate dinners to know how rare it is for a room to actually relax. Kasepu Kalisi pulled it off with strangers who'd never met before that night.",
      rating: 5,
      eventName: "Kasepu Kalisi, Bengaluru",
      order: 5,
    },
    {
      name: "Ananya Bose",
      role: "Photographer",
      city: "Kolkata",
      quote:
        "I went to shoot it for a friend and ended up putting the camera down halfway through dinner. That's the highest compliment I can give an event.",
      rating: 5,
      eventName: "Kasepu Kalisi, Bengaluru",
      order: 6,
    },
    {
      name: "Karthik Subramanian",
      role: "Software Engineer",
      city: "Chennai",
      quote:
        "The dietary notes actually reached the kitchen. Every single dish I was served was correct, and nobody made me feel like a hassle for asking.",
      rating: 5,
      eventName: "Kasepu Kalisi, Hyderabad",
      order: 7,
    },
    {
      name: "Zoya Merchant",
      role: "Marketing Lead",
      city: "Mumbai",
      quote:
        "There's a version of this event that's just a nice dinner, and there's the version they actually built — one where the music, the lighting and the pacing all pull in the same direction.",
      rating: 5,
      eventName: "Kasepu Kalisi, Hyderabad",
      order: 8,
    },
    {
      name: "Rohan & Ipsita",
      role: "Attended together",
      city: "Bengaluru",
      quote:
        "We'd just moved to the city and knew nobody. We left with three numbers saved and a standing dinner plan for next month.",
      rating: 5,
      eventName: "Kasepu Kalisi, Bengaluru",
      order: 9,
    },
    {
      name: "Devika Pillai",
      role: "Chef",
      city: "Kochi",
      quote:
        "As someone who cooks for a living, I'm impossible to impress at these things. The biryani alone would have gotten my ticket's worth.",
      rating: 5,
      eventName: "Kasepu Kalisi, Bengaluru",
      order: 10,
    },
    {
      name: "Aditya Rao",
      role: "Product Manager",
      city: "Hyderabad",
      quote:
        "Refunds, transfers, reminders — every process they mention on the website actually works exactly as described. That shouldn't be remarkable, but it is.",
      rating: 5,
      eventName: "Kasepu Kalisi, Hyderabad",
      order: 11,
    },
    {
      name: "Priyanka Nambiar",
      role: "Architect",
      city: "Chennai",
      quote:
        "Small enough that the band could see the whole room, big enough that it never felt like a private party you'd crashed. That balance is hard to get right.",
      rating: 5,
      eventName: "Kasepu Kalisi, Chennai",
      order: 12,
    },
  ]);

  console.log("Seeded: 3 events, 6 ticket types, 5 bookings with payments/tickets/invoices, check-ins,");
  console.log("        refunds, coupons, waitlist, announcements, support, notifications, logs, CMS content.");

  await disconnectDatabase();
  console.log("Seed complete.");
}

seed().catch((err) => {
  console.error("Seed failed", err);
  process.exit(1);
});
