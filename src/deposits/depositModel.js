const mongoose = require('mongoose');

const { Schema } = mongoose;


const subInvoiceSchema = new Schema({

    invoiceId: String,
    invoiceNumber: String

})

const depositSchema = new Schema({


    submissionDate: String,

    approvalStatus: {
        type: String,
        enum: ['PENDING', 'APPROVED']
    },

    depositStatus: {
        type: String,
        enum: ['PENDING', 'DEPOSITED'],
        default: 'PENDING'
    },

    invoices: [subInvoiceSchema],

    supportingDocs: {

        signature: {
            signatureDocPath: String,
            signatureDocName: String
        },

        bankReciept: {
            bankRecieptDocPath: String,
            bankRecieptDocName: String
        }        
        
    }

})

const subInvoice = mongoose.model('subInvoice', subInvoiceSchema )
const Deposit = mongoose.model('Deposit', depositSchema);


    
module.exports = { depositSchema, Deposit, subInvoice  };