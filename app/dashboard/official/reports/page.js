import ProtectedRoute from "@/components/auth/protected-route"
import OfficialReports from "@/components/official/official-reports"

export default function ReportsPage() {
  return (
    <ProtectedRoute requiredRole="official">
      <OfficialReports />
    </ProtectedRoute>
  )
}