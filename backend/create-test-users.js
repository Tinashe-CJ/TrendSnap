const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/trendsnap', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Import the actual User model from the TypeScript file
const { User } = require('./src/models/User');

// Test users data
const testUsers = [
  {
    email: 'free@trendsnap.test',
    password: 'TestPass123!',
    name: 'Free Test User',
    tier: 'free',
    credits: 3,
    deviceFingerprint: 'free-test-device-001'
  },
  {
    email: 'pro@trendsnap.test',
    password: 'TestPass123!',
    name: 'Pro Test User',
    tier: 'pro',
    credits: 100,
    deviceFingerprint: 'pro-test-device-001'
  },
  {
    email: 'team@trendsnap.test',
    password: 'TestPass123!',
    name: 'Team Test User',
    tier: 'team',
    credits: 200,
    deviceFingerprint: 'team-test-device-001'
  },
  {
    email: 'enterprise@trendsnap.test',
    password: 'TestPass123!',
    name: 'Enterprise Test User',
    tier: 'enterprise',
    credits: 500,
    deviceFingerprint: 'enterprise-test-device-001'
  }
];

async function createTestUsers() {
  try {
    console.log('🚀 Starting to create test users...');
    
    // Clear existing test users
    await User.deleteMany({
      email: { $in: testUsers.map(user => user.email) }
    });
    console.log('✅ Cleared existing test users');
    
    // Create new test users
    for (const userData of testUsers) {
      // Create user without manual password hashing (User model will handle it)
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
      console.log(`Tier: ${user.tier}`);
    });
    
    console.log('\n=====================================');
    console.log('💡 You can now use these accounts to test different pricing tiers!');
    
  } catch (error) {
    console.error('❌ Error creating test users:', error);
  } finally {
    mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

// Run the script
createTestUsers(); 