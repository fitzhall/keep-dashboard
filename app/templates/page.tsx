import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function TemplatesPage() {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Template Library</h1>
        <p className="text-muted-foreground">
          Download professional Bitcoin estate planning templates and documents.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Client Documents */}
        <Card>
          <CardHeader>
            <CardTitle>Client Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <p className="font-medium">Bitcoin Trust Template</p>
                  <p className="text-sm text-muted-foreground">Comprehensive trust for Bitcoin holdings</p>
                </div>
                <Button variant="outline" size="sm">Download</Button>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <p className="font-medium">Beneficiary Designation Form</p>
                  <p className="text-sm text-muted-foreground">Designate Bitcoin beneficiaries</p>
                </div>
                <Button variant="outline" size="sm">Download</Button>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <p className="font-medium">Family Recovery Guide</p>
                  <p className="text-sm text-muted-foreground">Instructions for beneficiaries</p>
                </div>
                <Button variant="outline" size="sm">Download</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Attorney Tools */}
        <Card>
          <CardHeader>
            <CardTitle>Attorney Tools</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <p className="font-medium">Intake Questionnaire</p>
                  <p className="text-sm text-muted-foreground">Comprehensive client assessment</p>
                </div>
                <Button variant="outline" size="sm">Download</Button>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <p className="font-medium">Compliance Checklist</p>
                  <p className="text-sm text-muted-foreground">Ensure regulatory compliance</p>
                </div>
                <Button variant="outline" size="sm">Download</Button>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <p className="font-medium">SOP Template</p>
                  <p className="text-sm text-muted-foreground">Standard operating procedures</p>
                </div>
                <Button variant="outline" size="sm">Download</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}