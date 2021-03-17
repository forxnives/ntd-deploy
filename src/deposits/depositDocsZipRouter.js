const express = require('express');
const { depositDocsZip } = require('./depositController');
const router = express.Router();

router.route('/')

  .put(
    async (req, res) => {

        try {
          const { body } = req;

            depositDocsZip(body.depositId)

        } catch(err) {
          console.log(err);
          res.status(500).json({ message: 'internal server error' });
        }
    }
  )

  router.route('/:depositId')

  .get(
      async (req, res) => {

        try {
            
            const file = `./uploads/deposits/${req.params.depositId}/deposit.zip`
            res.download(file); 

        } catch (err) {
            console.log(err);
            res.status(500).json({ message: 'internal server error' });
        }
        
      }
  )


  module.exports = router;