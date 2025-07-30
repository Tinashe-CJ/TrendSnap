const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function testSimpleLogin() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/trendsnap');
  try {
    console.log('🔍 Testing simple login...');
    
    const email = 'free@trendsnap.com';
    const password = 'TestPass123!';
    
    // Direct MongoDB query
    const user = await mongoose.connection.db.collection('users').findOne({ email });
    if (!user) {
      console.log('❌ User not found');
      return;
    }
    
    console.log('✅ User found:', user.email);
    console.log('Password hash:', user.password);
    
    // Direct bcrypt comparison
    const isValid = await bcrypt.compare(password, user.password);
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

testSimpleLogin(); 