import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const lib={};
const __filename=fileURLToPath(import.meta.url);
const __dirname=path.dirname(__filename);
lib.baseDir=path.join(__dirname,'/../.data/');

lib.create=function(dir,file,data,callback){
    fs.open(lib.baseDir+dir+'/'+file+'.json','wx',(err,fileDescriptor)=>{

        if(!err && fileDescriptor){
            //convert data to string
            const stringData=JSON.stringify(data);
            fs.writeFile(fileDescriptor,stringData,'utf-8',(err1)=>{
                if(!err1){
                    fs.close(fileDescriptor,(err3)=>{
                        if(!err3){
                            callback(false);
                        }
                        else{
                            callback('error closing the file');
                        }
                    })
                }
                else{
                    callback('error writing the file');
                }
            });
        }
        else{
            callback('Couldnt create a file.It may already exist');
        }
    });
}


lib.read=function(dir,file,callback){
    fs.readFile(lib.baseDir+dir+'/'+file+'.json','utf8',(err,data)=>{
        callback(err,data);
    });
}


lib.update=function(dir,file,data,callback){
    fs.open(lib.baseDir+dir+'/'+file+'.json','r+',(err,fileDescriptor)=>{
        if(!err && fileDescriptor){
            const stringData=JSON.stringify(data);
            fs.ftruncate(fileDescriptor,(err2)=>{
                if(!err2){
                    fs.writeFile(fileDescriptor,stringData,'utf-8',(err3)=>{
                        if(!err3){
                            fs.close(fileDescriptor,(err4)=>{
                                if(!err4){
                                    callback(false);
                                }
                                else{
                                    callback('wrror closing the file');
                                }
                            })
                        }else{
                            callback('error wriitjng the file');
                        }
                    })
                }
                else{
                    callback('error trucctaing the file');
                }
            })
        }
        else{
            callback('error opening the file');
        }
    })
}

lib.delete=function(dir,file,callback){
    fs.unlink(lib.baseDir+dir+'/'+file+'.json',(err)=>{
        if(!err){
            callback('deleted');
        }
        else{
            callback('error dleeting the file');
        }
    })
}
export default lib;