# HD App - Full Stack Assignment

A modern Next.js application with OTP-based authentication, MongoDB integration, and note management features.

## Features

- ✅ **OTP-based Authentication**: Secure signup and signin using email OTP
- ✅ **MongoDB Integration**: Persistent data storage with Mongoose
- ✅ **Note Management**: Create, edit, and delete notes
- ✅ **Responsive Design**: Mobile-first design with Tailwind CSS
- ✅ **JWT Authentication**: Secure session management
- ✅ **Email Integration**: Nodemailer for OTP delivery

## Prerequisites

- Node.js 18+ 
- MongoDB (local or Atlas)
- Gmail account with App Password

## Quick Start

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd fullstack_assignment
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in your project root:
   ```env
   # Email Configuration for Nodemailer
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-app-password
   
   # JWT Secret
   JWT_SECRET=your-super-secret-jwt-key-here
   
   # MongoDB Connection
   MONGODB_URI=your-mongodb-connection-string
   
   # NextAuth (for compatibility)
   NEXTAUTH_SECRET=your-nextauth-secret
   NEXTAUTH_URL=http://localhost:3000
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Detailed Setup Instructions

### 1. Gmail App Password Setup

1. Go to your [Google Account settings](https://myaccount.google.com/)
2. Enable 2-factor authentication if not already enabled
3. Go to Security → App passwords
4. Generate an App Password for "Mail"
5. Use this App Password as `EMAIL_PASSWORD` (not your regular password)

### 2. MongoDB Setup

#### Option A: Local MongoDB
1. Install [MongoDB Community Edition](https://www.mongodb.com/try/download/community)
2. Start MongoDB service
3. Use connection string: `mongodb://localhost:27017/your_database_name`

#### Option B: MongoDB Atlas (Recommended for production)
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get your connection string
4. Replace `username`, `password`, and `your_database_name` in the connection string

### 3. Environment Variables Explained

```env
# Email Configuration
EMAIL_USER=your-email@gmail.com          # Your Gmail address
EMAIL_PASSWORD=your-app-password         # Gmail App Password (not regular password)

# Security
JWT_SECRET=your-super-secret-jwt-key    # Random string for JWT signing

# Database
MONGODB_URI=mongodb+srv://...           # MongoDB connection string

# NextAuth (legacy support)
NEXTAUTH_SECRET=random-string           # Random string for NextAuth
NEXTAUTH_URL=http://localhost:3000      # Your app URL
```

## Project Structure

```
src/
├── app/                    # Next.js 13+ app directory
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── notes/         # Notes CRUD operations
│   │   └── users/         # User management
│   ├── auth/              # Auth-related pages
│   ├── dashboard/         # Main dashboard
│   ├── signin/            # Signin pages
│   └── signup-otp/        # OTP signup
├── components/             # Reusable components
├── lib/                    # Utility libraries
│   ├── models/            # MongoDB models
│   ├── auth-hook.ts       # Authentication hook
│   ├── mongodb.ts         # Database connection
│   └── nodemailer.ts      # Email configuration
└── types/                  # TypeScript type definitions
```

## API Endpoints

### Authentication
- `POST /api/auth/send-otp` - Send OTP to email
- `POST /api/auth/verify-otp` - Verify OTP and authenticate

### Notes
- `GET /api/notes` - Fetch user's notes
- `POST /api/notes` - Create new note
- `PUT /api/notes/[id]` - Update note
- `DELETE /api/notes/[id]` - Delete note

### Users
- `GET /api/users` - Fetch user data

## How It Works

### Authentication Flow
1. **Signup**: User enters details → OTP sent → OTP verified → Account created
2. **Signin**: User enters email → OTP sent → OTP verified → JWT token generated
3. **Session**: JWT token stored in localStorage for persistent sessions

### Data Flow
1. OTPs are stored in MongoDB with 10-minute TTL
2. User data persists in MongoDB User collection
3. Notes are associated with authenticated users
4. JWT tokens provide secure API access

## Database Schema

### User Model
- `_id`: MongoDB ObjectId
- `name`: User's display name
- `email`: User's email address (unique)
- `image`: Profile picture URL
- `emailVerified`: Email verification timestamp
- `createdAt`: Account creation timestamp
- `updatedAt`: Last update timestamp

### OTP Model
- `email`: User's email address
- `otp`: 6-digit OTP code
- `expiresAt`: Expiration timestamp
- `createdAt`: Creation timestamp

### Note Model
- `_id`: MongoDB ObjectId
- `title`: Note title
- `content`: Note content
- `userId`: Associated user ID
- `createdAt`: Creation timestamp
- `updatedAt`: Last update timestamp

## Customization

### Email Template
Edit `src/lib/nodemailer.ts` to customize:
- Email subject and content
- HTML template styling
- Branding elements

### OTP Expiration
Modify OTP expiration time in:
- `src/app/api/auth/send-otp/route.ts` (line 58)
- `src/lib/models/OTP.ts` (TTL index)

### UI Styling
Customize the interface by modifying Tailwind classes in:
- `src/app/signup-otp/page.tsx`
- `src/app/signin-otp/page.tsx`
- `src/app/dashboard/page.tsx`

## Troubleshooting

### Common Issues

**Email Not Sending**
- Verify Gmail app password is correct
- Check if 2FA is enabled on Gmail account
- Ensure `EMAIL_USER` and `EMAIL_PASSWORD` are set correctly

**OTP Verification Fails**
- Check MongoDB connection
- Verify OTP hasn't expired (10 minutes)
- Check browser console for errors

**JWT Issues**
- Ensure `JWT_SECRET` is set
- Check token expiration (7 days default)

**MongoDB Connection Issues**
- Verify connection string format
- Check network access (for Atlas)
- Ensure MongoDB service is running (for local)

### Debug Mode
Enable debug logging by checking the browser console and server logs for detailed error information.

## Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Code Quality
- TypeScript for type safety
- ESLint for code linting
- Tailwind CSS for styling
- Responsive design principles

## Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically on push

### Other Platforms
- **Netlify**: Similar to Vercel, supports Next.js
- **Railway**: Good for full-stack apps with MongoDB
- **DigitalOcean**: Self-hosted option with App Platform

### Environment Variables
Remember to set all environment variables in your production environment:
- `EMAIL_USER`
- `EMAIL_PASSWORD`
- `JWT_SECRET`
- `MONGODB_URI`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

For issues and questions:
1. Check the troubleshooting section above
2. Review the code comments
3. Open an issue on GitHub
4. Check the browser console for error details

---

**Note**: This application uses OTP-based authentication as the primary method. All users authenticate via email OTP, and the system is designed for simplicity and security.
