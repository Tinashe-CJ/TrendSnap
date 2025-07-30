import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
// import { Strategy as AppleStrategy } from 'passport-apple';
import { User } from '../models/User';
import { logger } from '../utils/logger';

// Serialize user for session
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, undefined);
  }
});

// Google OAuth Strategy
// Temporarily disabled due to missing environment variables
/*
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID || '',
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  callbackURL: '/api/auth/google/callback',
  scope: ['profile', 'email']
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Check if user already exists
    let user = await User.findOne({ 
      $or: [
        { email: profile.emails?.[0]?.value },
        { 'socialLogins.googleId': profile.id }
      ]
    });

    if (user) {
      // Update existing user with Google info if not already linked
      if (!user.socialLogins?.googleId) {
        user.socialLogins = user.socialLogins || {};
        user.socialLogins.googleId = profile.id;
        await user.save();
      }
      return done(null, user);
    }

    // Create new user
    user = new User({
      email: profile.emails?.[0]?.value,
      name: profile.displayName,
      password: `google_${profile.id}_${Date.now()}`, // Placeholder password
      deviceFingerprint: 'google_oauth',
      credits: 3,
      isVerified: true,
      socialLogins: {
        googleId: profile.id,
        googleEmail: profile.emails?.[0]?.value
      }
    });

    await user.save();
    logger.info(`New Google user registered: ${profile.emails?.[0]?.value}`);
    done(null, user);
  } catch (error) {
    logger.error('Google OAuth error:', error);
    done(error, undefined);
  }
}));

// Facebook OAuth Strategy
// Temporarily disabled due to missing environment variables
/*
passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_CLIENT_ID || '',
  clientSecret: process.env.FACEBOOK_CLIENT_SECRET || '',
  callbackURL: '/api/auth/facebook/callback',
  profileFields: ['id', 'emails', 'name']
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Check if user already exists
    let user = await User.findOne({ 
      $or: [
        { email: profile.emails?.[0]?.value },
        { 'socialLogins.facebookId': profile.id }
      ]
    });

    if (user) {
      // Update existing user with Facebook info if not already linked
      if (!user.socialLogins?.facebookId) {
        user.socialLogins = user.socialLogins || {};
        user.socialLogins.facebookId = profile.id;
        await user.save();
      }
      return done(null, user);
    }

    // Create new user
    user = new User({
      email: profile.emails?.[0]?.value,
      name: `${profile.name?.givenName} ${profile.name?.familyName}`.trim(),
      password: `facebook_${profile.id}_${Date.now()}`, // Placeholder password
      deviceFingerprint: 'facebook_oauth',
      credits: 3,
      isVerified: true,
      socialLogins: {
        facebookId: profile.id,
        facebookEmail: profile.emails?.[0]?.value
      }
    });

    await user.save();
    logger.info(`New Facebook user registered: ${profile.emails?.[0]?.value}`);
    done(null, user);
  } catch (error) {
    logger.error('Facebook OAuth error:', error);
    done(error, undefined);
  }
}));
*/

// Apple OAuth Strategy (requires additional setup)
// Temporarily disabled due to TypeScript issues
/*
if (process.env.APPLE_CLIENT_ID && process.env.APPLE_TEAM_ID && process.env.APPLE_KEY_ID) {
  passport.use(new AppleStrategy({
    clientID: process.env.APPLE_CLIENT_ID,
    teamID: process.env.APPLE_TEAM_ID,
    keyID: process.env.APPLE_KEY_ID,
    privateKeyLocation: process.env.APPLE_PRIVATE_KEY_PATH,
    callbackURL: '/api/auth/apple/callback',
    passReqToCallback: true
  }, async (req: any, accessToken: any, refreshToken: any, idToken: any, profile: any, done: any) => {
    try {
      // Apple provides minimal user info, we'll need to handle this carefully
      const appleUserId = profile.id;
      
      // Check if user already exists
      let user = await User.findOne({ 
        $or: [
          { email: profile.email },
          { 'socialLogins.appleId': appleUserId }
        ]
      });

      if (user) {
        // Update existing user with Apple info if not already linked
        if (!user.socialLogins?.appleId) {
          user.socialLogins = user.socialLogins || {};
          user.socialLogins.appleId = appleUserId;
          await user.save();
        }
        return done(null, user);
      }

      // Create new user (Apple provides limited info)
      user = new User({
        email: profile.email,
        name: profile.name?.firstName || 'Apple User',
        password: `apple_${appleUserId}_${Date.now()}`, // Placeholder password
        deviceFingerprint: 'apple_oauth',
        credits: 3,
        isVerified: true,
        socialLogins: {
          appleId: appleUserId,
          appleEmail: profile.email
        }
      });

      await user.save();
      logger.info(`New Apple user registered: ${profile.email}`);
      done(null, user);
    } catch (error) {
      logger.error('Apple OAuth error:', error);
      done(error, undefined);
    }
  }));
}
*/

export default passport; 