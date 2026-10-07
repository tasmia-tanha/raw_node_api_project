import lib from "../../lib/data.js";
import utilities from "../../helpers/utilities.js";

//module scafolding
const handler={};

handler.tokenHandler=(requestProperties,callback)=>{
    const acceptedMethods=['get','post','put','delete'];
    if(acceptedMethods.indexOf(requestProperties.method)>-1){
        handler._tokens[requestProperties.method](requestProperties,callback);
    }else{
        callback(405);
    }
   
};

handler._tokens={};

handler._tokens.post=(requestProperties,callback)=>{
    const phone=typeof(requestProperties.body.phone)==='string' && requestProperties.body.phone.trim().length===11?
    requestProperties.body.phone.trim():false;

    const password=typeof(requestProperties.body.password)==='string' && requestProperties.body.password.trim().length>0?
    requestProperties.body.password.trim():false;

    if(phone && password){
        lib.read("users",phone,(err,user)=>{
            if(!err && user){
                let hashedPassword=utilities.hash(password);
                if(hashedPassword===utilities.parseJSON(user).password){
                    let tokenId=utilities.createRandomString(20);
                    let expires=Date.now()+60*60*1000;

                    const tokenObject={
                        phone,
                        'id':tokenId,
                        expires

                    };

                    lib.create("tokens",tokenId,tokenObject,(err2)=>{
                        if(!err2){
                            callback(200,tokenObject);
                        }
                        else{
                            callback(500,{
                                'error':'server side issue'
                            })
                        }
                    })

                }
                else{
                    callback(400,{
                    'error':'password not valid'
                })
                }
            }
            else{
                callback(400,{
                    'error':'ther is a problem in your reuqest'
                })
            }
        })
    }
}
handler._tokens.get=(requestProperties,callback)=>{
   
    const id=typeof(requestProperties.queryString.id)==='string' && requestProperties.queryString.id.trim().length===20?
    requestProperties.queryString.id:false;

    if(id){
        lib.read("tokens",id,(err,token)=>{
            const tokenObj=utilities.parseJSON(token);
            if(!err && tokenObj){
                callback(200,tokenObj);
            }
            else{
                callback(404,{
                    'error':'id not found'
                })
            }
        })
    }else{
        callback(400,{
            'error':'there is a problm in your request'
        })
    }

    
}
handler._tokens.put=(requestProperties,callback)=>{
    const id=typeof(requestProperties.body.id)==='string' && requestProperties.body.id.trim().length===20?
    requestProperties.body.id:false;

    const extend=typeof(requestProperties.body.extend)==='boolean' && requestProperties.body.extend===true?true:false;

    if(id && extend){

        lib.read("tokens",id,(err,token)=>{
            if(!err && token){
                const tokenObj=utilities.parseJSON(token);

                if(tokenObj.expires>Date.now()){
                    tokenObj.expires=Date.now()+60*60*1000;

                    lib.update("tokens",id,tokenObj,(err2)=>{
                        if(!err2){
                            callback(200,tokenObj);
                        }
                        else{
                            callback(500,{
                                'error':'there is a server side issue'
                            })
                        }
                    })
                }
                else{
                    callback(400,{
                        'error':'token already expired'
                    })
                }
            }
            else{
                callback(404,{
                    'error':'id not found'
                })
            }
        })
    }
    else{
        callback(400,{
                    'error':'there is aproblem in your request'
                })
    }

}
handler._tokens.delete=(requestProperties,callback)=>{
   const id=typeof(requestProperties.queryString.id)==='string' && requestProperties.queryString.id.trim().length===20?
    requestProperties.queryString.id:false;

    if(id){
        lib.read("tokens",id,(err,token)=>{
            if(!err && token){
                lib.delete("tokens",id,(err2)=>{
                    if(!err2){
                        callback(200,{
                            'message':'successfully deleted'
                        })
                    }
                    else{
                        callback(500,{
                            'error':'server side error'
                        })
                    }
                })
            }
            else{
                callback(404,{
                    'error':'id not found'    
                })
            }
        })
    }
    else{
        callback(400,{
            'error':'there is a problem in your request'
        })
    }
}

handler._tokens.verify=(id,phone,callback)=>{
    lib.read("tokens",id,(err,token)=>{
        if(!err && token){
            if(utilities.parseJSON(token).phone===phone && utilities.parseJSON(token).expires>Date.now()){
                callback(true);
            }
            else{
                callback(false);
            }
        }
        else{
            callback(false);
        }
    })
}
export default handler;