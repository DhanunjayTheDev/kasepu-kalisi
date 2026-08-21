export interface Venue {
  name: string;
  address: string;
  city: string;
  state?: string;
  pincode?: string;
  parkingAvailable?: boolean;
  parkingCapacity?: number;
  parkingFee?: number;
  parkingInstructions?: string;
  directions?: string;
  landmarks?: string[];
  contactNumber?: string;
}

export interface EventItem {
  _id: string;
  title: string;
  slug: string;
  tagline?: string;
  description?: string;
  city: string;
  date: string;
  startTime?: string;
  endTime?: string;
  status: string;
  venue: Venue;
  priceFrom: number;
  featured?: boolean;
}

export interface TicketTypeItem {
  _id: string;
  event: string | EventItem;
  name: string;
  description?: string;
  price: number;
  capacity: number;
  sold: number;
  reserved: number;
  available?: number;
  maxPerBooking: number;
  status: string;
}

export interface ScheduleItemApi {
  _id: string;
  event: string;
  time: string;
  title: string;
  description?: string;
  order: number;
}

export interface ArtistItem {
  _id: string;
  event: string;
  name: string;
  genre?: string;
  bio?: string;
  performanceTime?: string;
  photoUrl?: string;
  videoUrl?: string;
  status: string;
}

export interface MenuItemApi {
  _id: string;
  event: string;
  category: string;
  name: string;
  dietary: string;
}

export interface GalleryItemApi {
  _id: string;
  event: string;
  album: string;
  type: "image" | "video";
  url: string;
  status: string;
}

export interface CouponItem {
  _id: string;
  code: string;
  type: "percentage" | "fixed";
  value: number;
  event?: string;
  usageCount: number;
  usageLimit?: number;
  active: boolean;
}

export interface WaitlistEntry {
  _id: string;
  name: string;
  mobile: string;
  event: string | EventItem;
  ticketType: string | TicketTypeItem;
  quantity: number;
  notifiedAt?: string;
  createdAt: string;
}

export interface BookingItem {
  _id: string;
  bookingId: string;
  user: string | { fullName?: string; mobile?: string; email?: string };
  event: string | EventItem;
  ticketType: string | TicketTypeItem;
  quantity: number;
  contact: { fullName: string; mobile: string; email: string };
  total: number;
  status: string;
  createdAt: string;
}

export interface AttendeeItem {
  _id: string;
  booking: string | BookingItem;
  name: string;
  age: number;
  gender: string;
}

export interface PaymentItem {
  _id: string;
  booking: string | BookingItem;
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  amount: number;
  method?: string;
  status: string;
  createdAt: string;
}

export interface RefundItem {
  _id: string;
  booking: string | BookingItem;
  amount: number;
  reason?: string;
  status: string;
  createdAt: string;
}

export interface CheckInItem {
  _id: string;
  ticket: string | { ticketId: string; attendee?: { name: string } };
  event?: string | EventItem;
  staff?: { name: string };
  gate?: string;
  device?: string;
  createdAt: string;
}

export interface AnnouncementItem {
  _id: string;
  event: string | EventItem;
  title: string;
  content: string;
  priority: string;
  status: string;
  createdAt: string;
}

export interface StaffItem {
  _id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

export interface AuditLogItem {
  _id: string;
  actor: string | { name: string; email: string; role: string };
  action: string;
  resource: string;
  createdAt: string;
}

export interface SupportTicketItem {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  priority: string;
  status: string;
  createdAt: string;
}

export interface SettingsData {
  general: { businessName?: string; supportEmail?: string; clientUrl?: string; adminUrl?: string };
  tax: {
    gstin?: string;
    invoicePrefix?: string;
    cgstPercent?: number;
    sgstPercent?: number;
    igstPercent?: number;
  };
  reminders: { intervalsDays?: number[] };
}
