const mongoose = require('mongoose');
const { orderItemsSubSchema } = require('../orders/orderModel')
const { Schema } = mongoose;


const invoiceSchema = new Schema({


    number: {
        type: String,
        required: true
    },

    customerId: {
        type: String
    },

    customerCode: {
        type: String,
        required: true
    },

    customer: {
        type: String,
        required: true
    },

    status: {
        type: String,
        enum: ['UNPAID', 'PAID'],
        default: 'UNPAID'
    },

    docStatus: {
        type: String,
        enum: ['RETURNED', 'CANCELLED', 'NORMAL'],
        default: 'NORMAL'
    },

    price: {
        type: Number,
        required: true
    },

    paymentMethod: {

        type: String,
        enum: ['CASH', 'NET30'],
        default: 'CASH'
    },

    orderId: {
        type: String,
        required: false
    },

    orderItems: [orderItemsSubSchema],

    depositId: String,

    cancelled: {
        cancelDocName: String,
        cancelDocPath: String
    },

    returned: {
        returnDocName: String,  
        returnDocPath: String,
        returnAmount: String,
    },

    paymentDoc: {
        paymentDocName: String,
        paymentDocPath: String, 
        paymentDocType: String,
        chequeNumber: String
    }

})


const Invoice = mongoose.model('Invoice', invoiceSchema);

module.exports = { invoiceSchema, Invoice };
