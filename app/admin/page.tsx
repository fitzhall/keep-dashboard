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
  DollarSign
} from 'lucide-react'

// Mock licensed attorney data - these are the law firms/attorneys using KEEP
const licensedAttorneys = [
  {
    id: 1,
    attorney: 'Sarah Johnson, Esq.',
    email: 'sarah.johnson@johnsonlaw.com',
    firm: 'Johnson Estate Planning',
    licenseType: 'Premium',
    status: 'Active',
    lastLogin: '2024-01-14',
    licensedSince: '2023-06-15',
    monthlyRevenue: '$2,500',
    casesThisMonth: 8,
    complianceScore: 95,
    barNumber: 'CA123456'
  },
  {
    id: 2,
    attorney: 'Michael Chen, Esq.',
    email: 'mchen@chenlaw.com',
    firm: 'Chen & Associates',
    licenseType: 'Standard',
    status: 'Active',
    lastLogin: '2024-01-13',
    licensedSince: '2023-08-22',
    monthlyRevenue: '$1,800',
    casesThisMonth: 5,
    complianceScore: 88,
    barNumber: 'NY789012'
  },
  {
    id: 3,
    attorney: 'Emma Rodriguez, Esq.',
    email: 'emma@rodriguezlaw.com',
    firm: 'Rodriguez Family Law',
    licenseType: 'Premium',
    status: 'Payment Overdue',
    lastLogin: '2024-01-10',
    licensedSince: '2023-03-10',
    monthlyRevenue: '$3,200',
    casesThisMonth: 12,
    complianceScore: 92,
    barNumber: 'TX345678'
  },
  {
    id: 4,
    attorney: 'David Thompson, Esq.',
    email: 'dthompson@thompsonlaw.com',
    firm: 'Thompson Estate Services',
    licenseType: 'Enterprise',
    status: 'Active',
    lastLogin: '2024-01-14',
    licensedSince: '2023-01-05',
    monthlyRevenue: '$5,000',
    casesThisMonth: 18,
    complianceScore: 98,
    barNumber: 'FL901234'
  },
  {
    id: 5,
    attorney: 'Lisa Park, Esq.',
    email: 'lpark@parklaw.com',
    firm: 'Park Legal Group',
    licenseType: 'Trial',
    status: 'Trial Period',
    lastLogin: '2024-01-12',
    licensedSince: '2024-01-01',
    monthlyRevenue: '$0',
    casesThisMonth: 2,
    complianceScore: 75,
    barNumber: 'IL567890'
  },
  {
    id: 6,
    attorney: 'Robert Kim, Esq.',
    email: 'rkim@kimlaw.com',
    firm: 'Kim Estate Planning',
    licenseType: 'Standard',
    status: 'Inactive',
    lastLogin: '2023-12-28',
    licensedSince: '2023-09-15',
    monthlyRevenue: '$1,200',
    casesThisMonth: 0,
    complianceScore: 82,
    barNumber: 'WA234567'
  }
]

export default function AdminPage() {
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
          { name: 'Total Users', value: '47', icon: Users, trend: '+12%' },
          { name: 'Active Licenses', value: '10', icon: Shield, trend: '+2' },
          { name: 'Documents Created', value: '283', icon: FileText, trend: '+18%' },
          { name: 'System Health', value: '99.9%', icon: Activity, trend: 'Stable' },
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
                <Badge variant="secondary">47 users</Badge>
              </Button>
              <Button variant="outline" className="w-full justify-between">
                <span>Manage Licenses</span>
                <Badge variant="secondary">10 active</Badge>
              </Button>
              <Button className="w-full justify-between">
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
              {[
                { action: 'New user registered', user: 'jane.smith@lawfirm.com', time: '2 hours ago', type: 'user' },
                { action: 'License renewed', user: 'Founding Member #3', time: '5 hours ago', type: 'license' },
                { action: 'Template updated', user: 'System', time: 'Yesterday', type: 'system' },
              ].map((activity, index) => (
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="h-20 flex-col gap-2">
                <BarChart className="h-6 w-6" />
                <span>System Reports</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2">
                <Shield className="h-6 w-6" />
                <span>Security Settings</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2">
                <FileText className="h-6 w-6" />
                <span>Audit Logs</span>
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
                      ${licensedAttorneys.reduce((sum, a) => sum + parseInt(a.monthlyRevenue.replace(/[$,]/g, '')), 0).toLocaleString()}
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
                        <Input placeholder="Search by name or firm..." className="pl-8 w-64" />
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
                    {licensedAttorneys.filter(attorney => attorney.status === 'Active').map((attorney) => (
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
                        <TableCell className="font-medium">{attorney.monthlyRevenue}</TableCell>
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
                    {licensedAttorneys.filter(attorney => 
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
                        <TableCell className="font-medium text-red-600">{attorney.monthlyRevenue}</TableCell>
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
                      ${licensedAttorneys.reduce((sum, a) => sum + parseInt(a.monthlyRevenue.replace(/[$,]/g, '')), 0).toLocaleString()}
                    </div>
                    <div className="text-sm text-green-600">Total Monthly Revenue</div>
                  </div>
                  <div className="text-center p-6 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="text-3xl font-bold text-blue-700">
                      ${Math.round(licensedAttorneys.reduce((sum, a) => sum + parseInt(a.monthlyRevenue.replace(/[$,]/g, '')), 0) / licensedAttorneys.filter(a => a.status === 'Active').length).toLocaleString()}
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
                    {licensedAttorneys.sort((a, b) => 
                      parseInt(b.monthlyRevenue.replace(/[$,]/g, '')) - parseInt(a.monthlyRevenue.replace(/[$,]/g, ''))
                    ).map((attorney) => {
                      const revenue = parseInt(attorney.monthlyRevenue.replace(/[$,]/g, ''))
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
                          <TableCell className="font-bold text-green-600">{attorney.monthlyRevenue}</TableCell>
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
    </>
  )
}