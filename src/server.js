const express = require('express')
const { default: AdminBro } = require('admin-bro');
const options = require('./admin.options');
const buildAdminRouter = require('./admin.router');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 3000;
const orderReplyRouter = require('./orders/orderReplyRouter');
const orderCreateRouter = require('./orders/orderCreateRouter');
const ordersRetrieveRouter = require('./orders/ordersRetrieveRouter');
const invoiceCreateRouter = require('./invoices/invoiceCreateRouter');
const invoicesRetrieveRouter = require('./invoices/invoicesRetrieveRouter');
const depositCreateRouter = require('./deposits/depositCreateRouter');
const depositRemoveRouter = require('./deposits/depositRemoveRouter');
const docDownloadRouter = require('./docDownloadRouter')
const docDeleteRouter = require('./docDeleteRouter')
const depositEditRouter = require ('./deposits/depositEditRouter');
const depositExcelRouter = require('./deposits/depositExcelRouter');
const depositDocsZipRouter = require('./deposits/depositDocsZipRouter');
const invoiceRequestRouter = require('./orders/invoiceRequestRouter');
const customerRouter = require('./customers/customerRouter');
const { response } = require('express');
const cookieParser = require('cookie-parser');

const { addDocToInvoiceRecord } = require('./invoices/invoiceController');
const { addDocToDepositRecord } = require('./deposits/depositController');


const fs = require ('fs')
const path = require('path');
const multer  = require('multer')


const returnStorage = multer.diskStorage({

  destination: (req, file, cb) => {

    const record = JSON.parse(req.body.record)
    const dir = `./uploads/${record.params._id}/`
    const dateId = Date.now()


    if (!fs.existsSync(dir)){
      fs.mkdirSync(dir);
    }
    
    if (!fs.existsSync(dir + `${req.body.documentType.toLowerCase()}/`)){
      fs.mkdirSync(dir + `${req.body.documentType.toLowerCase()}/`);
    }
    if (!fs.existsSync(dir + `${req.body.documentType.toLowerCase()}/` + dateId)){
      fs.mkdirSync(dir + `${req.body.documentType.toLowerCase()}/` + dateId);
    }

    return cb(null, dir + `${req.body.documentType.toLowerCase()}/` + dateId)
  },


  filename: function (req, file, cb) {

    cb(null, file.originalname)
  }
})

const uploadReturn = multer({ storage : returnStorage  })

const run = async () => {
  
  await mongoose.connect(process.env.MONGODB_URI, {
    

    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  const admin = new AdminBro(options);

  const router = buildAdminRouter(admin); 

  app.use(admin.options.rootPath, router);

  app.use(express.json());

  app.use(cors({
    origin : "http://localhost:3006",
    credentials: true,
  }))

  app.use(cookieParser());

  app.use(`/uploads`, express.static('uploads'));
  app.use(`/favicon`, express.static('favicon'));

  app.use('/orderreply', orderReplyRouter);

  app.use('/invoicecreate', invoiceCreateRouter);

  app.use('/depositadd', depositCreateRouter);

  app.use('/depositremove', depositRemoveRouter);

  app.use('/depositedit', depositEditRouter);

  app.use('/depositexcel', depositExcelRouter);

  app.use('/depositdocszip', depositDocsZipRouter);

  app.use('/download', docDownloadRouter);

  app.use('/delete', docDeleteRouter);

  app.use('/ordercreate', orderCreateRouter);

  app.use('/ordersretrieve', ordersRetrieveRouter);

  app.use('/invoicesretrieve', invoicesRetrieveRouter);

  app.use('/requestinvoice', invoiceRequestRouter);

  app.use('/customer', customerRouter);


  app.use('/', express.static(path.join(__dirname, "..", "client", "build")));

  app.post('/invoicedocupload/:typeToUpload', uploadReturn.single("data"), async function (req, res, next) {

    const record = JSON.parse(req.body.record);

    const data = await addDocToInvoiceRecord(req.file, record.params, req.params.typeToUpload.toUpperCase(), req.body.returnAmount, req.body.chequeNumber);

    if (data.message){

      res.status(500).send(data.message);

    } else {

      res.json({data: data});

    }

  })

  app.post('/depositdocupload/:typeToUpload', uploadReturn.single("data"), async function (req, res, next) {

    const record = JSON.parse(req.body.record);

    const data = await addDocToDepositRecord(req.file, record.params, req.params.typeToUpload.toUpperCase());

    if (data.message){

      res.status(500).send(data.message);

    } else {

      res.json({data: data});

    }

  })

  app.listen(port, () => {

      console.log(`listening at http://localhost:${port}`)
  })
}

module.exports = run;