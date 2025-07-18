'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { InviteUserDialog } from '@/components/InviteUserDialog'
import { 
  Users, 
  FileText,
  BarChart,
  Settings,
  UserPlus,
  Activity,
  Shield,
  Search,
  Filter,
  Download,
  Mail,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  Loader2,
  BookOpen
} from 'lucide-react'
import { 
  getAdminStats, 
  getLicensedAttorneys, 
  getRecentActivity,
  type AdminStats,
  type LicensedAttorney,
  type RecentActivity
} from '@/lib/admin-stats'

export default function AdminPage() {
  const [showInviteDialog, setShowInviteDialog] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [adminStats, setAdminStats] = useState<AdminStats | null>(null)
  const [licensedAttorneys, setLicensedAttorneys] = useState<LicensedAttorney[]>([])
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()

  useEffect(() => {
    async function loadAdminData() {
      try {
        const [stats, attorneys, activities] = await Promise.all([
          getAdminStats(),
          getLicensedAttorneys(),
          getRecentActivity(5)
        ])
        
        setAdminStats(stats)
        setLicensedAttorneys(attorneys)
        setRecentActivity(activities)
      } catch (error) {
        console.error('Error loading admin data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadAdminData()
  }, [])

  // Filter attorneys based on search query
  const filteredAttorneys = licensedAttorneys.filter(attorney => 
    attorney.attorney.toLowerCase().includes(searchQuery.toLowerCase()) ||
    attorney.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    attorney.firm.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }
  
  return (
    <>
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold tracking-tight">Admin Panel</h1>
        <p className="text-muted-foreground">
          Manage users, monitor system activity, and configure platform settings.
        </p>
      </motion.div>

      {/* Admin Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {[
          { 
            name: 'Total Users', 
            value: adminStats?.totalUsers.toString() || '0', 
            icon: Users, 
            trend: adminStats?.usersTrend || '0%' 
          },
          { 
            name: 'Active Licenses', 
            value: adminStats?.activeLicenses.toString() || '0', 
            icon: Shield, 
            trend: adminStats?.licensesTrend || '0' 
          },
          { 
            name: 'Documents Created', 
            value: adminStats?.documentsCreated.toString() || '0', 
            icon: FileText, 
            trend: adminStats?.documentsTrend || '0%' 
          },
          { 
            name: 'System Health', 
            value: `${adminStats?.systemHealth || 0}%`, 
            icon: Activity, 
            trend: 'Stable' 
          },
        ].map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.name}</CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">{stat.trend}</span> from last month
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Admin Actions */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              User Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-between">
                <span>View All Users</span>
                <Badge variant="secondary">{adminStats?.totalUsers || 0} users</Badge>
              </Button>
              <Button variant="outline" className="w-full justify-between">
                <span>Manage Licenses</span>
                <Badge variant="secondary">{adminStats?.activeLicenses || 0} active</Badge>
              </Button>
              <Button 
                className="w-full justify-between"
                onClick={() => setShowInviteDialog(true)}
              >
                <span className="flex items-center gap-2">
                  <UserPlus className="h-4 w-4" />
                  Invite New User
                </span>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Admin Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(recentActivity.length > 0 ? recentActivity : [
                { id: '1', action: 'No recent activity', user: 'System', time: 'N/A', type: 'system' as const }
              ]).map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between py-3 border-b last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <Badge 
                      variant={activity.type === 'user' ? 'default' : activity.type === 'license' ? 'secondary' : 'outline'}
                      className="w-2 h-2 p-0 rounded-full"
                    />
                    <div>
                      <p className="font-medium">{activity.action}</p>
                      <p className="text-sm text-muted-foreground">{activity.user}</p>
                    </div>
                  </div>
                  <span className="text-sm text-muted-foreground">{activity.time}</span>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <motion.div 
        className="mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-20 flex-col gap-2">
                <BarChart className="h-6 w-6" />
                <span>System Reports</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2">
                <Shield className="h-6 w-6" />
                <span>Security Settings</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex-col gap-2"
                onClick={() => router.push('/admin/training')}
              >
                <BookOpen className="h-6 w-6" />
                <span>Training Videos</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex-col gap-2"
                onClick={() => router.push('/admin/workshops')}
              >
                <Calendar className="h-6 w-6" />
                <span>Workshops</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Licensed Attorney Management */}
      <motion.div 
        className="mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Tabs defaultValue="overview" className="w-full">
          <div className="flex items-center justify-between mb-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="active">Active Licensees</TabsTrigger>
              <TabsTrigger value="inactive">Needs Attention</TabsTrigger>
              <TabsTrigger value="revenue">Revenue</TabsTrigger>
            </TabsList>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button size="sm">
                <UserPlus className="h-4 w-4 mr-2" />
                Add Licensee
              </Button>
            </div>
          </div>

          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Licensed Attorneys Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="text-2xl font-bold text-green-700">
                      {licensedAttorneys.filter(a => a.status === 'Active').length}
                    </div>
                    <div className="text-sm text-green-600">Active Licensees</div>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="text-2xl font-bold text-yellow-700">
                      {licensedAttorneys.filter(a => a.status === 'Trial Period').length}
                    </div>
                    <div className="text-sm text-yellow-600">Trial Period</div>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
                    <div className="text-2xl font-bold text-red-700">
                      {licensedAttorneys.filter(a => a.status === 'Payment Overdue' || a.status === 'Inactive').length}
                    </div>
                    <div className="text-sm text-red-600">Needs Attention</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="text-2xl font-bold text-blue-700">
                      ${licensedAttorneys.reduce((sum, a) => sum + a.monthlyRevenue, 0).toLocaleString()}
                    </div>
                    <div className="text-sm text-blue-600">Monthly Revenue</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Search licensed attorneys:</span>
                    <div className="flex gap-2">
                      <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input 
                        placeholder="Search by name or firm..." 
                        className="pl-8 w-64"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      </div>
                      <Button variant="outline" size="sm">
                        <Filter className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="active">
            <Card>
              <CardHeader>
                <CardTitle>Active Licensed Attorneys</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Attorney</TableHead>
                      <TableHead>Firm</TableHead>
                      <TableHead>License Type</TableHead>
                      <TableHead>Last Login</TableHead>
                      <TableHead>Cases This Month</TableHead>
                      <TableHead>Monthly Revenue</TableHead>
                      <TableHead>Compliance</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAttorneys.filter(attorney => attorney.status === 'Active').map((attorney) => (
                      <TableRow key={attorney.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{attorney.attorney}</div>
                            <div className="text-sm text-muted-foreground">{attorney.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>{attorney.firm}</TableCell>
                        <TableCell>
                          <Badge variant={attorney.licenseType === 'Enterprise' ? 'default' : 'secondary'}>
                            {attorney.licenseType}
                          </Badge>
                        </TableCell>
                        <TableCell>{attorney.lastLogin}</TableCell>
                        <TableCell className="text-center">{attorney.casesThisMonth}</TableCell>
                        <TableCell className="font-medium">${attorney.monthlyRevenue.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant={attorney.complianceScore >= 90 ? 'default' : 'secondary'}>
                            {attorney.complianceScore}%
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm">
                              <Mail className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Settings className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="inactive">
            <Card>
              <CardHeader>
                <CardTitle className="text-red-600">Licensees Needing Attention</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Attorney</TableHead>
                      <TableHead>Issue</TableHead>
                      <TableHead>Last Activity</TableHead>
                      <TableHead>Revenue Impact</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAttorneys.filter(attorney => 
                      attorney.status === 'Payment Overdue' || 
                      attorney.status === 'Inactive' || 
                      attorney.complianceScore < 85
                    ).map((attorney) => (
                      <TableRow key={attorney.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{attorney.attorney}</div>
                            <div className="text-sm text-muted-foreground">{attorney.firm}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="destructive">
                            {attorney.status === 'Payment Overdue' ? 'Payment Overdue' :
                             attorney.status === 'Inactive' ? 'Inactive 15+ days' :
                             attorney.complianceScore < 85 ? 'Low Compliance' : attorney.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{attorney.lastLogin}</TableCell>
                        <TableCell className="font-medium text-red-600">${attorney.monthlyRevenue.toLocaleString()}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button variant="outline" size="sm">
                              <Mail className="h-4 w-4 mr-1" />
                              Contact
                            </Button>
                            <Button variant="destructive" size="sm">
                              Suspend
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="revenue">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Revenue Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-6 bg-green-50 rounded-lg border border-green-200">
                    <div className="text-3xl font-bold text-green-700">
                      ${licensedAttorneys.reduce((sum, a) => sum + a.monthlyRevenue, 0).toLocaleString()}
                    </div>
                    <div className="text-sm text-green-600">Total Monthly Revenue</div>
                  </div>
                  <div className="text-center p-6 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="text-3xl font-bold text-blue-700">
                      ${licensedAttorneys.filter(a => a.status === 'Active').length > 0 
                        ? Math.round(licensedAttorneys.reduce((sum, a) => sum + a.monthlyRevenue, 0) / licensedAttorneys.filter(a => a.status === 'Active').length).toLocaleString()
                        : '0'
                      }
                    </div>
                    <div className="text-sm text-blue-600">Avg Revenue Per Licensee</div>
                  </div>
                  <div className="text-center p-6 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="text-3xl font-bold text-purple-700">
                      {licensedAttorneys.reduce((sum, a) => sum + a.casesThisMonth, 0)}
                    </div>
                    <div className="text-sm text-purple-600">Total Cases This Month</div>
                  </div>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Attorney</TableHead>
                      <TableHead>License Type</TableHead>
                      <TableHead>Monthly Revenue</TableHead>
                      <TableHead>Cases Completed</TableHead>
                      <TableHead>Revenue per Case</TableHead>
                      <TableHead>Performance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAttorneys.sort((a, b) => b.monthlyRevenue - a.monthlyRevenue).map((attorney) => {
                      const revenue = attorney.monthlyRevenue
                      const revenuePerCase = attorney.casesThisMonth > 0 ? Math.round(revenue / attorney.casesThisMonth) : 0
                      return (
                        <TableRow key={attorney.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{attorney.attorney}</div>
                              <div className="text-sm text-muted-foreground">{attorney.firm}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={attorney.licenseType === 'Enterprise' ? 'default' : 'secondary'}>
                              {attorney.licenseType}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-bold text-green-600">${attorney.monthlyRevenue.toLocaleString()}</TableCell>
                          <TableCell className="text-center">{attorney.casesThisMonth}</TableCell>
                          <TableCell>${revenuePerCase.toLocaleString()}</TableCell>
                          <TableCell>
                            <Badge variant={revenue > 3000 ? 'default' : revenue > 1500 ? 'secondary' : 'outline'}>
                              {revenue > 3000 ? 'Excellent' : revenue > 1500 ? 'Good' : 'Needs Improvement'}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
      <InviteUserDialog 
        open={showInviteDialog} 
        onOpenChange={setShowInviteDialog} 
      />
    </>
  )
}