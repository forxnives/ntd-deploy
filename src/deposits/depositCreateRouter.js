const express = require('express');
const { queryDeposits, bulkCreateDeposit, bulkAddToDeposit } = require('./depositController');
const router = express.Router();



router.route('/')

.get(async (req, res) => {
    try{
        
        const deposits = await queryDeposits();
        res.json({data: deposits})

    } catch (err) {
        console.log(err.message)
    }
})

.post(async (req, res) => {

    try {
      const { body } = req;

        const data = await bulkCreateDeposit(body.payload)

      res.json({ data: data });
    } catch(err) {
      console.log(err);
      res.status(500).json({ message: 'internal server error' });
    }

  })
  .put(
    async (req, res) => {

        try {
          const { body } = req;
          const data = await bulkAddToDeposit(body.depositId, body.payload)
          res.json({ data: data });
          
        } catch(err) {
          console.log(err);
          res.status(500).json({ message: 'internal server error' });
        }
      }
  )


  module.exports = router;