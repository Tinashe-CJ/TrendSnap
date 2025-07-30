const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/trendsnap', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define User schema for debugging
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email']
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
  }
}, {
  timestamps: true
});

// Add password comparison method
userSchema.methods.comparePassword = async function(candidatePassword) {
  console.log('Comparing passwords:');
  console.log('Candidate password:', candidatePassword);
  console.log('Stored password hash:', this.password);
  const result = await bcrypt.compare(candidatePassword, this.password);
  console.log('Password comparison result:', result);
  return result;
};

const User = mongoose.model('User', userSchema);

async function debugLogin() {
  try {
    console.log('🔍 Debugging login process...');
    
    const testEmail = 'pro@trendsnap.test';
    const testPassword = 'TestPass123!';
    
    console.log(`\n1. Looking for user with email: ${testEmail}`);
    
    // Find user
    const user = await User.findOne({ email: testEmail });
    
    if (!user) {
      console.log('❌ User not found!');
      return;
    }
    
    console.log('✅ User found:');
    console.log('  - ID:', user._id);
    console.log('  - Email:', user.email);
    console.log('  - Name:', user.name);
    console.log('  - Tier:', user.tier);
    console.log('  - Credits:', user.credits);
    console.log('  - Password hash:', user.password);
    
    console.log(`\n2. Testing password comparison...`);
    
    // Test password comparison
    const isPasswordValid = await user.comparePassword(testPassword);
    
    console.log(`\n3. Password validation result: ${isPasswordValid}`);
    
    if (isPasswordValid) {
      console.log('✅ Login should work!');
    } else {
      console.log('❌ Password validation failed!');
      
      // Let's also test with a fresh hash
      console.log('\n4. Testing with fresh password hash...');
      const freshHash = await bcrypt.hash(testPassword, 12);
      console.log('Fresh hash:', freshHash);
      
      const freshComparison = await bcrypt.compare(testPassword, freshHash);
      console.log('Fresh comparison result:', freshComparison);
    }
    
  } catch (error) {
    console.error('❌ Error during debug:', error);
  } finally {
    mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
  }
}

// Run the debug script
debugLogin(); 