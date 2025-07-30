const mongoose = require('mongoose');
require('dotenv').config();

// Import the User model the same way as the auth route
const { User } = require('./dist/models/User');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/trendsnap');

async function testAuthImport() {
  try {
    console.log('🔍 Testing User import from auth route...');
    
    // Test the exact same query as the auth route
    const user = await User.findOne({ email: 'free@trendsnap.com' });
    if (!user) {
      console.log('❌ User not found with User.findOne()');
      return;
    }
    
    console.log('✅ User found with User.findOne():', user.email);
    console.log('Tier:', user.tier);
    console.log('Credits:', user.credits);
    console.log('Device Fingerprint:', user.deviceFingerprint);
    
    // Test password comparison
    const isValid = await user.comparePassword('TestPass123!');
    console.log('Password valid:', isValid);
    
    if (isValid) {
      console.log('✅ Login should work!');
    } else {
      console.log('❌ Login will fail');
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    mongoose.disconnect();
  }
}

testAuthImport(); 