# DueX - Departmental Dues Management System

## Project Overview

DueX is a modern web application built with Next.js that transforms university departmental dues collection from manual spreadsheet-based processes to a digital, transparent, and efficient system. The platform serves three types of users: Students, Department Officials, and System Administrators.

## Architecture Overview

### Technology Stack
- **Frontend**: Next.js 14 with React
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **UI Components**: Radix UI with Tailwind CSS
- **Password Hashing**: bcryptjs
- **Notifications**: Sonner (toast notifications)

### Project Structure
```
duex/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   │   ├── admin/         # Admin-specific endpoints
│   │   ├── auth/          # Authentication endpoints
│   │   ├── official/      # Department official endpoints
│   │   └── student/       # Student endpoints
│   ├── dashboard/         # Dashboard pages for different roles
│   ├── login/            # Login page
│   ├── signup/           # Registration page
│   └── page.js           # Landing page
├── components/            # Reusable React components
│   ├── admin/            # Admin-specific components
│   ├── auth/             # Authentication components
│   ├── dashboards/       # Dashboard components
│   ├── layout/           # Layout components
│   ├── official/         # Official-specific components
│   └── ui/               # Base UI components (Radix UI)
├── lib/                  # Utility libraries
│   ├── auth.js           # Authentication utilities
│   ├── mongodb.js        # Database connection
│   └── utils.ts          # General utilities
├── models/               # MongoDB/Mongoose models
│   ├── User.js           # User model
│   ├── Payment.js        # Payment model
│   ├── Due.js            # Due model
│   └── BankDetails.js    # Bank details model
└── scripts/              # Database migration scripts
```

## Database Models

### User Model (`models/User.js`)
Represents all system users with role-based fields:
- **Common Fields**: firstName, lastName, email, password, role, isActive
- **Student Fields**: regNo (registration number), department
- **Official Fields**: position, department
- **Admin Fields**: createdBy, isFirstAdmin
- **Roles**: 'student', 'official', 'admin'

### Payment Model (`models/Payment.js`)
Tracks payment transactions:
- Links to User (studentId) and Due (dueId)
- Contains: session, amount, datePaid, status, reference, paymentMethod
- Status options: 'paid', 'pending', 'failed'
- Payment methods: 'bank_transfer', 'online', 'cash'
- Verification fields: verifiedBy, verifiedAt

### Due Model (`models/Due.js`)
Represents departmental dues/fees:
- Contains: session, description, amount, deadline, department
- Links to creator (createdBy)
- Active status tracking (isActive)

### BankDetails Model (`models/BankDetails.js`)
Stores department bank account information:
- One bank account per department
- Contains: department, bankName, accountNumber, accountName

## Authentication System

### JWT Implementation (`lib/auth.js`)
- **Token Generation**: 7-day expiry JWT tokens
- **Token Verification**: Validates and decodes JWT tokens
- **Middleware Functions**:
  - `requireAuth()`: Validates user authentication
  - `requireAdmin()`: Ensures admin role access

### Authentication Flow
1. User logs in via `/api/auth/login`
2. Server validates credentials and generates JWT
3. Client stores token in localStorage
4. Protected routes verify token via `requireAuth` middleware
5. Role-based access controlled through user.role checks

### Protected Routes (`components/auth/protected-route.js`)
- Client-side route protection
- Validates JWT tokens on page load
- Redirects unauthorized users to login
- Supports role-based access control

## API Endpoints

### Authentication Routes (`/api/auth/`)
- `POST /login` - User authentication
- `POST /signup` - User registration
- `GET /verify` - Token validation
- `GET /admin-exists` - Check if admin exists

### Student Routes (`/api/student/`)
- `GET /dashboard` - Student dashboard data
- `GET /profile` - Student profile information
- `PUT /profile` - Update student profile
- `GET /payments` - Student payment history
- `POST /payments` - Submit new payment

### Official Routes (`/api/official/`)
- `GET /dashboard` - Official dashboard data
- `GET /students` - Department students list
- `GET /payments/confirm` - Payments awaiting confirmation
- `PUT /payments/confirm` - Approve/reject payments
- `GET /settings` - Department bank details
- `POST /settings` - Update bank details

### Admin Routes (`/api/admin/`)
- `GET /dashboard` - System-wide statistics
- `GET /users` - All users management
- `POST /users` - Create new users
- `PUT /users/:id` - Update user information
- `DELETE /users/:id` - Deactivate users

## User Roles and Permissions

### Students
- View personal dashboard with due payments
- Submit payment proofs
- Update personal profile
- View payment history and status

