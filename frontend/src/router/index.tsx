import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from '../Layout'
import PublicLayout from '@/components/layout/PublicLayout'
import HomePage from '../pages/HomePage'
import EventsListPage from '../pages/EventsListPage'
import EventDetailPage from '../pages/EventDetailPage'
import LoginPage from '../pages/LoginPage'
import RegisterPage from '../pages/RegisterPage'
import CheckoutPage from '../pages/CheckoutPage'

import OrganizerDashboardLayout from '../components/layout/OrganizerDashboardLayout'
import DashboardHome from '../pages/organizer/DashboardHome'
import ProfileView from '../pages/organizer/ProfileView'
import EventsManageView from '../pages/organizer/EventsManageView'
import CreateEventView from '../pages/organizer/CreateEventView'
import OrdersView from '../pages/organizer/OrdersView'
import AttendeesView from '../pages/organizer/AttendeesView'
import AnalyticsView from '../pages/organizer/AnalyticsView'
import SettingsView from '../pages/organizer/SettingsView'

import AttendeeDashboardLayout from '../components/layout/AttendeeDashboardLayout'
import AttendeeDashboardHome from '../pages/attendee/DashboardHome'
import AttendeeTicketsView from '../pages/attendee/TicketsView'
import AttendeeFavoritesView from '../pages/attendee/FavoritesView'
import AttendeeProfileView from '../pages/attendee/ProfileView'
import AttendeeSettingsView from '../pages/attendee/SettingsView'
import AttendeeCalendarView from '../pages/attendee/CalendarView'

import AdminDashboardLayout from '../components/layout/AdminDashboardLayout'
import AdminLoginPage from '../pages/admin/AdminLoginPage'
import AdminDashboardHome from '../pages/admin/DashboardHome'
import AdminUserManagement from '../pages/admin/UserManagement'
import AdminOrganizerRequests from '../pages/admin/OrganizerRequests'
import AdminEventManagement from '../pages/admin/EventManagement'
import { 
  Bookings as AdminBookings, 
  Tickets as AdminTickets, 
  Payments as AdminPayments, 
  Reporting as AdminReporting, 
  Notifications as AdminNotifications, 
  Categories as AdminCategories, 
  Settings as AdminSettings, 
  Profile as AdminProfile 
} from '../pages/admin/AdminPages'

const router = createBrowserRouter([
  {
    element: <PublicLayout />,
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
    path: '/admin/login',
    element: <AdminLoginPage />,
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
    children: [
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
        path: 'orders',
        element: <OrdersView />,
      },
      {
        path: 'attendees',
        element: <AttendeesView />,
      },
      {
        path: 'analytics',
        element: <AnalyticsView />,
      },
      {
        path: 'settings',
        element: <SettingsView />,
      },
    ],
  },
  {
    path: '/attendee',
    element: <AttendeeDashboardLayout />,
    children: [
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
        path: 'favorites',
        element: <AttendeeFavoritesView />,
      },
      {
        path: 'profile',
        element: <AttendeeProfileView />,
      },
      {
        path: 'settings',
        element: <AttendeeSettingsView />,
      },
    ],
  },
  {
    path: '/admin',
    element: <AdminDashboardLayout />,
    children: [
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
        path: 'tickets',
        element: <AdminTickets />,
      },
      {
        path: 'payments',
        element: <AdminPayments />,
      },
      {
        path: 'reports',
        element: <AdminReporting />,
      },
      {
        path: 'notifications',
        element: <AdminNotifications />,
      },
      {
        path: 'settings',
        element: <AdminSettings />,
      },
      {
        path: 'profile',
        element: <AdminProfile />,
      },
    ],
  },
])

export default router
