import { Outlet } from "react-router-dom"
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { AdminSecretListener } from './components/auth/AdminSecretListener'

export default function Layout() {
  return (
    <div className='flex flex-col min-h-screen'> 
      <AdminSecretListener />
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  )
}