### Department Officials
- Manage students in their department
- Create and manage departmental dues
- Confirm/reject student payments
- Set up department bank details
- Generate department reports

### System Administrators
- Full system access and control
- User management (create, update, deactivate)
- System-wide statistics and reports
- Department management
- First admin setup (bootstrap process)

## Key Features

### Dashboard System
- **Student Dashboard**: Shows active dues, payment status, department info
- **Official Dashboard**: Department statistics, pending confirmations, student management
- **Admin Dashboard**: System-wide metrics, user management, department overview

### Payment Processing
1. Officials create dues for their department
2. Students view active dues on their dashboard
3. Students submit payment proofs with reference numbers
4. Officials review and confirm/reject payments
5. System tracks payment status and generates reports

### Department Management
- Each department has one official
- Officials manage only their department's students
- Bank details stored per department
- Dues are department-specific

## Environment Configuration

### Required Environment Variables (`.env`)
```
MONGODB_URI=mongodb://connection-string
JWT_SECRET=your-jwt-secret-key
NEXTAUTH_SECRET=your-nextauth-secret
```

### Database Connection (`lib/mongodb.js`)
- Mongoose connection with caching
- Global connection reuse for serverless optimization
- Error handling and reconnection logic

## Security Features

### Password Security
- bcryptjs hashing with salt rounds (12)
- Pre-save middleware for automatic hashing
- Secure password comparison methods

### JWT Security
- 7-day token expiry
- Server-side token validation
- Automatic token refresh on valid requests

### Role-Based Access Control
- Middleware-level permission checks
- Route-level role validation
- Client-side route protection

### Data Validation
- Mongoose schema validation
- Required field enforcement
- Email uniqueness constraints
- Role-specific field requirements

## Frontend Architecture

### Component Structure
- **Layout Components**: Consistent UI structure across pages
- **Dashboard Components**: Role-specific dashboard interfaces
- **UI Components**: Reusable Radix UI components with Tailwind styling
- **Form Components**: Authentication and data entry forms

### State Management
- React hooks for local state
- localStorage for authentication persistence
- API calls for server state synchronization

### Routing
- Next.js App Router for file-based routing
- Protected routes with authentication checks
- Role-based page access control

## Development Workflow

### Getting Started
1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables in `.env`
4. Run development server: `npm run dev`
5. Access application at `http://localhost:3000`

### Database Setup
1. Create MongoDB database
2. Update `MONGODB_URI` in `.env`
3. Run migration scripts if needed: `npm run migrate`
4. Create first admin user through signup

### Deployment
- Build production version: `npm run build`
- Start production server: `npm start`
- Ensure environment variables are set in production

## Migration Scripts

### Department Migration (`scripts/migrate-departments.js`)
- Updates existing user records with department information
- Ensures data consistency across role changes

### Payment Migration (`scripts/migrate-payments.js`)
- Migrates payment data structure changes
- Maintains payment history integrity

## Error Handling

### API Error Responses
- Consistent error message format
- HTTP status code standards
- Detailed error logging for debugging

### Client Error Handling
- Toast notifications for user feedback
- Graceful fallbacks for failed requests
- Loading states and error boundaries

## Performance Optimizations

### Database
- Connection caching for serverless environments
- Indexed fields for faster queries
- Aggregation pipelines for complex data

### Frontend
- Component lazy loading
- Image optimization
- Minimal bundle size with tree shaking

## Future Enhancements

### Planned Features
- Email notifications for due payments
- Payment gateway integration
- Advanced reporting and analytics
- Mobile application
- Bulk payment processing

### Scalability Considerations
- Microservices architecture migration
- Caching layer implementation
- Database sharding for large datasets
- CDN integration for static assets

## Troubleshooting

### Common Issues
1. **Database Connection**: Verify MONGODB_URI format and network access
2. **Authentication Errors**: Check JWT_SECRET configuration
3. **Role Access Issues**: Verify user role assignments in database
4. **Payment Confirmation**: Ensure official and student are in same department

### Debug Mode
- Enable detailed logging in development
- Use browser developer tools for client-side debugging
- Check server logs for API endpoint issues

## Contributing

### Code Standards
- ESLint configuration for code quality
- Consistent naming conventions
- Component documentation
- API endpoint documentation

### Testing
- Unit tests for utility functions
- Integration tests for API endpoints
- End-to-end tests for user workflows

This documentation provides a comprehensive overview of the DueX system architecture, functionality, and development processes. For specific implementation details, refer to the individual component and API files in the codebase.