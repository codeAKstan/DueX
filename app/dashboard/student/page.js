import StudentDashboard from "@/components/dashboards/student-dashboard"
import ProtectedRoute from "@/components/auth/protected-route"

export default function StudentDashboardPage() {
  return (
    <ProtectedRoute requiredRole="student">
      <StudentDashboard />
    </ProtectedRoute>
  )
}
