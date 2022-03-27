const express = require("express");
const msal = require('@azure/msal-node');

require("dotenv").config();
const app = express();
// Before running the sample, you will need to replace the values in the config,
// including the clientSecret
const config = {
    auth: {
        clientId: process.env.clientId,
        authority: process.env.authority,
        clientSecret: process.env.clientSecret
    },
    system: {
        loggerOptions: {
            loggerCallback(loglevel, message, containsPii) {
                console.log(message);
            },
            piiLoggingEnabled: false,
            logLevel: msal.LogLevel.Verbose,
        }
    }
};

// Create msal application object
const cca = new msal.ConfidentialClientApplication(config);

app.get('/', (req, res) => {
    const authCodeUrlParameters = {
        scopes: ["user.read"],
        redirectUri: "https://3000-lucianovilela-sso-ivtucl3oznj.ws-us38.gitpod.io/redirect",
    };

    // get url to sign user in and consent to scopes needed for application
    cca.getAuthCodeUrl(authCodeUrlParameters).then((response) => {
        res.redirect(response);
    }).catch((error) => console.log(JSON.stringify(error)));
});

app.get('/redirect', (req, res) => {
    const tokenRequest = {
        code: req.query.code,
        scopes: ["user.read"],
        redirectUri: "https://3000-lucianovilela-sso-ivtucl3oznj.ws-us38.gitpod.io/redirect",
    };

    cca.acquireTokenByCode(tokenRequest).then((response) => {
        console.log("\nResponse: \n:", response);
        res.sendStatus(200);
    }).catch((error) => {
        console.log(error);
        res.status(500).send(error);
    });
});
const SERVER_PORT = process.env.PORT || 3000;

// Create Express App and Routes

app.listen(SERVER_PORT, () => console.log(`Msal Node Auth Code Sample app listening on port ${SERVER_PORT}!`))