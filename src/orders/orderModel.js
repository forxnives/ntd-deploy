const mongoose = require('mongoose');

const { Schema } = mongoose;


const orderItemsSubSchema = new Schema({
    
        quantity: {
            type: String,
            required: false
        },
        packing: {
            type: String,
            required: false
        },
        item: {
            type: String,
            required: false
        }
    
})



const orderSchema = new Schema({

    customerId: String,

    orderNumber: {
        type: Number,
        default: 1
    },

    customer: {
        type: String,  //populate customer ID here
        required: true
    },

    customerCode: {
        type: String,  //populate customer ID here
        required: true
    },

    invoiceStatus: {
        type: String,
        enum: [ 'REQUESTED','REPLIED', 'INVOICEREQUESTED', 'INVOICECREATED' ],
        default: 'REQUESTED'
    },

    date: {
        type: Date,
        required: true
    },

    requests: [orderItemsSubSchema],



    replyItems: [orderItemsSubSchema],

    replyTotalPrice: String,
    replyNotes: String,
    reply: String



})



const Order = mongoose.model('Order', orderSchema);

    
module.exports = { orderSchema, orderItemsSubSchema, Order };

// module.exports = Order ;
