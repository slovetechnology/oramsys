import API_LOCAL from './api-local';
import API_PROD from './api-prod';
const hostname = window.location.hostname;
const port = window.location.port;
let isLocalApi =  +port >= 5000;


export const API = API_PROD
// export const API = hostname === 'localhost' ? API_LOCAL : API_PROD
// console.log("API", API, hostname, isLocalApi);
// export const API = API_LOCAL