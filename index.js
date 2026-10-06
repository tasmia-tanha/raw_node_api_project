/*
Title:Raw Node API Project
*/

//app dependencies

import http from "http";

import handleReqRes from "./helpers/handlerReqRes.js";

//app object=module scaffolding
const app={};

//configuration
app.config={
    port:5000
};

//create server
app.createServer=()=>{
    const server=http.createServer(app.handleReqRes);
    server.listen(app.config.port,()=>{
        console.log(`listening to port ${app.config.port}`);
    });
};

//handle request response
app.handleReqRes=handleReqRes.handleReqRes;

app.createServer();