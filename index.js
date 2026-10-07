/*
Title:Raw Node API Project
*/

//app dependencies

import http from "http";

import handleReqRes from "./helpers/handlerReqRes.js";

import environment from "./helpers/environment.js";

import data from './lib/data.js';

//app object=module scaffolding
const app={};





//create server
app.createServer=()=>{
    const server=http.createServer(app.handleReqRes);
    server.listen(environment.port,()=>{
        console.log(`listening to port ${environment.port}`);
    });
};

//handle request response
app.handleReqRes=handleReqRes.handleReqRes;

app.createServer();