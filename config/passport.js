var fs = require("fs"),
    passport = require("passport"),
    SamlStrategy = require("passport-saml").Strategy;
passport.serializeUser(function (user, done) {
    done(null, user);
});
passport.deserializeUser(function (user, done) {
    done(null, user);
});
passport.use('saml', () => {
    try {

        new SamlStrategy(
            {
                
                entryPoint: "https://3000-lucianovilela-sso-ivtucl3oznj.ws-us38.gitpod.io/adfs/ls/",
                issuer: "3000-lucianovilela-sso-ivtucl3oznj.ws-us38.gitpod.io",
                callbackUrl: "https://3000-lucianovilela-sso-ivtucl3oznj.ws-us38.gitpod.io/adfs/postResponse",
                // privateKey: fs.readFileSync("/path/to/acme_tools_com.key", "utf-8"),
                // cert: fs.readFileSync("/path/to/adfs.acme_tools.com.crt", "utf-8"),
                // other authn contexts are available e.g. windows single sign-on
                authnContext:
                    "http://schemas.microsoft.com/ws/2008/06/identity/authenticationmethod/password",
                // not sure if this is necessary?
                acceptedClockSkewMs: -1,
                identifierFormat: null,
                // this is configured under the Advanced tab in AD FS relying party
                signatureAlgorithm: "sha256",
                racComparison: "exact", // default to exact RequestedAuthnContext Comparison Type
            },
            function (profile, done) {
                return done(null, {
                    upn: profile["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/upn"],
                    // e.g. if you added a Group claim
                    group: profile["http://schemas.xmlsoap.org/claims/Group"],
                });
            }
        )

    } catch (error) {
        console.log(error)
    }
});


module.exports = passport;