
//dependencies
import sampleHandler from "./handlers/routeHandlers/sampleHandler.js";
import userhandler from "./handlers/routeHandlers/userHandler.js";
import tokenHandler from "./handlers/routeHandlers/tokenHandler.js";
const routes={
    sample:sampleHandler.sampleHandler,
    user:userhandler.userHandler,
    token:tokenHandler.tokenHandler
};

export default routes;

