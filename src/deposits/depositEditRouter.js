
const express = require('express');
const { queryDeposits, bulkCreateDeposit, bulkAddToDeposit, addDateToDeposit, addDepositStatusToDeposit} = require('./depositController');


const router = express.Router();

router.route('/:params')


  .put(
    async (req, res) => {

        try {

          

          if (req.params.params ==='date' ){

            const data = await addDateToDeposit(req.body.depositDate, req.body.depositId)
            res.json({ data: data });

          }

          if (req.params.params === 'depositstatus') {

            const data = await addDepositStatusToDeposit(req.body.depositStatus, req.body.depositId)
            res.json({ data: data });
          }





        } catch(err) {

          console.log(err);
          res.status(500).json({ message: 'internal server error' });

        }
    
      }
  )


  module.exports = router;