const mongoose = require('mongoose');

const { Schema } = mongoose;

const supportingDocModel = new Schema({

    invoiceId: String,

    depositId: String,

    userId: String,   //populate

    docType: {
        type: String,
        enum: ['CHEQUE', 'TRANSFER', 'CANCELLATION', 'RETURN', 'SIGNATURE', 'BANKRECIEPT']
    },   //
    data: String   //fiePath

})


const SupportingDoc = mongoose.model('SupportingDoc', supportingDocModel);

    
module.exports = { supportingDocModel, SupportingDoc };
