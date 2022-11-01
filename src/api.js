const express = require("express")
require("dotenv").config()
const getAccessToken = require("./sumsub")
const router = express.Router()
const serverless = require('serverless-http');

const app = express();

// const ORIGIN = {
//     dev: 'http://localhost:8080',
//     test: 'https://dynamic-sable-48c1d8.netlify.app',
//     prod: 'https://gov.weavr.org'
// }

// // app.use(router)
// console.log("Server running...")
// // if(process.env.SUMSUB_SECRET_KEY) {
// //     console.log("OKK");
// // }

// router.options("/*", function(req, res, next){
//     res.header('Access-Control-Allow-Origin', ORIGIN.dev);
//     res.header('Access-Control-Allow-Headers', 'x-app-access-ts,x-app-access-sig ');
//     res.sendStatus(200);
//   });


// router.get("/", (req, res)=> {
//     console.log("yes")
//     res.status(200).send("yess")
// })

// router.get("/:id", async (req, res) => {
//     console.log(req.params.id)
//     const id = req.params.id;
//     try {
//         const sumsub = await getAccessToken(req.params.id)
//         console.log("________ SUMSUB _________\n", sumsub)
//         res.send(sumsub.data)
//     } catch (error) {
//         console.log("__ERROR: ", error)
//     }
    
// })
// app.use("/.netlifly/functions/api", router)
// const server = app.listen(3000, () => {
//     console.log("Listening on port %s", server.address().port)
// })


router.get("/", (req, res) => {
    res.json({
        "hello": "hi"
    });
})
app.use("/.netifly/functions/api", router)
module.exports.handler = serverless(app)