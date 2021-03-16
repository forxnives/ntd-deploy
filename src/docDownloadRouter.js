const express = require('express');


const router = express.Router();

router.route('/:doctype/:recordId/:path/:filename')

.get(async (req, res) => {


    const file = `./uploads/${req.params.recordId}/${req.params.doctype}/${req.params.path}/${req.params.filename}`;
    res.download(file); // Set disposition and send it.

})



  module.exports = router;