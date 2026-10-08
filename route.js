
//dependencies
import sampleHandler from "./handlers/routeHandlers/sampleHandler.js";
import userhandler from "./handlers/routeHandlers/userHandler.js";
import tokenHandler from "./handlers/routeHandlers/tokenHandler.js";
import checkHandler from "./handlers/routeHandlers/checkHandler.js";
const routes={
    sample:sampleHandler.sampleHandler,
    user:userhandler.userHandler,
    token:tokenHandler.tokenHandler,
    check:checkHandler.checkHandler
};

export default routes;

