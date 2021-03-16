const jwt = require('jsonwebtoken');
// would need to be an env variable

const KEY = process.env.CUSTOMER_KEY || "secret local development passphrase"


exports.createToken = (user) => {
  // payload + header, MIX IT UP with the key and generate the signature
  const token = jwt.sign(user, KEY);

  return token;
}

exports.verifyToken = async (token) => {
  let user;
  // signature from the token, generating an expected signature and comparing the two
  jwt.verify(token, KEY, (err, decoded) => {
    if (err) {
      throw err;
    }
    user = decoded;
  })

  // const decoded = jwt.verify(token, KEY)

  return user;
}