const {Deposit}  = require('../depositModel');
const { Invoice } = require('../../invoices/invoiceModel')


const deleteDepositBefore = async (request, context) => {

    const { record } = context;

    if (record.isValid()){

        const deposit = await Deposit.findById(record.params._id);

        for (let i = 0; i < deposit.invoices.length; i++){

            let invoice = await Invoice.findByIdAndUpdate(
                { _id: deposit.invoices[i].invoiceId },
                { depositId: null }
  
            );

            let savedInvoice = await invoice.save()
        }

        if (record.params.depositStatus === 'DEPOSITED') {

            for (let i = 0; i < deposit.invoices.length; i++){

                let invoice = await Invoice.findByIdAndDelete( deposit.invoices[i].invoiceId);
    
            }
        }
    }

    return request;
}


module.exports = { deleteDepositBefore }