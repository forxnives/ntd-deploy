const express = require('express');


const {createExcelFile} = require('./depositController');


const router = express.Router();

router.route('/')

.put(async (req, res) => {

    try {
        
        const data = await createExcelFile(req.body.depositId)

        res.json({data: data})



    } catch(err) {
        res.status(500).json({ message: 'internal server error' });
    }

})


// .get(async (req, res) => {

//     try {

//         console.log(req.body)

//         const file = `./uploads/Excel.xlsx`;
        
//         // res.download(file); 


//     }   catch (err){

//         res.status(500).json({ message: 'internal server error' });
//     }

// })



module.exports = router;