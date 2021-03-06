import routeServices from '../Services/routeServices';
const mongoose = require('mongoose');
const Route = mongoose.model('routes');


const bodyParams = requestBody => {
    return {
        owner: requestBody.owner,
        name: requestBody.name,
        address: requestBody.address
    }
};

const saveRoutes = app => {
    // save search history upon starting navigation
    app.post("/api/save-search", (req, res) => {
        routeServices.saveSearchedRoute(bodyParams(req.body));
        res.send("done")
    });

    // get search history
    app.get("/api/show-search", (req, res) => {
        console.log(req.body.owner);
        Route.find({owner: req.body.owner}).then(dbResponse => {
            res.send(dbResponse);
        }).catch(error => {
            console.log(error)
        })
    });
};

export default saveRoutes;