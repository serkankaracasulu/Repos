const jwt = require("jsonwebtoken");
module.exports = async (req, res, next) => {
  const authHeader = req.get("Authorazation-x");
  if (!authHeader) {
    req.isAuth = false;
    return next();
  }
  const token = authHeader.split(" ")[1];
  if (!token & (token === "")) {
    req.isAuth = false;
    return next();
  }
  console.log(token);
  let decodedToken;
  try {
    jwt.verify(token, "secretprivatekey", (err, decoded) => {
      if (err) {
        console.log("verfy yok");
        req.isAuth = false;
        return next();
      }
      if (decoded) {
        decodedToken = decoded;
        console.log("decoded" + decoded);
      }
    });
  } catch (error) {
    req.isAuth = false;
    return next();
  }
  if (!decodedToken) {
    req.isAuth = false;
    next();
  }

  req.isAuth = true;
  req.userId = decodedToken.userId;
  next();
};
