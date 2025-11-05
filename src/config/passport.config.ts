import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { 
  GOOGLE_CLIENT_ID, 
  GOOGLE_CLIENT_SECRET, 
  SERVER_URL 
} from './env.config';
import { User } from '../models/user.model';
import { ROLES } from '../constants/roles.constants';

passport.use(new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: `${SERVER_URL}/api/auth/google/callback`,
},
async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails?.[0].value;
    if (!email) {
      return done(new Error('No email found from Google profile.'), undefined);
    }

    // 1. Find user by Google ID
    let user = await User.findOne({ googleId: profile.id });
    if (user) return done(null, user); // User found, log them in

    // 2. Find by email to link accounts
    user = await User.findOne({ email });
    if (user) {
      user.googleId = profile.id; // Link Google ID
      await user.save();
      return done(null, user);
    }

    // 3. Create new user
    const newUser = new User({
      email: email,
      googleId: profile.id,
      roles: [ROLES.User],
    });
    await newUser.save();
    return done(null, newUser);

  } catch (error) {
    return done(error, undefined);
  }
}));