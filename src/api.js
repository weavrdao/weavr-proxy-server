const express = require("express");
const getAccessToken = require("./sumsub");
const TenderlyInstance = require("./simulation")
const axios = require("axios");
const cors = require("cors");
const serverless = require('serverless-http');


const app = express();
const router = express.Router();

const ORIGIN = {
    dev: 'http://localhost:8080',
    test: 'https://test.weavr.org',
    prod: 'https://www.weavr.org'
};


console.log("Server running...");


router.options("/*", cors(), function(req, res, next){
    res.header('Access-Control-Allow-Origin', `${ORIGIN.dev}, ${ORIGIN.test}, ${ORIGIN.prod}`);
    res.header('Access-Control-Allow-Headers', 'x-app-access-ts,x-app-access-sig ');
    res.sendStatus(200);
});

router.post("/simulate-proposal", cors(), async (req, res) => {
    console.log("Simulation")
    const proposalId = req.params.proposalId
    const assetId = req.params.assetId
    const queueTimestamp = req.params.queueTimestamp
    const completeTimestamp = req.params.completeTimestamp
    const networkId = req.params.networkId
    const response = await TenderlyInstance.simulateCurrentProposal(proposalId, assetId, networkId, queueTimestamp, completeTimestamp)
    res.status(200).json(response)
})


router.get("/dev", cors(), (req, res)=> {
    console.log("DEV")
    res.status(200).json({
        "mode": "Development"
    })
});
router.get("/prod", cors(), (req, res)=> {
    console.log("PROD")
    res.status(200).json({
        "mode": "Production"
    })
});
router.get("/prod/:id", cors(), async (req, res) => {
    try {
        const sumsub = await getAccessToken(req.params.id, "PROD")
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