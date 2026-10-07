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






export default utilities;