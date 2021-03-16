const express = require('express');
const { replyToOrder, createOrder } = require('./orderController');
const router = express.Router();

router.route('/')

  .post(async (req, res) => {
    try {
      const { body } = req;


        // const newOrder = await replyToOrder(body.orderId, body);
        const newOrder = await createOrder(body);


      res.json({ data:  newOrder });
    } catch(err) {
      console.log(err);
      res.status(500).json({ message: 'internal server error' });
    }

  });
  


module.exports = router;