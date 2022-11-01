const axios = require('axios');
const crypto = require('crypto');
const fs = require('fs');
const FormData = require('form-data');

// These parameters should be used for all requests
const SUMSUB_APP_TOKEN = process.env.SUMSUB_APP_TOKEN
const SUMSUB_SECRET_KEY = process.env.SUMSUB_SECRET_KEY; // Example: Hej2ch71kG2kTd1iIUDZFNsO5C1lh5Gq - Please don't forget to change when switching to production
const SUMSUB_BASE_URL = 'https://api.sumsub.com'; 

var config = {};
config.baseURL= SUMSUB_BASE_URL;

axios.interceptors.request.use(createSignature, function (error) {
  return Promise.reject(error);
})

// This function creates signature for the request as described here: https://developers.sumsub.com/api-reference/#app-tokens

function createSignature(config) {
  console.log('Creating a signature for the request...');

  var ts = Math.floor(Date.now() / 1000);
  const signature = crypto.createHmac('sha256',  SUMSUB_SECRET_KEY);
  signature.update(ts + config.method.toUpperCase() + config.url);

  if (config.data instanceof FormData) {
    signature.update(config.data.getBuffer());
  } else if (config.data) {
    signature.update(config.data);
  }

  config.headers['X-App-Access-Ts'] = ts;
  config.headers['X-App-Access-Sig'] = signature.digest('hex');
  // config.headers['Access-Control-Allow-Origin'] = '*'
  // config.headers['Access-Control-Allow-Headers'] = "Content-Type, Authorization, X-Requested-With";
  // config.headers['Access-Control-Allow-Methods'] = "DELETE, POST, GET, OPTIONS"
  return config;
}



// https://developers.sumsub.com/api-reference/#access-tokens-for-sdks
function createAccessToken (externalUserId, levelName = 'basic-kyc-level', ttlInSecs = 600) {
  console.log("Creating an access token for initializng SDK...");

  var method = 'post';
  var url = `/resources/accessTokens?userId=${externalUserId}&ttlInSecs=${ttlInSecs}&levelName=${levelName}`;

  var headers = {
      'Accept': 'application/json',
      'X-App-Token': SUMSUB_APP_TOKEN
  };

  config.method = method;
  config.url = url;
  config.headers = headers;
  config.data = null;

  return config;
}

// This section contains requests to server using configuration functions
// The description of the flow can be found here: https://developers.sumsub.com/api-flow/#api-integration-phases

        // Such actions are presented below:
        // 1) Creating an applicant
        // 2) Adding a document to the applicant
        // 3) Getting applicant status
        // 4) Getting access tokens for SDKs

async function getAccessToken(id) {

    axios.interceptors.request.use(createSignature, function (error) {
        return Promise.reject(error);
      })

  const externalUserId = "random-JSToken-" + Math.random().toString(36).substr(2, 9);
  const levelName = 'basic-kyc-level';
  console.log("External UserID: ", externalUserId); 



return  await axios(createAccessToken(id, levelName, 1200))
  .then(function (response) {
    // console.log("Response:\n", response.data);
    return response;
  })
  .catch(function (error) {
    console.log("Error:\n", error);
  });
}

// async function main() {
//     await getAccessToken("idsxsasa")
// }

// main()

module.exports = getAccessToken