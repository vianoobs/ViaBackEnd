import superagent from "superagent";

import bodyParser = require("body-parser");
import express = require('express');

let accessToken;

interface IAuthReq {
    client_id: string;
    client_secret: string;
    Resource: string;
    grant_type: string;
}

interface IAuthRes {
    token_type: string;
    expires_in: string;
    ext_expires_in: string;
    expires_on: string;
    not_before: string;
    resource: string;
    access_token: string;
}

const utilRoutes = app => {
    app.use(function (req: express.Request, res: express.Response, next) {
        // console.log('Time:', Date.now());
        // Check req obj for any needed headers
        const token = req.header('access_token');
        if (token && token.length > 1) {
            accessToken = token;
            res.setHeader('access_token', accessToken);
            next();
        } else {
            const authBody: IAuthReq = {
                'client_id': '466c8f34-e2af-42bb-87c2-4802206168f7',
                'client_secret': 'islsiVY6tCzezyBOHkkiMEXK7Nq07mCyj3MurrvzdYU=',
                'Resource': '2cd2fb9a-18c2-4eb1-931b-8885c6151548',
                'grant_type': 'client_credentials'
            };
            const url = 'https://login.microsoftonline.com/2a3033c2-ad76-426c-9c5a-23233cde4cde/oauth2/token';

            superagent
                .post(url)
                .type("form")
                .send(authBody).then(authRes => {
                const body = authRes.body as IAuthRes;
                accessToken = body.access_token;
                res.setHeader('access_token', accessToken);
                next();
            }).catch(err => {
                console.log(err);
            });
        }

    });



    app.use(bodyParser.json());

// catch 404 and forward to error handler
    app.use(function (req: express.Request, res: express.Response, next) {
        let err = new Error('Not Found');
        err['status'] = 404;
        next(err);
    });
    if (process.env.NODE_ENV === "production"){
        // express will serve production assets ( main.js, main.css )
        // look inside client/build to serve assets
        app.use(express.static('client/build'));

        // express will serve index.html if it doesnt recognize route
        const path = require('path');
        app.get("*", (req, res) => {
            res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
        })
    }
};

export default utilRoutes;