const path = require('path');
const {Deposit}  = require('../../deposits/depositModel');
// const fs = require('fs');
const AdminBro = require('admin-bro');

// const {
//     promises: fsPromises,
//     constants: {
//       COPYFILE_EXCL
//     }
//   } = require('fs');

const fs = require ('fs')

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


// const uploadImageBefore = async (request, context) => {

// // intercepting request, replacing password with hashed encryptedPassword

//     if (request.method === 'post') {
//         const { uploadImage, ...otherParams } = request.payload;

//         context.uploadImage = uploadImage;

//         return {
//             ...request,
//             payload: otherParams,
//         };
//     }



//     return request;
// }

module.exports = { deleteInvoiceAfter }