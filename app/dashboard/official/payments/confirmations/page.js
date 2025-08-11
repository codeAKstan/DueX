import ProtectedRoute from "@/components/auth/protected-route"
import PaymentConfirmations from "@/components/official/payment-confirmations"

export default function PaymentConfirmationsPage() {
  return (
    <ProtectedRoute requiredRole="official">
      <PaymentConfirmations />
    </ProtectedRoute>
  )
}