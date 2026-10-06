
//dependencies
import url from 'url';
import { StringDecoder } from "string_decoder";
import routes from '../route.js';
import notFoundHandler from '../handlers/routeHandlers/notFoundHandler.js';

//module scafolding
const handler={};

handler.handleReqRes=(req,res)=>{
    //response handle
    //get the url and parse
    const parsedUrl=url.parse(req.url,true);
    const path=parsedUrl.pathname;
    const trimmedPath=path.replace(/^\/+|\/+$/g,'');
    const method=req.method.toLowerCase();
    const queryString=parsedUrl.query;
    const headerObjects=req.headers;
    let decoder=new StringDecoder('utf-8');
    let realData='';
    const requestProperties={
        parsedUrl,
        path,
        trimmedPath,
        method,
        queryString,
        headerObjects

    };
    const chosenHandler=routes[trimmedPath]?routes[trimmedPath]:notFoundHandler.notFoundHandler;
    chosenHandler(requestProperties,(statusCode,payload)=>{
        statusCode=typeof(statusCode)==='number'?statusCode:500;
        payload=typeof(payload)==='object'?payload:{};
        const payloadString=JSON.stringify(payload);
        res.writeHead(statusCode);
        res.end(payloadString);
    })

    req.on('data',(buffer)=>{
        realData+=decoder.write(buffer);
    })

    req.on('end',()=>{
        realData+=decoder.end();
        console.log(realData);
       
    })
    
    
}

export default handler;





