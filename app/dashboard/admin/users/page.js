import ProtectedRoute from '@/components/auth/protected-route'
import UserManagement from '@/components/admin/user-management'

export default function UsersPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <UserManagement />
    </ProtectedRoute>
  )
}