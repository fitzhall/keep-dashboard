import DashboardLayout from '@/components/DashboardLayout'

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary-900">Settings</h1>
          <p className="mt-2 text-secondary-600">
            Manage your account settings and preferences.
          </p>
        </div>

        <div className="max-w-4xl">
          {/* Profile Settings */}
          <div className="card mb-6">
            <h2 className="text-lg font-semibold text-secondary-900 mb-4">Profile Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  defaultValue="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  defaultValue="john@lawfirm.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Bar Number
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  defaultValue="12345"
                />
              </div>
              <button className="btn-primary">Save Changes</button>
            </div>
          </div>

          {/* Firm Settings */}
          <div className="card mb-6">
            <h2 className="text-lg font-semibold text-secondary-900 mb-4">Firm Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Firm Name
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  defaultValue="Smith & Associates Law Firm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Territory (Geographic Exclusivity)
                </label>
                <select className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500">
                  <option>Northern California</option>
                  <option>Southern California</option>
                  <option>New York Metro</option>
                  <option>Texas</option>
                </select>
              </div>
              <div className="p-4 bg-amber-50 rounded-lg">
                <p className="text-sm text-amber-800">
                  <strong>Note:</strong> Territory exclusivity is granted to Founding 10 members only.
                  Contact support to verify your exclusive territory rights.
                </p>
              </div>
            </div>
          </div>

          {/* License Information */}
          <div className="card">
            <h2 className="text-lg font-semibold text-secondary-900 mb-4">License Information</h2>
            <div className="space-y-3">
              <div className="flex justify-between py-2">
                <span className="text-secondary-600">License Type</span>
                <span className="font-medium text-secondary-900">Professional</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-secondary-600">Active Seats</span>
                <span className="font-medium text-secondary-900">3 of 5</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-secondary-600">Renewal Date</span>
                <span className="font-medium text-secondary-900">December 31, 2025</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-secondary-600">Version</span>
                <span className="font-medium text-secondary-900">KEEP Protocol v1.0</span>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-secondary-200">
              <button className="btn-secondary mr-3">Manage Seats</button>
              <button className="btn-secondary">View Invoice History</button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}