const mongoose = require('mongoose');
const { orderSchema } = require('./orderModel')
const { Schema } = mongoose;

const archiveOrderSchema = new Schema({

    archivedOrder: orderSchema

})

const ArchiveOrder = mongoose.model('ArchiveOrder', archiveOrderSchema);
   
module.exports = { archiveOrderSchema, ArchiveOrder };