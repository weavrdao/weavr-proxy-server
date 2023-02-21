const express = require("express");
const getAccessToken = require("./sumsub");
const simulateCurrentProposal = require("./simulation")
const axios = require("axios");
const multer = require("multer");

const cors = require("cors");
const serverless = require('serverless-http');


const app = express();
const router = express.Router();
const multerUpload = multer();

const ORIGIN = {
    test: 'https://test.weavr.org',
    prod: 'https://www.weavr.org',
    dev: 'http://localhost:8080'
};


console.log("Server running...");


// router.options("/*", cors(), function(req, res, next){
//     res.header('Access-Control-Allow-Origin', `${ORIGIN.dev}, ${ORIGIN.test}, ${ORIGIN.prod}`);
//     res.header('Access-Control-Allow-Headers', 'x-app-access-ts,x-app-access-sig ');
//     res.sendStatus(200);
// });

router.post("/simulate-proposal", multerUpload.none(), async (req, res) => {
    try {
        console.log("Simulation")
        const data = req.body
        const proposalId = data.proposalId
        const assetId = data.assetId
        const queueTimestamp = data.queueTimestamp
        const completeTimestamp = data.completeTimestamp
        const networkId = data.networkId
        console.log("proposalId: ", proposalId)
        console.log("assetId: ", assetId)
        console.log("queueTimestamp: ", queueTimestamp)
        console.log("completeTimestamp: ", completeTimestamp)
        console.log("networkId: ", networkId)
        const response = await simulateCurrentProposal(proposalId, assetId, networkId, queueTimestamp, completeTimestamp)
        console.log("completed simulation")
        res.status(200).json(response.data)
    }
    catch (error) {
        console.log(error)
        res.status(500).json({
            "error": error
        })
    }
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