"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const superagent_1 = __importDefault(require("superagent"));
const bodyParser = require("body-parser");
const ViaTrip_1 = require("./logic/ViaTrip");
const config_js_1 = require("../Config/config.js");
const axios = require('axios');
const app = express();
const cors = require('cors');
let accessToken;
app.use(function (req, res, next) {
    // console.log('Time:', Date.now());
    // Check req obj for any needed headers
    const token = req.header('access_token');
    if (token && token.length > 1) {
        accessToken = token;
        res.setHeader('access_token', accessToken);
        next();
    }
    else {
        const authBody = {
            'client_id': '466c8f34-e2af-42bb-87c2-4802206168f7',
            'client_secret': 'islsiVY6tCzezyBOHkkiMEXK7Nq07mCyj3MurrvzdYU=',
            'Resource': '2cd2fb9a-18c2-4eb1-931b-8885c6151548',
            'grant_type': 'client_credentials'
        };
        const url = 'https://login.microsoftonline.com/2a3033c2-ad76-426c-9c5a-23233cde4cde/oauth2/token';
        superagent_1.default
            .post(url)
            .type("form")
            .send(authBody).then(authRes => {
            const body = authRes.body;
            accessToken = body.access_token;
            res.setHeader('access_token', accessToken);
            next();
        }).catch(err => {
            console.log(err);
        });
    }
});
app.use(cors());
app.use(bodyParser.json());
//  Routes ----------------------------------------------
app.post('/api/yelp', (req, res) => {
    superagent_1.default
        .get("https://api.yelp.com/v3/businesses/search")
        .set("Authorization", `bearer ${config_js_1.yelpApi}`)
        .query(paramReturn(req.body))
        .set("Authorization", `bearer ${config_js_1.yelpApi}`)
        .then(yelpRes => {
        res.send(JSON.parse(yelpRes.text));
    })
        .catch(error => console.log(error));
});
app.get('/test', (req, res) => {
    const source = { lat: '29.427839', lon: '-98.494636' };
    const destination = { lat: '29.424525', lon: '-98.487076' };
    const viaTrip = new ViaTrip_1.ViaTrip(source, destination, 'https://codegtfsapi.viainfo.net', accessToken);
    viaTrip.findCloseStops(3, viaTrip.sourceLocation).then(response => {
        res.send(response);
    }).catch(err => {
        res.send(err);
    });
});
app.get("/api/all-routes/", (req, res) => {
    superagent_1.default
        .get("https://codegtfsapi.viainfo.net/api/v1/routes")
        .set("Authorization", `bearer ${accessToken}`)
        .set("Accept", "application/json")
        .then(response => {
        console.log("response: here");
        res.send(JSON.parse(response.text)["result"]);
    }).catch(err => {
        console.log("error");
        res.send(err);
        console.log(err);
    });
});
app.post("/api/maps", (req, res) => {
    const currentLocation = `${req.body.currentLat},${req.body.currentLong}`;
    superagent_1.default
        .get(`https://maps.googleapis.com/maps/api/directions/json?origin=${currentLocation}&destination=${req.body.destination}&mode=transit&key=${apiKeys.googleApi}`)
        .then(googleRes => {
        const jsonResponse = JSON.parse(googleRes.text);
        // if transit routes are found
        if (jsonResponse["routes"].length !== 0) {
            res.send(JSON.parse(googleRes.text)["routes"][0]["legs"]);
        }
        else {
            res.send(JSON.parse(googleRes.text));
        }
    });
});
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    let err = new Error('Not Found');
    err['status'] = 404;
    next(err);
});
// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use((err, req, res) => {
        res.status(err['status'] || 500);
        res.send({
            message: err.message,
            error: err
        });
    });
}
// production error handler
// no stacktraces leaked to user
app.use((err, req, res) => {
    res.status(err.status || 500);
    res.send({
        message: err.message,
        error: {}
    });
});
//helper functions
const paramReturn = reqParamObject => {
    return {
        term: reqParamObject["term"] || null,
        latitude: reqParamObject["lat"] || "29.424122",
        longitude: reqParamObject["long"] || "-98.493629",
        radius: "8000",
        categories: reqParamObject["categories"] || null,
        price: reqParamObject["price"] || "1,2,3,4"
    };
};
const port = process.env.port || 8081;
app.listen(port, () => {
    console.log("Skynet is active on " + port);
});
//# sourceMappingURL=index.js.map