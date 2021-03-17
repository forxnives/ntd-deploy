const {Deposit}  = require('../../deposits/depositModel');


const deleteInvoiceAfter = async (response, request, context) => {

    const { record } = context;

    if (record.isValid()){

        if (record.params.depositId) {

            const deposit = await Deposit.findById(record.params.depositId)
            if (deposit.invoices.length === 1) {

                Deposit.deleteOne({_id: record.params.depositId }, function (err) { 
                    if (err) {
                        console.log(err)
                    }
                })

            } else if (deposit.invoices.length > 1){
                deposit.invoices = deposit.invoices.filter(invoice => 
                    (invoice.invoiceId !== record.params._id)
                )

                savedDeposit = deposit.save()
            }
        }
    }

    return response;
}

module.exports = { deleteInvoiceAfter }