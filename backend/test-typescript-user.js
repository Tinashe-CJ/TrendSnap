// Test script to verify TypeScript User model
const { execSync } = require('child_process');

console.log('🧪 Testing TypeScript User model...');

try {
  // Test if we can import the TypeScript User model
  const result = execSync('npx ts-node -e "import { User } from \'./src/models/User\'; console.log(\'✅ TypeScript User model imported successfully\');"', { 
    cwd: __dirname,
    encoding: 'utf8'
  });
  console.log(result);
} catch (error) {
  console.error('❌ Error importing TypeScript User model:', error.message);
}

console.log('\n🔍 Testing password comparison with TypeScript model...');

try {
  const testScript = `
import mongoose from 'mongoose';
import { User } from './src/models/User';
import dotenv from 'dotenv';

dotenv.config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/trendsnap');

async function testTypeScriptUser() {
  try {
    const user = await User.findOne({ email: 'pro@trendsnap.test' });
    
    if (!user) {
      console.log('❌ User not found');
      return;
    }
    
    console.log('✅ User found:', user.email);
    console.log('Testing password comparison...');
    
    const isValid = await user.comparePassword('TestPass123!');
    console.log('Password comparison result:', isValid);
    
    if (isValid) {
      console.log('✅ TypeScript User model password comparison works!');
    } else {
      console.log('❌ TypeScript User model password comparison failed!');
    }
    
  } catch (error: any) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
  }
}

testTypeScriptUser();
`;

  const result = execSync(`npx ts-node -e "${testScript}"`, { 
    cwd: __dirname,
    encoding: 'utf8'
  });
  console.log(result);
} catch (error) {
  console.error('❌ Error testing TypeScript User model:', error.message);
} 