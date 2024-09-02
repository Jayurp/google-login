const express = require('express');
const passport = require('passport');
const session = require('express-session');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const app = express();

// Express Session Middleware
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
}));

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Passport Strategy Configuration
passport.use(new GoogleStrategy({
    clientID: '230860045922-1a146jorohnuoec8sti3vultnl0s3tgb.apps.googleusercontent.com',
    clientSecret: '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',
    callbackURL: '/auth/google/callback'
},
    function (accessToken, refreshToken, profile, done) {
        // Use the profile information (mainly profile.id) to check if the user is registered in your db
        // In this example, the profile is returned as the user object.
        return done(null, profile);
    }
));

// Serialize and deserialize user
passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

// Routes
app.get('/', (req, res) => {
    res.send('<a href="/auth/google">Authenticate with Google</a>');
});

// Authentication Route
app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Callback Route
app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        // Successful authentication
        res.redirect('/dashboard');
    }
);

// Protected Route
app.get('/dashboard', (req, res) => {
    if (req.isAuthenticated()) {
        // If user is logged in, show the dashboard
        res.send(`Hello ${req.user.displayName}`);
    } else {
        // If user is not logged in, redirect them to the homepage or login page
        res.redirect('/');
    }
});

// Logout Route
app.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
});

app.listen(3000, () => {
    console.log('Server started on http://localhost:3000');
});
