import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Users,
  UserCheck,
  Calendar,
  BarChart3,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  MoreVertical,
  ShieldAlert
} from 'lucide-react'
import { Button } from '@/components/ui'
import { useAuthStore } from '@/store/authStore'
import { cn } from '@/utils/cn'
import axiosClient from '@/api/axiosClient'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
}
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
}

export default function DashboardHome() {
  const { user } = useAuthStore()

  const [platformMetrics, setPlatformMetrics] = useState({
    totalUsers: 0,
    totalOrganizers: 0,
    activeEvents: 0,
    totalRevenue: 0,
    usersGrowth: 0,
    organizersGrowth: 0,
    eventsGrowth: 0,
    revenueGrowth: 0,
    pendingOrganizers: [] as any[]
  })

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const [usersRes, orgsRes, eventsRes, revRes] = await Promise.all([
          axiosClient.get('/users'),
          axiosClient.get('/users/organizers'),
          axiosClient.get('/events/admin/all'),
          axiosClient.get('/payments/revenue')
        ])

        const users = usersRes.data || []
        const organizers = orgsRes.data || []
        const events = eventsRes.data || []
        const revenue = revRes.data?.totalRevenue || 0

        // Process pending organizers
        const pendingOrgs = organizers
          .filter((org: any) => org.status === 'PENDING')
          .map((org: any) => ({
            id: org.id,
            name: org.fullName || org.username,
            organization: org.companyName || 'N/A',
            submitted: new Date().toLocaleDateString(),
            status: org.status
          }))

        setPlatformMetrics(prev => ({
          ...prev,
          totalUsers: users.length,
          totalOrganizers: organizers.length,
          activeEvents: events.length,
          totalRevenue: revenue,
          pendingOrganizers: pendingOrgs
        }))
      } catch (error) {
        console.error('Error fetching admin dashboard metrics', error)
      }
    }

    fetchMetrics()
  }, [])

  const statCards = [
    {
      title: 'Total Users',
      value: platformMetrics.totalUsers.toLocaleString(),
      growth: platformMetrics.usersGrowth,
      icon: Users,
      color: 'text-primary',
      bg: 'bg-primary/10'
    },
    {
      title: 'Organizers',
      value: platformMetrics.totalOrganizers.toLocaleString(),
      growth: platformMetrics.organizersGrowth,
      icon: UserCheck,
      color: 'text-accent-dark',
      bg: 'bg-accent/10'
    },
    {
      title: 'Active Events',
      value: platformMetrics.activeEvents.toLocaleString(),
      growth: platformMetrics.eventsGrowth,
      icon: Calendar,
      color: 'text-sage',
      bg: 'bg-sage/10'
    },
    {
      title: 'Platform Revenue',
      value: `${platformMetrics.totalRevenue.toLocaleString()} FCFA`,
      growth: platformMetrics.revenueGrowth,
      icon: BarChart3,
      color: 'text-terracotta',
      bg: 'bg-terracotta/10'
    }
  ]

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
      {/* Hero */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-text-primary tracking-tight">
            Welcome back, {user?.name?.split(' ')[0] || 'Admin'}
          </h1>
          <p className="text-text-muted mt-2 font-medium">
            Here's what's happening across the platform today.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-xl font-bold border-border bg-white">
            Export Report
          </Button>
          <Button variant="primary" className="rounded-xl gap-2 font-bold shadow-md shadow-primary/20">
            <ShieldAlert className="w-5 h-5" />
            Manage Platform
          </Button>
        </div>
      </motion.div>

      {/* Metrics Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-border shadow-sm hover:shadow-card-hover transition-all duration-300">
            <div className="flex justify-between items-start">
              <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center', stat.bg)}>
                <stat.icon className={cn('w-6 h-6', stat.color)} />
              </div>
              {stat.growth !== 0 && (
                <div className={cn(
                  'flex items-center gap-1 text-sm font-bold px-2 py-1 rounded-md',
                  stat.growth > 0 ? 'text-green-700 bg-green-50' : 'text-red-700 bg-red-50'
                )}>
                  {stat.growth > 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                  {Math.abs(stat.growth)}%
                </div>
              )}
            </div>
            <div className="mt-6">
              <p className="text-text-muted font-bold text-xs uppercase tracking-wider">{stat.title}</p>
              <h3 className="text-3xl font-display font-bold text-text-primary mt-1">{stat.value}</h3>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Pending Organizer Requests Table */}
      <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-text-primary">Pending Organizer Requests</h2>
            <p className="text-sm text-text-muted">Review and approve new organizer applications</p>
          </div>
          <Link to="/admin/organizers/requests">
            <Button variant="outline" className="rounded-xl border-border hover:bg-surface font-bold text-sm">
              View All Requests <ArrowUpRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-text-muted border-b border-border">Applicant</th>
                <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-text-muted border-b border-border">Organization</th>
                <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-text-muted border-b border-border">Submitted</th>
                <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-text-muted border-b border-border">Status</th>
                <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-text-muted border-b border-border text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {platformMetrics.pendingOrganizers.length > 0 ? (
                platformMetrics.pendingOrganizers.map((org: any) => (
                  <tr key={org.id} className="group hover:bg-gray-50/50 transition-colors border-b border-border/50 last:border-0">
                    <td className="py-4 px-6 font-bold text-text-primary">{org.name}</td>
                    <td className="py-4 px-6 text-text-secondary">{org.organization}</td>
                    <td className="py-4 px-6 text-text-muted text-sm">{org.submitted}</td>
                    <td className="py-4 px-6">
                      <span className="px-3 py-1 text-xs font-bold rounded-full bg-amber-100 text-amber-700">Pending</span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button className="p-2 text-text-muted hover:text-text-primary hover:bg-surface rounded-lg transition-colors">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-12 px-6 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <UserCheck className="w-12 h-12 text-border mb-3" />
                      <p className="font-bold text-text-primary">No pending requests</p>
                      <p className="text-sm text-text-muted mt-1">All organizer applications have been processed.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  )
}
