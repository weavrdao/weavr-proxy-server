const express = require("express");
const getAccessToken = require("./sumsub");
const axios = require("axios");
const cors = require("cors");
const serverless = require('serverless-http');


const app = express();
const router = express.Router();

const ORIGIN = {
    dev: 'http://localhost:8080',
    test: 'https://dynamic-sable-48c1d8.netlify.app',
    prod: 'https://gov.weavr.org'
};


console.log("Server running...");


router.options("/dev/*", cors(), function(req, res, next){
    res.header('Access-Control-Allow-Origin', `${ORIGIN.dev}, ${ORIGIN.test}`);
    res.header('Access-Control-Allow-Headers', 'x-app-access-ts,x-app-access-sig ');
    res.sendStatus(200);
});
router.options("/prod/*", cors(), function(req, res, next){
    res.header('Access-Control-Allow-Origin', ORIGIN.prod);
    res.header('Access-Control-Allow-Headers', 'x-app-access-ts,x-app-access-sig ');
    res.sendStatus(200);
});

router.get("/dev", cors(), (req, res)=> {
    console.log("yes")
    res.status(200).json({
        "id": "NULL"
    })
});
router.get("/prod", cors(), (req, res)=> {
    console.log("yes")
    res.status(200).json({
        "id": "NULL"
    })
});
router.get("/prod/:id", cors(), async (req, res) => {
    try {
        const sumsub = await getAccessToken("PROD", req.params.id)
        res.send(sumsub.data)
    } catch (error) {
        console.log("__ERROR: ", error)
    } 
});
router.get("/dev/:id", cors(), async (req, res) => {
    try {
        const sumsub = await getAccessToken(req.params.id)
        res.send(sumsub.data)
    } catch (error) {
        console.log("__ERROR: ", error)
    } 
});


app.use(`/.netlify/functions/api`, router);

module.exports = app;
module.exports.axios = axios;
module.exports.handler = serverless(app);