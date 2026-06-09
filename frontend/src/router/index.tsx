import { createBrowserRouter, Navigate } from 'react-router-dom'
import Layout from '../Layout'
import PublicLayout from '@/components/layout/PublicLayout'
import HomePage from '../pages/HomePage'
import EventsListPage from '../pages/EventsListPage'
import EventDetailPage from '../pages/EventDetailPage'
import LoginPage from '../pages/LoginPage'
import RegisterPage from '../pages/RegisterPage'
import CheckoutPage from '../pages/CheckoutPage'
import NotFoundView from '../pages/NotFoundView'

import OrganizerDashboardLayout from '../components/layout/OrganizerDashboardLayout'
import DashboardHome from '../pages/organizer/DashboardHome'
import ProfileView from '../pages/organizer/ProfileView'
import EventsManageView from '../pages/organizer/EventsManageView'
import CreateEventView from '../pages/organizer/CreateEventView'
import EditEventView from '../pages/organizer/EditEventView'
import OrdersView from '../pages/organizer/OrdersView'
import AttendeesView from '../pages/organizer/AttendeesView'

import AttendeeDashboardLayout from '../components/layout/AttendeeDashboardLayout'
import AttendeeDashboardHome from '../pages/attendee/DashboardHome'
import AttendeeTicketsView from '../pages/attendee/TicketsView'
import AttendeeCalendarView from '../pages/attendee/CalendarView'
import AttendeeProfileView from '../pages/attendee/ProfileView'
import AttendeeWalletView from '../pages/attendee/WalletView'

import AdminDashboardLayout from '../components/layout/AdminDashboardLayout'
import AdminDashboardHome from '../pages/admin/DashboardHome'
import AdminUserManagement from '../pages/admin/UserManagement'
import AdminOrganizerRequests from '../pages/admin/OrganizerRequests'
import AdminEventManagement from '../pages/admin/EventManagement'
import { 
  Bookings as AdminBookings, 
  Payments as AdminPayments, 
  TopUpRequests as AdminTopUpRequests,
  Reporting as AdminReporting, 
  Categories as AdminCategories, 
  Profile as AdminProfile 
} from '../pages/admin/AdminPages'
import PromotionsView from '../pages/admin/PromotionsView'

const router = createBrowserRouter([
  {
    element: <PublicLayout />,
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
    element: <Layout />,
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
    element: <OrganizerDashboardLayout />,
    errorElement: <NotFoundView />,
    children: [
      {
        index: true,
        element: <Navigate to="dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <DashboardHome />,
      },
      {
        path: 'profile',
        element: <ProfileView />,
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
    element: <AttendeeDashboardLayout />,
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
    element: <AdminDashboardLayout />,
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
