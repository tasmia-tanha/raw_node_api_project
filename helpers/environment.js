

const environments={};

environments.staging={
    port:3000,
    envName:"staging",
    secretKey:"howdidwelosethisworld",
    maxChecks:5
};

environments.production={
    port:5000,
    envName:"production",
    secretKey:"howdidwelosethisworld",
     maxChecks:5
};

//determine which environment was passed
const currentEnvironment=typeof(process.env.NODE_env)==='string'?process.env.NODE_env:'staging';

//which one to export

const envToExport=typeof(environments[currentEnvironment])==='object'?environments[currentEnvironment]:environments.staging;


export default envToExport;