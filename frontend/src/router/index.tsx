import { createBrowserRouter, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'

// Layouts — eager (Suspense boundary shells)
import Layout from '../Layout'
import PublicLayout from '@/components/layout/PublicLayout'
import OrganizerDashboardLayout from '../components/layout/OrganizerDashboardLayout'
import AttendeeDashboardLayout from '../components/layout/AttendeeDashboardLayout'
import AdminDashboardLayout from '../components/layout/AdminDashboardLayout'

// Auth & error — eager
import LoginPage from '../pages/LoginPage'
import RegisterPage from '../pages/RegisterPage'
import NotFoundView from '../pages/NotFoundView'

// Public pages — lazy
const HomePage = lazy(() => import('../pages/HomePage'))
const EventsListPage = lazy(() => import('../pages/EventsListPage'))
const EventDetailPage = lazy(() => import('../pages/EventDetailPage'))
const CheckoutPage = lazy(() => import('../pages/CheckoutPage'))

// Organizer pages — lazy
const OrganizerDashboardHome = lazy(() => import('../pages/organizer/DashboardHome'))
const OrganizerProfileView = lazy(() => import('../pages/organizer/ProfileView'))
const EventsManageView = lazy(() => import('../pages/organizer/EventsManageView'))
const CreateEventView = lazy(() => import('../pages/organizer/CreateEventView'))
const EditEventView = lazy(() => import('../pages/organizer/EditEventView'))
const OrdersView = lazy(() => import('../pages/organizer/OrdersView'))
const AttendeesView = lazy(() => import('../pages/organizer/AttendeesView'))

// Attendee pages — lazy
const AttendeeDashboardHome = lazy(() => import('../pages/attendee/DashboardHome'))
const AttendeeTicketsView = lazy(() => import('../pages/attendee/TicketsView'))
const AttendeeCalendarView = lazy(() => import('../pages/attendee/CalendarView'))
const AttendeeProfileView = lazy(() => import('../pages/attendee/ProfileView'))
const AttendeeWalletView = lazy(() => import('../pages/attendee/WalletView'))

// Admin pages — lazy
const AdminDashboardHome = lazy(() => import('../pages/admin/DashboardHome'))
const AdminUserManagement = lazy(() => import('../pages/admin/UserManagement'))
const AdminOrganizerRequests = lazy(() => import('../pages/admin/OrganizerRequests'))
const AdminEventManagement = lazy(() => import('../pages/admin/EventManagement'))
const AdminBookings = lazy(() => import('../pages/admin/AdminPages').then(m => ({ default: m.Bookings })))
const AdminPayments = lazy(() => import('../pages/admin/AdminPages').then(m => ({ default: m.Payments })))
const AdminTopUpRequests = lazy(() => import('../pages/admin/AdminPages').then(m => ({ default: m.TopUpRequests })))
const AdminReporting = lazy(() => import('../pages/admin/AdminPages').then(m => ({ default: m.Reporting })))
const AdminCategories = lazy(() => import('../pages/admin/AdminPages').then(m => ({ default: m.Categories })))
const AdminProfile = lazy(() => import('../pages/admin/AdminPages').then(m => ({ default: m.Profile })))
const PromotionsView = lazy(() => import('../pages/admin/PromotionsView'))

const fallback = <div />

const router = createBrowserRouter([
  {
    element: <Suspense fallback={fallback}><PublicLayout /></Suspense>,
    errorElement: <NotFoundView />,
    children: [
      {
        path: '/',
        element: <HomePage />,
      },
      {
        path: '/events',
        element: <EventsListPage />,
      },
    ],
  },
  {
    path: '/login',
    element: <LoginPage isOrganizer={false} />,
  },
  {
    path: '/register',
    element: <RegisterPage isOrganizer={false} />,
  },
  {
    path: '/organizer/login',
    element: <LoginPage isOrganizer={true} />,
  },
  {
    path: '/organizer/register',
    element: <RegisterPage isOrganizer={true} />,
  },
  {
    element: <Suspense fallback={fallback}><Layout /></Suspense>,
    errorElement: <NotFoundView />,
    children: [
      {
        path: '/event/:id',
        element: <EventDetailPage />,
      },
      {
        path: '/checkout',
        element: <CheckoutPage />,
      },
    ],
  },
  {
    path: '/organizer',
    element: <Suspense fallback={fallback}><OrganizerDashboardLayout /></Suspense>,
    errorElement: <NotFoundView />,
    children: [
      {
        index: true,
        element: <Navigate to="dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <OrganizerDashboardHome />,
      },
      {
        path: 'profile',
        element: <OrganizerProfileView />,
      },
      {
        path: 'events',
        element: <EventsManageView />,
      },
      {
        path: 'events/new',
        element: <CreateEventView />,
      },
      {
        path: 'events/:eventId/edit',
        element: <EditEventView />,
      },
      {
        path: 'orders',
        element: <OrdersView />,
      },
      {
        path: 'attendees',
        element: <AttendeesView />,
      },
    ],
  },
  {
    path: '/attendee',
    element: <Suspense fallback={fallback}><AttendeeDashboardLayout /></Suspense>,
    errorElement: <NotFoundView />,
    children: [
      {
        index: true,
        element: <Navigate to="dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <AttendeeDashboardHome />,
      },
      {
        path: 'tickets',
        element: <AttendeeTicketsView />,
      },
      {
        path: 'calendar',
        element: <AttendeeCalendarView />,
      },
      {
        path: 'profile',
        element: <AttendeeProfileView />,
      },
      {
        path: 'wallet',
        element: <AttendeeWalletView />,
      },
    ],
  },
  {
    path: '/admin',
    element: <Suspense fallback={fallback}><AdminDashboardLayout /></Suspense>,
    errorElement: <NotFoundView />,
    children: [
      {
        index: true,
        element: <Navigate to="dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <AdminDashboardHome />,
      },
      {
        path: 'users',
        element: <AdminUserManagement />,
      },
      {
        path: 'organizers/requests',
        element: <AdminOrganizerRequests />,
      },
      {
        path: 'events',
        element: <AdminEventManagement />,
      },
      {
        path: 'categories',
        element: <AdminCategories />,
      },
      {
        path: 'bookings',
        element: <AdminBookings />,
      },
      {
        path: 'promotions',
        element: <PromotionsView />,
      },
      {
        path: 'payments',
        element: <AdminPayments />,
      },
      {
        path: 'top-up-requests',
        element: <AdminTopUpRequests />,
      },
      {
        path: 'reports',
        element: <AdminReporting />,
      },
      {
        path: 'profile',
        element: <AdminProfile />,
      },
    ],
  },
])

export default router