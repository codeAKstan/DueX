import ProtectedRoute from "@/components/auth/protected-route"
import AdminSettings from "@/components/admin/admin-settings"

export default function SettingsPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <AdminSettings />
    </ProtectedRoute>
  )
}