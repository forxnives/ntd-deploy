const express = require('express');
const { createUser, findUserByEmail, findUserById, createCustomer } = require('./customerController');
// NOT FROM TOKENSERVICE
const { verifyToken } = require('./middleware/verifyToken');
const { createToken } = require('./tokens/tokenService');
const router = express.Router();




router.route('/create').post(async (req, res) => {
  const {email, userName, code, password, trn} = req.body.payload;


  if (!email || email === ' ') {
    res.status(400).json({ message: 'email must be provided'});
    return;
  }
  if (!password || password === " ") {
    res.status(400).json({ message: "password must be provided" });
    return;
  }

  if (!userName || userName === ' ') {
    res.status(400).json({ message: 'username must be provided'});
    return;
  }
  if (!code || code === " ") {
    res.status(400).json({ message: "customer code must be provided" });
    return;
  }

  if (!trn || trn === " ") {
    res.status(400).json({ message: "trn must be provided" });
    return;
  }

  try {

    const customer = await createCustomer(email, userName, code, password, trn)

    res.status(200).send({})


  } catch (err) {
    res.status(400).json({message: err.message})
  }
})


router.route('/login').post(async (req, res) => {
  const { email, password } = req.body;

  
  if (!email || email === ' ') {
    res.status(400).json({ message: 'email must be provided'});
    return;
  }
  if (!password || password === " ") {
    res.status(400).json({ message: "password must be provided" });
    return;
  }

  try {

    const user = await findUserByEmail(email);

    if (!user) {
      res.status(401).json({ message: "password and email do not match"});
      return;
    }
    // from userModel
    // does the password match the hash from the db?
    const isMatch = await user.comparePasswords(password);

    if (!isMatch) {
      res.status(400).json({ message: 'password and email do not match'});
      return;
    }
    // argument here will be the PAYLOAD of the token:


    const token = createToken({ id: user._id });

    // SET-COOKIE header being attached to response    
    res.cookie('token', token);


    res.status(200).send({});
  } catch(e) {
    console.log(e);
  }
})

router.use(verifyToken).route('/me').get(async (req, res) => {
  try {

    const user = await findUserById(req.user.id);
    res.json({ data: user });
  } catch(e) {

  }
})


module.exports = router;