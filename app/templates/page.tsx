import DashboardLayout from '@/components/DashboardLayout'

export default function TemplatesPage() {
  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary-900">Template Library</h1>
          <p className="mt-2 text-secondary-600">
            Download professional Bitcoin estate planning templates and documents.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Client Documents */}
          <div className="card">
            <h2 className="text-lg font-semibold text-secondary-900 mb-4">Client Documents</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
                <div>
                  <p className="font-medium text-secondary-900">Bitcoin Trust Template</p>
                  <p className="text-sm text-secondary-600">Comprehensive trust for Bitcoin holdings</p>
                </div>
                <button className="btn-secondary text-sm">Download</button>
              </div>
              <div className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
                <div>
                  <p className="font-medium text-secondary-900">Beneficiary Designation Form</p>
                  <p className="text-sm text-secondary-600">Designate Bitcoin beneficiaries</p>
                </div>
                <button className="btn-secondary text-sm">Download</button>
              </div>
              <div className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
                <div>
                  <p className="font-medium text-secondary-900">Family Recovery Guide</p>
                  <p className="text-sm text-secondary-600">Instructions for beneficiaries</p>
                </div>
                <button className="btn-secondary text-sm">Download</button>
              </div>
            </div>
          </div>

          {/* Attorney Tools */}
          <div className="card">
            <h2 className="text-lg font-semibold text-secondary-900 mb-4">Attorney Tools</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
                <div>
                  <p className="font-medium text-secondary-900">Intake Questionnaire</p>
                  <p className="text-sm text-secondary-600">Comprehensive client assessment</p>
                </div>
                <button className="btn-secondary text-sm">Download</button>
              </div>
              <div className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
                <div>
                  <p className="font-medium text-secondary-900">Compliance Checklist</p>
                  <p className="text-sm text-secondary-600">Ensure regulatory compliance</p>
                </div>
                <button className="btn-secondary text-sm">Download</button>
              </div>
              <div className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
                <div>
                  <p className="font-medium text-secondary-900">SOP Template</p>
                  <p className="text-sm text-secondary-600">Standard operating procedures</p>
                </div>
                <button className="btn-secondary text-sm">Download</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}