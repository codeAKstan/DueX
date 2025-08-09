import ProtectedRoute from "@/components/auth/protected-route"
import DepartmentManagement from "@/components/admin/department-management"

export default function DepartmentsPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <DepartmentManagement />
    </ProtectedRoute>
  )
}