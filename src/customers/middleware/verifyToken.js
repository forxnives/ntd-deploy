const { verifyToken } = require('../tokens/tokenService');
const cookieParser = require('cookie-parser');

exports.verifyToken = async (req, res, next) => {
  const { cookies } = req;


  try {
    if (!cookies || !cookies.token) {
      
      res.status(403).json({ message: 'authorization 🐛 required'});
      
      return;
    }
    const token = cookies.token;
    // {id: someuserid }
    const userToken = await verifyToken(token);
    req.user = userToken;
    next();
  } catch(e) {
    res.status(403).json({message: 'invalid or expired token'});
  }
}