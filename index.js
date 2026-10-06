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

//pore muche dibo
//data.update('test','newfile',{'name':'england','language':'english'},(err)=>{
//    console.log('error was'+err);
//})
data.delete('test','newfile',(err)=>{
    console.log(err);
});
//data.read('test','newfile',(err,data)=>{
//    console.log(err,data);
//})
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