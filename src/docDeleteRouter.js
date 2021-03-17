const express = require('express');

const { deleteInvoiceDocUpdateRecord } = require('./invoices/invoiceController');
const { deleteDepositDocUpdateRecord } = require('./deposits/depositController');

const router = express.Router();

router.route('/:typeToDelete')

.put(async (req, res) => {

  const {typeToDelete} = req.params

  if (typeToDelete === 'RETURN' ){

    const data = deleteInvoiceDocUpdateRecord(req.body.payload["returned.returnDocPath"], req.body.payload._id, req.body.payload["returned.returnDocName"], 'return' )

    res.json({ data:  data });

  }

  if (typeToDelete === 'CANCEL' ){

    const data = deleteInvoiceDocUpdateRecord(req.body.payload["cancelled.cancelDocPath"], req.body.payload._id, req.body.payload["cancelled.cancelDocName"], 'cancel' )

    res.json({ data:  data });

  }

  if (typeToDelete === 'CHEQUE' || typeToDelete === 'TRANSFER' || typeToDelete === 'DEPOSIT'){

    const data = deleteInvoiceDocUpdateRecord(req.body.payload["paymentDoc.paymentDocPath"], req.body.payload._id, req.body.payload["paymentDoc.paymentDocName"], req.params.typeToDelete.toLowerCase())

    res.json({data: data});

  }

  if (typeToDelete === 'SIGNATURE' ){

    const data = deleteDepositDocUpdateRecord(req.body.payload["supportingDocs.signature.signatureDocPath"], req.body.payload._id, req.body.payload["supportingDocs.signature.signatureDocName"], 'signature' )

    res.json({ data:  data });

  }

  if (typeToDelete === 'BANKRECIEPT' ){

    const data = deleteDepositDocUpdateRecord(req.body.payload["supportingDocs.bankReciept.bankRecieptDocPath"], req.body.payload._id, req.body.payload["supportingDocs.bankReciept.bankRecieptDocName"], 'bankreciept' )

    res.json({ data:  data });

  }

})

  module.exports = router;