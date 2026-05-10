import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from '../Layout'
import PublicLayout from '@/components/layout/PublicLayout'
import HomePage from '../pages/HomePage'
import EventsListPage from '../pages/EventsListPage'
import EventDetailPage from '../pages/EventDetailPage'
import LoginPage from '../pages/LoginPage'
import RegisterPage from '../pages/RegisterPage'
import DashboardPage from '../pages/DashboardPage'

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
    path: 'dashboard',
    element: <DashboardPage />,
  },
  {
    path: 'organizer/dashboard',
    element: <DashboardPage />,
  },
])

export default router
