import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import dotenv from 'dotenv';
dotenv.config();
import User from '../src/infrastructure/mongo/model/User.js';
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
},
    async (accessToken, refreshToken, profile, done) => {
        try {
            console.log("Google profile:", profile);
            const existUser = await User.findOne({ email: profile.emails[0].value });
            if (existUser) {
                return done(null, existUser);
            }
            const user = {
                firstName: profile.name.givenName || 'Google',
                lastName: profile.name.familyName || 'User',
                email: profile.emails[0].value,
                password: 'google_oauth_user',
                avatar: profile.photos?.[0]?.value || profile._json?.picture,
                phone: `google_${Date.now()}`,
                gender: null,
                dateOfBirth: null,
                status: 'ACTIVE',
                twoFactorAuthenticationSecret: null,
                isTwoFactorAuthenticationEnabled: false,
                updatedAt: new Date(),
                createdAt: new Date(),
                isVerifiedMail: true,
                isEmailNotificationEnabled: true,
                channels: [],
                emailSentAt: new Date(),
            }
            const newUser = await User.create(user);
            console.log("New user created:", newUser);
            return done(null, newUser);
        } catch (err) {
            console.error("Error in Google Strategy:", err);
            return done(err, null);
        }
    })
);

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

export default passport;