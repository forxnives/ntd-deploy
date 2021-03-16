const {Invoice}  = require('./invoiceModel');
const {Order}  = require('../orders/orderModel');
const { Customer } = require('../customers/customerModel');
const { ArchiveOrder } = require('../orders/orderArchiveModel')
const fs = require('fs');
const rimraf = require("rimraf");



exports.createInvoiceFromOrder = async (orderId, data) => {

    try {

        const order = await Order.findById(orderId);

        order.invoiceStatus = 'INVOICECREATED';

        const existingInvoiceNumbers = await Invoice.find({number: data.number})
        
        if (existingInvoiceNumbers.length) {
            throw new Error('Write Failure')

        }

        const newInvoice = new Invoice({...data, orderItems: order.requests, customerId: order.customerId });


        const invoice = await newInvoice.save();

        const customer = await Customer.findById(data.customerId)

        customer.invoices.push(invoice)

        const index = customer.orders.indexOf(orderId)

        if (index > -1) {
            customer.orders.splice(index, 1);
        }

        const savedcustomer = customer.save();

        Order.findByIdAndDelete(orderId, function (err) {
            if(err) console.log(err);
            console.log("Successful deletion");
          });
    
        








        return invoice;

    }catch (err){

        throw err;
    }
} 

exports.createNewInvoice = async (data) => {
    try {


        const existingInvoiceNumbers = await Invoice.find({number: data.number})
        
        if (existingInvoiceNumbers.length) {
            throw new Error('Write Failure')

        }

        const newInvoice = new Invoice({...data});
        const savedInvoice = await newInvoice.save();


        return savedInvoice;


    }catch (err){
        throw err
    }
}

exports.populateInvoicesById = async (invoices) => {

    try {

        let returnArray = []
        for (let i = 0; i < invoices.length; i++) {

            const document = await Invoice.findById(invoices[i].invoiceId);
            returnArray.push(document);

        }

        return returnArray

    } catch (err) {
        throw err;
    }

}

exports.addDocToInvoiceRecord = async (file, recParams, documentType, returnAmount, chequeNumber)  => {

    try {

        const invoice = await Invoice.findById(recParams._id);
        invoiceObj = invoice.toObject();

        const pathSplitArray = file.destination.split('/');
        const pathNumber = pathSplitArray[pathSplitArray.length-1];

        

        if (documentType === 'RETURN') {

            invoice.returned.returnDocPath = pathNumber
            invoice.returned.returnDocName = file.originalname
            invoice.returned.returnAmount = returnAmount
            invoice.docStatus = 'RETURNED';

            if (invoiceObj.cancelled || invoiceObj.returned) {                      //if  document already exists..
                
                throw new Error('Write Failure')
            }



        };


        if (documentType === 'CANCEL') {

            invoice.cancelled.cancelDocPath = pathNumber
            invoice.cancelled.cancelDocName = file.originalname
            invoice.docStatus = 'CANCELLED';

            if (invoiceObj.cancelled || invoiceObj.returned) {                      //if  document already exists..
                
                throw new Error('Write Failure')
            }




        };


        if (documentType === 'CHEQUE') {

            invoice.paymentDoc.paymentDocPath = pathNumber
            invoice.paymentDoc.paymentDocName = file.originalname
            invoice.paymentDoc.paymentDocType = documentType
            invoice.paymentDoc.chequeNumber = chequeNumber
        }


        if (documentType === 'TRANSFER' || documentType === 'DEPOSIT') {

            invoice.paymentDoc.paymentDocPath = pathNumber
            invoice.paymentDoc.paymentDocName = file.originalname
            invoice.paymentDoc.paymentDocType = documentType

        }

        savedInvoice = invoice.save()
        return savedInvoice

    } catch(err){
        return err
    }
}

exports.deleteInvoiceDocUpdateRecord = async (docNumber, invoiceId, fileName, documentType) => {

    try {

        fs.unlink(`./uploads/${invoiceId}/${documentType}/${docNumber}/${fileName}`, function (err) {
            if (err) throw err;
            // if no error, file has been deleted successfully
            console.log('File deleted!');
        }); 
        
        rimraf(`./uploads/${invoiceId}/${documentType}/${docNumber}`, function () { console.log("done"); });
        const invoice = await Invoice.findById(invoiceId)


        if (documentType === 'return') {
            invoice.returned = null
            invoice.docStatus = 'NORMAL';
        }

        if (documentType === 'cancel') {
            invoice.cancelled = null
            invoice.docStatus = 'NORMAL';
        }

        if (documentType === 'cheque' || 'transfer' || 'deposit') {
            invoice.paymentDoc = null
        }

        savedInvoice = invoice.save()
        return savedInvoice
        
    } catch (err) {
        console.log(err)
    }
}


exports.retrieveInvoices =  async (customerId) => {


    try {

        const invoices = await Invoice.find({customerId: customerId})



        return invoices



        // const invoices = [];

        // for ( let i = 0; i < customer.invoices.length; i++) {
        
        //     let invoice = await Invoice.findById(customer.invoices[i])
        //     invoices.push(invoice)

        // }

        // return invoices


    } catch (err){

        throw err;

    }


}