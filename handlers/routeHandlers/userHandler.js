import lib from "../../lib/data.js";
import utilities from "../../helpers/utilities.js";
import tokenHandler from "../../handlers/routeHandlers/tokenHandler.js";

//module scafolding
const handler = {};

handler.userHandler = (requestProperties, callback) => {
  const acceptedMethods = ["get", "post", "put", "delete"];
  if (acceptedMethods.indexOf(requestProperties.method) > -1) {
    handler._users[requestProperties.method](requestProperties, callback);
  } else {
    callback(405);
  }
};

handler._users = {};

handler._users.post = (requestProperties, callback) => {
  const firstName =
    typeof requestProperties.body.firstName === "string" &&
    requestProperties.body.firstName.trim().length > 0
      ? requestProperties.body.firstName.trim()
      : false;

  const lastName =
    typeof requestProperties.body.lastName === "string" &&
    requestProperties.body.lastName.trim().length > 0
      ? requestProperties.body.lastName.trim()
      : false;

  const phone =
    typeof requestProperties.body.phone === "string" &&
    requestProperties.body.phone.trim().length === 11
      ? requestProperties.body.phone.trim()
      : false;

  const password =
    typeof requestProperties.body.password === "string" &&
    requestProperties.body.password.trim().length > 0
      ? requestProperties.body.password.trim()
      : false;

  const tosAgreement =
    typeof requestProperties.body.tosAgreement === "boolean"
      ? requestProperties.body.tosAgreement
      : false;

  if (firstName && lastName && phone && password && tosAgreement) {
    lib.read("users", phone, (err, user) => {
      if (err) {
        let userObject = {
          firstName,
          lastName,
          phone,
          password: utilities.hash(password),
          tosAgreement,
        };

        lib.create("users", phone, userObject, (err2) => {
          if (!err2) {
            callback(200, {
              message: "user created successfully",
            });
          } else {
            callback(500, {
              error: "there is a problem in the server side",
            });
          }
        });
      } else {
        callback(500, {
          error: "there is a problem on the server side",
        });
      }
    });
  } else {
    callback(400, {
      error: "u have a problem in your request",
    });
  }
};
handler._users.get = (requestProperties, callback) => {
  const phone =
    typeof requestProperties.queryString.phone === "string" &&
    requestProperties.queryString.phone.trim().length === 11
      ? requestProperties.queryString.phone.trim()
      : false;

  if (phone) {
    let token =
      typeof requestProperties.headerObjects.token === "string" &&
      requestProperties.headerObjects.token.trim().length === 20
        ? requestProperties.headerObjects.token
        : false;

    if (token) {
      tokenHandler._tokens.verify(token, phone, (tokenID) => {
        if (tokenID) {
          lib.read("users", phone, (err, user) => {
            if (!err && user) {
              user = utilities.parseJSON(user);
              delete user.password;
              callback(200, user);
            } else {
              callback(404, {
                error: "user not found",
              });
            }
          });
        } else {
          callback(403, {
            error: "authentication failure",
          });
        }
      });
    } else {
      callback(400, {
        error: "there is a problem in ur request",
      });
    }
  } else {
    callback(404, {
      error: "user not found",
    });
  }
};
handler._users.put = (requestProperties, callback) => {
  const phone =
    typeof requestProperties.body.phone === "string" &&
    requestProperties.body.phone.trim().length === 11
      ? requestProperties.body.phone.trim()
      : false;

  const firstName =
    typeof requestProperties.body.firstName === "string" &&
    requestProperties.body.firstName.trim().length > 0
      ? requestProperties.body.firstName.trim()
      : false;

  const lastName =
    typeof requestProperties.body.lastName === "string" &&
    requestProperties.body.lastName.trim().length > 0
      ? requestProperties.body.lastName.trim()
      : false;

  const password =
    typeof requestProperties.body.password === "string" &&
    requestProperties.body.password.trim().length > 0
      ? requestProperties.body.password.trim()
      : false;

  if (phone) {
    if (firstName || lastName || password) {
      let token =
        typeof requestProperties.headerObjects.token === "string" &&
        requestProperties.headerObjects.token.trim().length === 20
          ? requestProperties.headerObjects.token
          : false;

      if (token) {
        tokenHandler._tokens.verify(token, phone, (tokenID) => {
          if (tokenID) {
            lib.read("users", phone, (err, user) => {
              const userdata = utilities.parseJSON(user);
              if (!err && user) {
                if (firstName) {
                  userdata.firstName = firstName;
                }
                if (lastName) {
                  userdata.lastName = lastName;
                }
                if (password) {
                  userdata.password = utilities.hash(password);
                }

                lib.update("users", phone, userdata, (err2) => {
                  if (!err2) {
                    callback(200, {
                      error: "user updated successfully",
                    });
                  } else {
                    callback(400, {
                      error: "there is a problem in your reuqest",
                    });
                  }
                });
              } else {
                callback(404, {
                  error: "user not found",
                });
              }
            });
          } else {
            callback(403, {
              error: "authentication failure",
            });
          }
        });
      } else {
        callback(400, {
          error: "there is a problem in ur request",
        });
      }
    } //
  } else {
    callback(400, {
      error: "there is a  poblem in ur request",
    });
  }
};
handler._users.delete = (requestProperties, callback) => {
  const phone =
    typeof requestProperties.body.phone === "string" &&
    requestProperties.body.phone.trim().length === 11
      ? requestProperties.body.phone.trim()
      : false;

  if (phone) {
    let token =
      typeof requestProperties.headerObjects.token === "string" &&
      requestProperties.headerObjects.token.trim().length === 20
        ? requestProperties.headerObjects.token
        : false;

    if (token) {
      tokenHandler._tokens.verify(token, phone, (tokenID) => {
        if (tokenID) {
          lib.read("users", phone, (err, user) => {
            if (!err && user) {
              lib.delete("users", phone, (err2) => {
                if (!err2) {
                  callback(200, {
                    message: "deleted successfully",
                  });
                } else {
                  callback(500, {
                    error: "server side issue",
                  });
                }
              });
            } else {
              callback(404, {
                error: "user not found",
              });
            }
          });
        } else {
          callback(403, {
            error: "authentication failure",
          });
        }
      });
    } else {
      callback(400, {
        error: "theres a problem in ur request",
      });
    }
  } else {
    callback(500, {
      error: "server side issue",
    });
  }
};
export default handler;
