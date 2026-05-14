import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import { AdminSecretListener } from '../auth/AdminSecretListener'

const PublicLayout = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AdminSecretListener />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default PublicLayout
