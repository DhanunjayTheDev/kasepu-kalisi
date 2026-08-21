export interface Venue {
  name: string;
  address: string;
  city: string;
  state?: string;
  pincode?: string;
  mapUrl?: string;
  parkingAvailable?: boolean;
  parkingCapacity?: number;
  parkingFee?: number;
  parkingInstructions?: string;
  directions?: string;
  landmarks?: string[];
  publicTransport?: string;
  emergencyExits?: string;
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
  event: string;
  name: string;
  description?: string;
  price: number;
  capacity: number;
  sold: number;
  reserved: number;
  available?: number;
  maxPerBooking: number;
  benefits?: string[];
  dinnerIncluded?: boolean;
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
  featured?: boolean;
}

export interface FaqItemApi {
  _id: string;
  question: string;
  answer: string;
  order: number;
}

export interface TestimonialItem {
  _id: string;
  name: string;
  role?: string;
  city?: string;
  quote: string;
  rating: number;
  eventName?: string;
  status: string;
  order: number;
}

export interface AttendeeInput {
  name: string;
  age: number;
  gender: "male" | "female" | "other";
}

export interface BookingItem {
  _id: string;
  bookingId: string;
  event: string | EventItem;
  ticketType: string | TicketTypeItem;
  quantity: number;
  contact: { fullName: string; mobile: string; email: string; gender?: string; age?: number; city?: string };
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  status: string;
  createdAt: string;
}

export interface TicketItem {
  _id: string;
  ticketId: string;
  booking: string;
  event: string | EventItem;
  ticketType: string | TicketTypeItem;
  attendee: string;
  qrToken: string;
  status: string;
}
