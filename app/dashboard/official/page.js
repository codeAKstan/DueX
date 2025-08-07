import OfficialDashboard from "@/components/dashboards/official-dashboard"
import ProtectedRoute from "@/components/auth/protected-route"

export default function OfficialDashboardPage() {
  return (
    <ProtectedRoute requiredRole="official">
      <OfficialDashboard />
    </ProtectedRoute>
  )
}
