import ProtectedRoute from "@/components/auth/protected-route"
import OfficialPayments from "@/components/official/official-payments"

export default function PaymentsPage() {
  return (
    <ProtectedRoute requiredRole="official">
      <OfficialPayments />
    </ProtectedRoute>
  )
}