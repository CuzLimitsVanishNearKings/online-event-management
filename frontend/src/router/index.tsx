import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from '../Layout'
import PublicLayout from '@/components/layout/PublicLayout'
import HomePage from '../pages/HomePage'
import EventsListPage from '../pages/EventsListPage'
import EventDetailPage from '../pages/EventDetailPage'
import LoginPage from '../pages/LoginPage'
import RegisterPage from '../pages/RegisterPage'

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
      {
        path: '/how-it-works',
        element: <HomePage />, // Will be replaced with HowItWorksPage
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
    children: [
      {
        path: '/event/:id',
        element: <EventDetailPage />,
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
])

export default router
