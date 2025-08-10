import ProtectedRoute from "@/components/auth/protected-route"
import OfficialStudents from "@/components/official/official-students"

export default function StudentsPage() {
  return (
    <ProtectedRoute requiredRole="official">
      <OfficialStudents />
    </ProtectedRoute>
  )
}