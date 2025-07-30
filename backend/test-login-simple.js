const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/trendsnap');

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  name: String,
  tier: { type: String, default: 'free' },
  credits: { type: Number, default: 3 },
  isVerified: { type: Boolean, default: false }
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

async function testLogin() {
  try {
    const user = await User.findOne({ email: 'free@trendsnap.test' });
    if (!user) {
      console.log('❌ User not found');
      return;
    }
    console.log('✅ User found:', user.email);
    console.log('Password hash:', user.password);
    
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

testLogin(); 