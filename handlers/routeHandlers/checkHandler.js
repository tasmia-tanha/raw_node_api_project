import lib from "../../lib/data.js";
import utilities from "../../helpers/utilities.js";
import tokenHandler from "../../handlers/routeHandlers/tokenHandler.js";
import environment from "../../helpers/environment.js";

//module scafolding
const handler = {};

handler.checkHandler = (requestProperties, callback) => {
  const acceptedMethods = ["get", "post", "put", "delete"];
  if (acceptedMethods.indexOf(requestProperties.method) > -1) {
    handler._checks[requestProperties.method](requestProperties, callback);
  } else {
    callback(405);
  }
};

handler._checks = {};

handler._checks.post = (requestProperties, callback) => {
  const protocol=typeof(requestProperties.body.protocol)==='string' && ['http','https'].indexOf(requestProperties.body.protocol)>-1?
  requestProperties.body.protocol:false;
  const url=typeof(requestProperties.body.url)==='string' && requestProperties.body.url.trim().length>0?
  requestProperties.body.url:false;
  const method=typeof(requestProperties.body.method)==='string' && ['GET','POST','PUT','DELETE'].indexOf(requestProperties.body.method)>-1?
  requestProperties.body.method:false;
  const successCodes=typeof(requestProperties.body.successCodes)==='object' && requestProperties.body.successCodes instanceof Array?
  requestProperties.body.successCodes:false;
  const timeoutSeconds=typeof(requestProperties.body.timeoutSeconds)==='number' && requestProperties.body.timeoutSeconds%1===0
  && requestProperties.body.timeoutSeconds>=1 && requestProperties.body.timeoutSeconds<=5?requestProperties.body.timeoutSeconds:false;
  
  if(protocol && url && method && successCodes && timeoutSeconds){
    const token=typeof(requestProperties.headerObjects.token)==='string' && requestProperties.headerObjects.token.trim().length===20?
    requestProperties.headerObjects.token:false;
    if(token){
        lib.read("tokens",token,(err,tokenID)=>{
            if(!err && tokenID){
                let tokenObj=utilities.parseJSON(tokenID);
                lib.read("users",tokenObj.phone,(err2,user)=>{
                    if(!err2 && user){
                        tokenHandler._tokens.verify(token,tokenObj.phone,(tokenISValid)=>{
                            if(tokenISValid){
                                let userObj=utilities.parseJSON(user);
                                const userChecks=typeof(userObj.checks)==='object' && userObj.checks instanceof Array?
                                userObj.checks:[];

                                if(userChecks.length<environment.maxChecks){
                                const checkID=utilities.createRandomString(20);
                                const checkObj={
                                    'id':checkID,
                                    'userPhone':tokenObj.phone,
                                    'protocol':protocol,
                                    'method':method,
                                     'url':url,
                                     'successCodes':successCodes,
                                     'timeoutSeconds':timeoutSeconds
                                }
                                lib.create("checks",checkID,checkObj,(err4)=>{
                                    if(!err4){
                                        userObj.checks=userChecks;
                                        userObj.checks.push(checkID);

                                        lib.update("users",userObj.phone,userObj,(err5)=>{
                                            if(!err5){
                                                callback(200,checkObj);
                                            }else{
                                                callback(500,{
                                                    'error':'couldnt update,problem in server side'
                                                })
                                            }
                                        })
                                    }else{
                                        callback(500,{
                                            'error':'failure in server side'
                                        })
                                    }
                                })
                                }
                                else{
                                    callback(400,{
                                        'error':'already has max checks'
                                    })
                                }
                                
                            }else{
                                callback(403,{
                                    'error':'authentication failure'
                                })
                            }
                        })
                    }else{
                        callback(401,{
                            'error':'user not found'
                        })
                    }
                })
            }
            else{
                callback(403,{
                    'error':'authentication failure1'
                })
            }
        })
    }else{
        callback(400,{
        'error':'bad request'
    })
    }
  }else{
    callback(400,{
        'error':'there is a problem in your request'
    })
  }
};
handler._checks.get = (requestProperties, callback) => {
    
    const checkID=typeof(requestProperties.queryString.id)==='string' && requestProperties.queryString.id.trim().length===20?
    requestProperties.queryString.id:false;
    if(checkID){
        const token=typeof(requestProperties.headerObjects.token)==='string' && requestProperties.headerObjects.token.trim().length===20?
        requestProperties.headerObjects.token:false;
        if(token){
            lib.read("tokens",token,(err,tokenID)=>{
                if(!err && tokenID){
                    tokenHandler._tokens.verify(token,utilities.parseJSON(tokenID).phone,(tokenISValid)=>{
                        if(tokenISValid){
                            lib.read("checks",checkID,(err2,check)=>{
                                if(!err2 && check){
                                    callback(200,utilities.parseJSON(check));
                                }else{
                                    callback(404,{
                                        'error':'check not found'
                                    })
                                }
                            })
                        }else{
                            callback(403,{
                                'error':'authentication failure'
                            })
                        }
                    })
                }else{
                    callback(500,{
                        'error':'server side error'
                    })
                }
            })
        }else{
            callback(400,{
                'error':'bad request2'
            })
        }
    }else{
        callback(400,{
            'error':'bad request'
        })
    }
};
handler._checks.put = (requestProperties, callback) => {
  const checkID=typeof(requestProperties.body.id)==='string' && requestProperties.body.id.trim().length===20?
  requestProperties.body.id:false;
  const protocol=typeof(requestProperties.body.protocol)==='string' && ['http','https'].indexOf(requestProperties.body.protocol)>-1?
  requestProperties.body.protocol:false;
  const url=typeof(requestProperties.body.url)==='string' && requestProperties.body.url.trim().length>0?
  requestProperties.body.url:false;
  const method=typeof(requestProperties.body.method)==='string' && ['GET','POST','PUT','DELETE'].indexOf(requestProperties.body.method)>-1?
  requestProperties.body.method:false;
  const successCodes=typeof(requestProperties.body.successCodes)==='object' && requestProperties.body.successCodes instanceof Array?
  requestProperties.body.successCodes:false;
  const timeoutSeconds=typeof(requestProperties.body.timeoutSeconds)==='number' && requestProperties.body.timeoutSeconds%1===0
  && requestProperties.body.timeoutSeconds>=1 && requestProperties.body.timeoutSeconds<=5?requestProperties.body.timeoutSeconds:false;
  
  if(checkID && (protocol || url || method || successCodes || timeoutSeconds)){
    lib.read("checks",checkID,(err,check)=>{
        if(!err && check){
            const checkObj=utilities.parseJSON(check);
            const token=typeof(requestProperties.headerObjects.token)==='string' && requestProperties.headerObjects.token.trim().length===20?
            requestProperties.headerObjects.token:false;
            tokenHandler._tokens.verify(token,checkObj.userPhone,(tokenISValid)=>{
                if(tokenISValid){
                    if(protocol)checkObj.protocol=protocol;
                    if(url)checkObj.url=url;
                    if(method)checkObj.method=method;
                    if(successCodes)checkObj.successCodes=successCodes;
                    if(timeoutSeconds)checkObj.timeoutSeconds=timeoutSeconds;

                    lib.update("checks",checkID,checkObj,(err2)=>{
                        if(!err){
                            callback(200,checkObj);
                        }else{
                            callback(500,{
                                'error':'server side error 2'
                            })
                        }
                    })
                }
                else{
                    callback(403,{
                        'error':'authenticatioon failure'
                    })
                }
            })
            
        }else{
            callback(404,{
                'error':'check not found'
            })
        }
    })
  }else{
    callback(400,{
        'error':'there is problem in your reuqest'
    })
  }
};
handler._checks.delete = (requestProperties, callback) => {
  
};
export default handler;