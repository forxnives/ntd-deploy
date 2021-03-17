const express = require('express');
const { retrieveInvoices } = require('./invoiceController');

const router = express.Router();

router.route('/')

  .put(async (req, res) => {

    try {
      const { body } = req;

      const data = await retrieveInvoices(body.customerId)
      
      res.json({ data:  data });

    } catch(err) {
      console.log(err);
      res.status(500).json({ message: 'internal server error' });
    }

  });
  

module.exports = router;