
require("dotenv").config()
const { default: axios } = require('axios');
const crypto = require('crypto');
const FormData = require('form-data');




// These parameters should be used for all requests
let SUMSUB_APP_TOKEN = process.env.DEV_SUMSUB_TOKEN
let SUMSUB_SECRET_KEY = process.env.DEV_SUMSUB_SECRET; 
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
function createAccessToken (externalUserId, levelName = 'basic-kyc-level', ttlInSecs = 600, env = "DEV") {
  console.log("Creating an access token for initializng SDK...");

  var method = 'post';
  var url = `/resources/accessTokens?userId=${externalUserId}&ttlInSecs=${ttlInSecs}&levelName=${levelName}`;
  let TOKEN = process.env.DEV_SUMSUB_TOKEN
  
  if( env === "PROD") {
    console.log("prod.....")
    TOKEN = process.env.PROD_SUMSUB_TOKEN
  }
  var headers = {
      'Accept': 'application/json',
      'X-App-Token': TOKEN
  };

  config.method = method;
  config.url = url;
  config.headers = headers;
  config.data = null;

  return config;
}

async function getAccessToken(id, env = "DEV") {
  const levelName = 'basic-kyc-level';
  console.log(env)
  if(env === "PROD") {
    console.log("setting secret key to prod...");
    SUMSUB_SECRET_KEY = process.env.PROD_SUMSUB_SECRET
  }
  return  await axios(createAccessToken(id, levelName, 1200, env))
    .then(function (response) {
      // console.log("Response:\n", response.data);
      return response;
    })
    .catch(function (error) {
      console.log("Error:\n", error);
    });
}

module.exports = getAccessToken