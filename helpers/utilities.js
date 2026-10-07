import crypto from "crypto";
import envToExport from "./environment.js";
const utilities={};


utilities.parseJSON=(jsonString)=>{
    let output;
    try {
        output=JSON.parse(jsonString);
    } catch (error) {
        output={};
    }

    return output;
}

utilities.hash=(str)=>{
    if(typeof(str)==='string' && str.length>0){
        const hash=crypto.createHmac('sha256',envToExport.secretKey)
        .update(str)
        .digest('hex');

        return hash;
    }
    return false;
}

utilities.createRandomString=(strlen)=>{
    let len=strlen;
    len=typeof(len)==='number' && len>0?len:false;
    if(len){
        const allowedChars='abcdefghijklmnopqrstuvwxyz0123456789';
        let output='';
        for(let i=1;i<=len;i+=1){
            let c=allowedChars.charAt(Math.floor(Math.random()*allowedChars.length));
            output+=c;
        }
        return output;
    }
    else{
        return false;
    }
}






export default utilities;