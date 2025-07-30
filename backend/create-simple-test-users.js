const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/trendsnap', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Simple User schema without email validation
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: [8, 'Password must be at least 8 characters long']
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  tier: {
    type: String,
    enum: ['free', 'pro', 'team', 'enterprise'],
    default: 'free'
  },
  credits: {
    type: Number,
    default: 3,
    min: [0, 'Credits cannot be negative']
  },
  deviceFingerprint: {
    type: String,
    required: true,
    index: true
  },
  isVerified: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  },
  socialLogins: {
    googleId: String,
    googleEmail: String,
    facebookId: String,
    facebookEmail: String,
    appleId: String,
    appleEmail: String
  }
}, {
  timestamps: true
});

// Add password hashing middleware
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

// Add password comparison method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Add JSON serialization
userSchema.set('toJSON', {
  transform: function(doc, ret) {
    ret.password = undefined;
    return ret;
  }
});

const User = mongoose.model('User', userSchema);

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
    console.log('🚀 Creating simple test users...');
    
    // Clear existing test users
    await User.deleteMany({
      email: { $in: testUsers.map(user => user.email) }
    });
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