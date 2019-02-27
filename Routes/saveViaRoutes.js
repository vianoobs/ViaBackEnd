"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const routeServices_1 = __importDefault(require("../Services/routeServices"));
const mongoose = require('mongoose');
const Route = mongoose.model('routes');
const bodyParams = requestBody => {
    return {
        owner: requestBody.owner,
        name: requestBody.name,
        address: requestBody.address,
        imgURL: requestBody.imgURL
    };
};
const saveRoutes = app => {
    // save search history upon starting navigation
    app.post("/api/save-search", (req, res) => {
        routeServices_1.default.saveSearchedRoute(bodyParams(req.body));
        res.send("done");
    });
    // get search history
    app.post("/api/show-search", (req, res) => {
        console.log("this is the body");
        console.log(req.body);
        Route.find({ owner: req.body.owner }).then(dbResponse => {
            console.log(dbResponse);
            res.send(dbResponse);
        }).catch(error => {
            console.log(error);
        });
    });
};
exports.default = saveRoutes;
//# sourceMappingURL=saveViaRoutes.js.map