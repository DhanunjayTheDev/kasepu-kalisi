import { Routes, Route } from "react-router-dom";
import { Sidebar } from "@/components/sidebar";
import { Topbar } from "@/components/topbar";
import { ProtectedRoute } from "@/components/protected-route";

import LoginPage from "@/pages/LoginPage";
import DashboardPage from "@/pages/DashboardPage";
import EventsPage from "@/pages/EventsPage";
import CreateEventPage from "@/pages/CreateEventPage";
import EditEventPage from "@/pages/EditEventPage";
import SchedulesPage from "@/pages/SchedulesPage";
import ArtistsPage from "@/pages/ArtistsPage";
import MenuPage from "@/pages/MenuPage";
import GalleryAdminPage from "@/pages/GalleryAdminPage";
import TicketTypesPage from "@/pages/TicketTypesPage";
import InventoryPage from "@/pages/InventoryPage";
import CouponsPage from "@/pages/CouponsPage";
import WaitlistPage from "@/pages/WaitlistPage";
import BookingsPage from "@/pages/BookingsPage";
import AttendeesPage from "@/pages/AttendeesPage";
import PaymentsPage from "@/pages/PaymentsPage";
import RefundsPage from "@/pages/RefundsPage";
import ScannerPage from "@/pages/ScannerPage";
import LiveAttendancePage from "@/pages/LiveAttendancePage";
import CheckinHistoryPage from "@/pages/CheckinHistoryPage";
import EventControlCenterPage from "@/pages/EventControlCenterPage";
import AnnouncementsPage from "@/pages/AnnouncementsPage";
import ParkingPage from "@/pages/ParkingPage";
import SupportPage from "@/pages/SupportPage";
import SalesReportPage from "@/pages/SalesReportPage";
import RevenueReportPage from "@/pages/RevenueReportPage";
import AttendanceReportPage from "@/pages/AttendanceReportPage";
import ExportsPage from "@/pages/ExportsPage";
import UsersAttendeesPage from "@/pages/UsersAttendeesPage";
import StaffPage from "@/pages/StaffPage";
import CmsHomepagePage from "@/pages/CmsHomepagePage";
import CmsAboutPage from "@/pages/CmsAboutPage";
import CmsFaqPage from "@/pages/CmsFaqPage";
import CmsTestimonialsPage from "@/pages/CmsTestimonialsPage";
import CmsContactPage from "@/pages/CmsContactPage";
import GeneralSettingsPage from "@/pages/GeneralSettingsPage";
import PaymentSettingsPage from "@/pages/PaymentSettingsPage";
import TaxSettingsPage from "@/pages/TaxSettingsPage";
import EmailSettingsPage from "@/pages/EmailSettingsPage";
import WhatsAppSettingsPage from "@/pages/WhatsAppSettingsPage";
import StorageSettingsPage from "@/pages/StorageSettingsPage";
import RolesSettingsPage from "@/pages/RolesSettingsPage";
import SecuritySettingsPage from "@/pages/SecuritySettingsPage";
import AuditLogsPage from "@/pages/AuditLogsPage";

function AdminShell() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex h-full min-w-0 flex-1 flex-col">
        <Topbar />
        <main className="min-w-0 flex-1 overflow-y-auto overflow-x-hidden p-6">
          <Routes>
            <Route path="/" element={<DashboardPage />} />

            <Route path="/events" element={<EventsPage />} />
            <Route path="/events/new" element={<CreateEventPage />} />
            <Route path="/events/:id/edit" element={<EditEventPage />} />
            <Route path="/events/schedules" element={<SchedulesPage />} />
            <Route path="/events/artists" element={<ArtistsPage />} />
            <Route path="/events/menu" element={<MenuPage />} />
            <Route path="/events/gallery" element={<GalleryAdminPage />} />

            <Route path="/tickets" element={<TicketTypesPage />} />
            <Route path="/tickets/inventory" element={<InventoryPage />} />
            <Route path="/tickets/coupons" element={<CouponsPage />} />
            <Route path="/tickets/waitlist" element={<WaitlistPage />} />

            <Route path="/bookings" element={<BookingsPage />} />
            <Route path="/bookings/attendees" element={<AttendeesPage />} />
            <Route path="/bookings/payments" element={<PaymentsPage />} />
            <Route path="/bookings/refunds" element={<RefundsPage />} />

            <Route path="/checkin" element={<ScannerPage />} />
            <Route path="/checkin/live" element={<LiveAttendancePage />} />
            <Route path="/checkin/history" element={<CheckinHistoryPage />} />

            <Route path="/operations/control-center" element={<EventControlCenterPage />} />
            <Route path="/operations/announcements" element={<AnnouncementsPage />} />
            <Route path="/operations/parking" element={<ParkingPage />} />
            <Route path="/operations/support" element={<SupportPage />} />

            <Route path="/reports" element={<SalesReportPage />} />
            <Route path="/reports/revenue" element={<RevenueReportPage />} />
            <Route path="/reports/attendance" element={<AttendanceReportPage />} />
            <Route path="/reports/exports" element={<ExportsPage />} />

            <Route path="/users" element={<UsersAttendeesPage />} />
            <Route path="/users/staff" element={<StaffPage />} />

            <Route path="/cms" element={<CmsHomepagePage />} />
            <Route path="/cms/about" element={<CmsAboutPage />} />
            <Route path="/cms/faq" element={<CmsFaqPage />} />
            <Route path="/cms/testimonials" element={<CmsTestimonialsPage />} />
            <Route path="/cms/contact" element={<CmsContactPage />} />

            <Route path="/settings" element={<GeneralSettingsPage />} />
            <Route path="/settings/payments" element={<PaymentSettingsPage />} />
            <Route path="/settings/tax" element={<TaxSettingsPage />} />
            <Route path="/settings/email" element={<EmailSettingsPage />} />
            <Route path="/settings/whatsapp" element={<WhatsAppSettingsPage />} />
            <Route path="/settings/storage" element={<StorageSettingsPage />} />
            <Route path="/settings/roles" element={<RolesSettingsPage />} />
            <Route path="/settings/security" element={<SecuritySettingsPage />} />

            <Route path="/audit-logs" element={<AuditLogsPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <AdminShell />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
