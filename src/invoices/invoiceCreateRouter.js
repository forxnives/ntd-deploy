const express = require('express');
const { createInvoiceFromOrder, populateInvoicesById, createNewInvoice } = require('./invoiceController');

const router = express.Router();

router.route('/')

.post(async (req, res) => {

    try {

      const { body } = req;

      if (body.orderId) {

        const data = await createInvoiceFromOrder(body.orderId, body.payload);
        res.json({ data: data });

      } else {

        const data = await createNewInvoice(body.payload)
        res.json({ data: data });

      }

    } catch(err) {
      console.log(err);
      res.status(500).json({ message: 'internal server error' });
    }

  })

  .put(async (req, res) => {
    try {

      const { body } = req;
      const data = await populateInvoicesById(body.invoices)
      res.json({data: data})

    }catch (err){
      console.log(err)
      res.status(500).json({ message: 'internal server error' });
    }
  })


  router.route('/')

  module.exports = router;