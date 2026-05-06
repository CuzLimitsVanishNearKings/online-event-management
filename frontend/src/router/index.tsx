import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from '../Layout'
import PublicLayout from '@/components/layout/PublicLayout'
import HomePage from '../pages/HomePage'
import EventsListPage from '../pages/EventsListPage'
import EventDetailPage from '../pages/EventDetailPage'
import LoginPage from '../pages/LoginPage'
import RegisterPage from '../pages/RegisterPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'events',
        element: <EventsListPage />,
      },
      {
        path: 'how-it-works',
        element: <HomePage />, // Will be replaced with HowItWorksPage
      },
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'register',
        element: <RegisterPage />,
      },
    ],
  },
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: 'event/:id',
        element: <EventDetailPage />,
      },
    ],
  },
])

export default router
