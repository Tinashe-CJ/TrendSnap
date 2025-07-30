const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/trendsnap');

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  name: String,
  tier: String,
  credits: Number,
  deviceFingerprint: String,
  isVerified: Boolean
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

async function testLogin() {
  try {
    const testEmail = 'free@trendsnap.com';
    const testPassword = 'TestPass123!';
    
    console.log(`Testing login for: ${testEmail}`);
    
    const user = await User.findOne({ email: testEmail });
    if (!user) {
      console.log('❌ User not found');
      return;
    }
    
    console.log('✅ User found:', user.email);
    console.log('Tier:', user.tier);
    console.log('Credits:', user.credits);
    
    const isValid = await user.comparePassword(testPassword);
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

testLogin(); 