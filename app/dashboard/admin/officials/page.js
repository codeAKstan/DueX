import ProtectedRoute from "@/components/auth/protected-route"
import OfficialManagement from "@/components/admin/official-management"

export default function OfficialsPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <OfficialManagement />
    </ProtectedRoute>
  )
}