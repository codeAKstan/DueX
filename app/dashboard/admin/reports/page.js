import ProtectedRoute from "@/components/auth/protected-route"
import SystemReports from "@/components/admin/system-reports"

export default function ReportsPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <SystemReports />
    </ProtectedRoute>
  )
}