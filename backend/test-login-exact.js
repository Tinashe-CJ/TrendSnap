const mongoose = require('mongoose');
require('dotenv').config();

// Import the User model the same way as the auth route
const { User } = require('./dist/models/User');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/trendsnap');

async function testLoginExact() {
  try {
    console.log('🔍 Testing exact login logic...');
    
    const email = 'free@trendsnap.com';
    const password = 'TestPass123!';
    
    console.log('Email:', email);
    console.log('Password:', password);
    
    // Step 1: Find user (exact same as login route)
    const user = await User.findOne({ email });
    if (!user) {
      console.log('❌ User not found');
      return;
    }
    
    console.log('✅ User found:', user.email);
    console.log('Tier:', user.tier);
    console.log('Credits:', user.credits);
    
    // Step 2: Check password (exact same as login route)
    const isPasswordValid = await user.comparePassword(password);
    console.log('🔐 Password validation result:', isPasswordValid);
    
    if (!isPasswordValid) {
      console.log('❌ Password invalid');
      return;
    }
    
    console.log('✅ Login successful!');
    
    // Step 3: Update last login (exact same as login route)
    user.lastLogin = new Date();
    await user.save();
    console.log('✅ Last login updated');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    mongoose.disconnect();
  }
}

testLoginExact(); 