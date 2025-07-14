# OTP Implementation for KundliGen

This document describes the implementation of OTP (One-Time Password) verification system for user registration and password reset functionality.

## Overview

The system has been updated to use 4-digit OTP verification instead of email token verification. This provides a more secure and user-friendly authentication experience.

## Features

### 1. Registration OTP Verification
- **4-digit OTP**: Generated randomly between 1000-9999
- **30-minute expiry**: OTP expires after 30 minutes
- **Email delivery**: OTP is sent to user's email address
- **Resend functionality**: Users can request new OTP after 30 seconds
- **Auto-focus**: Input fields automatically focus to next field
- **Real-time validation**: Immediate feedback on OTP input

### 2. Password Reset OTP
- **4-digit OTP**: Same generation method as registration
- **30-minute expiry**: Consistent with registration OTP
- **Multi-step process**: Email → OTP → New Password
- **Resend functionality**: Available after 30 seconds
- **Secure password reset**: Requires OTP verification

## Backend Implementation

### Database Schema Updates

The User model has been updated with new OTP fields and legacy fields have been removed:

```javascript
// Registration OTP fields
registrationOtp: {
  type: String,
  default: null,
},
registrationOtpExpires: {
  type: Date,
  default: null,
},

// Password reset OTP fields
resetPasswordOtp: {
  type: String,
  default: null,
},
resetPasswordOtpExpires: {
  type: Date,
  default: null,
},
```

**Removed Legacy Fields:**
- `emailVerificationToken`
- `emailVerificationExpires`
- `resetPasswordToken`
- `resetPasswordExpires`
- `otp` (old generic field)
- `otpExpires` (old generic field)

### API Endpoints

#### Registration Flow
1. **POST** `/api/users/register` - Register user and send OTP
2. **POST** `/api/users/verify-registration-otp` - Verify registration OTP
3. **POST** `/api/users/resend-registration-otp` - Resend registration OTP

#### Password Reset Flow
1. **POST** `/api/users/forgot-password` - Send password reset OTP
2. **POST** `/api/users/verify-reset-otp` - Verify password reset OTP
3. **POST** `/api/users/reset-password` - Reset password with OTP
4. **POST** `/api/users/resend-reset-otp` - Resend password reset OTP

### OTP Generation

```javascript
const generateOTP = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};
```

### Email Templates

The system sends HTML emails with:
- Clear OTP display
- Expiry information
- Branding consistent with KundliGen

## Migration from Legacy System

### Database Migration

If you have existing users with legacy email verification token fields, run the migration script:

```bash
cd client/server
node migrate-otp.js
```

This script will:
- Find all users with legacy fields
- Remove the legacy fields from the database
- Verify the migration was successful
- Provide a detailed report

### Migration Script Features

- **Safe Migration**: Only removes legacy fields, preserves user data
- **Progress Tracking**: Shows real-time progress and results
- **Verification**: Confirms all legacy fields are removed
- **Error Handling**: Continues migration even if individual users fail

## Frontend Implementation

### Components

#### 1. OTPVerification.jsx
- **Purpose**: Handles OTP input and verification
- **Features**:
  - 4-digit input with auto-focus
  - 30-second countdown for resend
  - Real-time validation
  - Loading states
  - Error handling

#### 2. PasswordReset.jsx
- **Purpose**: Multi-step password reset flow
- **Steps**:
  1. Email input
  2. OTP verification
  3. New password input

#### 3. Updated LoginForm.jsx
- **Integration**: Seamlessly integrates OTP verification
- **Flow**: Registration → OTP verification → Login ready

### User Experience Features

1. **Auto-focus Navigation**: Users can tab through OTP fields
2. **Backspace Support**: Navigate backward with backspace
3. **Countdown Timer**: Visual feedback for resend availability
4. **Loading States**: Clear feedback during API calls
5. **Error Handling**: User-friendly error messages
6. **Success Feedback**: Confirmation messages

## Security Features

1. **OTP Expiry**: 30-minute automatic expiry
2. **Rate Limiting**: 30-second cooldown for resend
3. **Input Validation**: Server-side OTP validation
4. **Secure Storage**: OTPs stored with expiry timestamps
5. **Email Verification**: OTPs sent to verified email addresses

## Configuration

### Environment Variables

```env
# Email Configuration (Gmail)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password_here

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here

# Database
MONGODB_URI=mongodb://localhost:27017/kundligen

# Server
PORT=5000
```

### Email Setup

1. Use Gmail account
2. Enable 2-factor authentication
3. Generate App Password
4. Use App Password in EMAIL_PASS

## Usage Flow

### Registration
1. User fills registration form
2. System creates user account (unverified)
3. 4-digit OTP sent to email
4. User enters OTP in verification screen
5. Account verified and user can login

### Password Reset
1. User clicks "Forgot Password"
2. User enters email address
3. 4-digit OTP sent to email
4. User enters OTP
5. User sets new password
6. Password updated and user can login

## Error Handling

### Common Error Scenarios
1. **Invalid OTP**: Clear error message with retry option
2. **Expired OTP**: Automatic resend option
3. **Email not found**: User-friendly error message
4. **Network errors**: Retry mechanism with loading states

### User Feedback
- Success messages with auto-redirect
- Error messages with actionable steps
- Loading indicators for all async operations
- Countdown timers for resend functionality

## Testing

### Manual Testing Checklist
- [ ] Registration with valid email
- [ ] OTP delivery to email
- [ ] OTP verification success
- [ ] OTP expiry handling
- [ ] Resend OTP functionality
- [ ] Password reset flow
- [ ] Error handling for invalid OTP
- [ ] Network error handling

### API Testing
Use tools like Postman to test:
- Registration endpoint
- OTP verification endpoint
- Password reset endpoints
- Error scenarios

### Migration Testing
- [ ] Run migration script on test database
- [ ] Verify legacy fields are removed
- [ ] Test OTP functionality with migrated users
- [ ] Confirm no data loss during migration

## Future Enhancements

1. **SMS OTP**: Add SMS delivery option
2. **Voice OTP**: Accessibility feature
3. **OTP History**: Track OTP usage
4. **Advanced Rate Limiting**: IP-based rate limiting
5. **OTP Analytics**: Usage tracking and analytics

## Troubleshooting

### Common Issues

1. **OTP not received**
   - Check spam folder
   - Verify email configuration
   - Check server logs

2. **OTP expired**
   - Use resend functionality
   - Check server time settings

3. **Email sending failed**
   - Verify Gmail credentials
   - Check App Password setup
   - Review email quota

4. **Migration issues**
   - Check database connection
   - Verify user permissions
   - Review migration logs

### Debug Mode
Enable debug logging in development:
```javascript
console.log('OTP generated:', otp);
console.log('Email sent to:', email);
```

## Conclusion

The OTP implementation provides a secure, user-friendly authentication system that enhances the overall user experience while maintaining security standards. The 4-digit OTP with 30-minute expiry strikes a balance between security and usability. The migration from legacy token-based verification ensures a smooth transition for existing users. 