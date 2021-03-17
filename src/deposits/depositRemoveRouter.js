const express = require('express');
const { removeInvoiceFromDeposit } = require('./depositController');
const router = express.Router();



router.route('/')

  .put(
    async (req, res) => {

        try {
          const { body } = req;
          const data = await removeInvoiceFromDeposit(body.invoiceId, body.depositId)

        res.json({ data: data });


        } catch(err) {
          console.log(err);
          res.status(500).json({ message: 'internal server error' });
        }
      }
  )


  module.exports = router;