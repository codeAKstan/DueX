import AdminDashboard from "@/components/dashboards/admin-dashboard"
import ProtectedRoute from "@/components/auth/protected-route"

export default function AdminDashboardPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <AdminDashboard />
    </ProtectedRoute>
  )
}
