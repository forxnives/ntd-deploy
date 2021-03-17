const jwt = require('jsonwebtoken');

const KEY = process.env.CUSTOMER_KEY || "secret local development passphrase"


exports.createToken = (user) => {

  const token = jwt.sign(user, KEY);
  return token;
  
}

exports.verifyToken = async (token) => {
  let user;

  jwt.verify(token, KEY, (err, decoded) => {
    if (err) {
      throw err;
    }
    user = decoded;
  })

  return user;
}