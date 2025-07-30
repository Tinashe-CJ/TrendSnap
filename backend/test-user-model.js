const mongoose = require('mongoose');
require('dotenv').config();

// Import the actual User model from the compiled TypeScript
const { User } = require('./dist/models/User');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/trendsnap');

async function testUserModel() {
  try {
    console.log('🔍 Testing User model...');
    
    const user = await User.findOne({ email: 'free@trendsnap.com' });
    if (!user) {
      console.log('❌ User not found');
      return;
    }
    
    console.log('✅ User found:', user.email);
    console.log('Tier:', user.tier);
    console.log('Credits:', user.credits);
    
    // Test password comparison
    const isValid = await user.comparePassword('TestPass123!');
    console.log('Password valid:', isValid);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    mongoose.disconnect();
  }
}

testUserModel(); 