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
  deviceFingerprint: { type: String, required: true },
  isVerified: { type: Boolean, default: true }
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

const testUsers = [
  {
    email: 'free@trendsnap.com',
    password: 'TestPass123!',
    name: 'Free Test User',
    tier: 'free',
    credits: 3,
    deviceFingerprint: 'free-test-device-001'
  },
  {
    email: 'pro@trendsnap.com',
    password: 'TestPass123!',
    name: 'Pro Test User',
    tier: 'pro',
    credits: 100,
    deviceFingerprint: 'pro-test-device-001'
  },
  {
    email: 'team@trendsnap.com',
    password: 'TestPass123!',
    name: 'Team Test User',
    tier: 'team',
    credits: 200,
    deviceFingerprint: 'team-test-device-001'
  },
  {
    email: 'enterprise@trendsnap.com',
    password: 'TestPass123!',
    name: 'Enterprise Test User',
    tier: 'enterprise',
    credits: 500,
    deviceFingerprint: 'enterprise-test-device-001'
  }
];

async function createTestUsers() {
  try {
    // Clear existing test users
    await User.deleteMany({ email: { $regex: /trendsnap\.com$/ } });
    console.log('✅ Cleared existing test users');

    // Create new test users
    for (const userData of testUsers) {
      const user = new User(userData);
      await user.save();
      console.log(`✅ Created ${userData.tier} user: ${userData.email}`);
    }

    console.log('\n🎉 All test users created successfully!');
    console.log('\n📋 Test User Credentials:');
    console.log('=====================================');
    
    testUsers.forEach(user => {
      console.log(`\n${user.tier.toUpperCase()} PLAN:`);
      console.log(`Email: ${user.email}`);
      console.log(`Password: ${user.password}`);
      console.log(`Credits: ${user.credits}`);
    });

  } catch (error) {
    console.error('❌ Error creating test users:', error);
  } finally {
    mongoose.disconnect();
  }
}

createTestUsers(); 