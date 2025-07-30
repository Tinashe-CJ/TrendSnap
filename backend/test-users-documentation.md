# TrendSnap Test Users Documentation

This document contains the test user accounts for the TrendSnap application. These accounts are created for testing purposes and can be used to test different pricing tiers and features.

## Test User Accounts

### **FREE PLAN**
- **Email**: `free@trendsnap.com`
- **Password**: `TestPass123!`
- **Credits**: 3
- **Features**: Basic video generation, limited templates
- **Limitations**: 3 videos per month, basic templates only

### **PRO PLAN**
- **Email**: `pro@trendsnap.com`
- **Password**: `TestPass123!`
- **Credits**: 100
- **Features**: Advanced video generation, premium templates, analytics
- **Limitations**: 100 videos per month

### **TEAM PLAN**
- **Email**: `team@trendsnap.com`
- **Password**: `TestPass123!`
- **Credits**: 200
- **Features**: Team collaboration, shared templates, advanced analytics
- **Limitations**: 200 videos per month, up to 5 team members

### **ENTERPRISE PLAN**
- **Email**: `enterprise@trendsnap.com`
- **Password**: `TestPass123!`
- **Credits**: 500
- **Features**: Unlimited features, priority support, custom integrations
- **Limitations**: 500 videos per month, unlimited team members

## Usage Instructions

1. **Access the application**: Navigate to http://localhost:3000 (or the port where your frontend is running)
2. **Click "Sign In"**: Use any of the test credentials above
3. **Test different features**: Each tier has different capabilities and limitations
4. **Verify credit system**: Check that credits are properly deducted after video generation

## Database Information

- **Database**: MongoDB
- **Collection**: `users`
- **Connection**: `mongodb://localhost:27017/trendsnap`

## Security Notes

- These are test accounts only and should not be used in production
- All accounts use the same password for convenience during testing
- Passwords are properly hashed using bcrypt
- All accounts are pre-verified for testing purposes

## Troubleshooting

If login fails:
1. Ensure the backend server is running on port 3001
2. Check that MongoDB is running and accessible
3. Verify the test users exist in the database
4. Check the browser console for CORS errors

## Creation Script

Test users can be recreated using the `create-test-users-com.js` script in the backend directory:

```bash
cd backend
node create-test-users-com.js
``` 