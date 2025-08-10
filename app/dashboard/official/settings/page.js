import ProtectedRoute from "@/components/auth/protected-route"
import OfficialSettings from "@/components/official/official-settings"

export default function SettingsPage() {
  return (
    <ProtectedRoute requiredRole="official">
      <OfficialSettings />
    </ProtectedRoute>
  )
}