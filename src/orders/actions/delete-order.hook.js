const path = require('path');
const {Customer}  = require('../../customers/customerModel');
// const fs = require('fs');
const AdminBro = require('admin-bro');


const deleteOrderAfter = async (response, request, context) => {

    const { record } = context;

    if (record.isValid()){



        const customer = await Customer.findById(record.params.customerId)


        if (customer){

            const index = customer.orders.indexOf(record.params._id)

            if (index > -1) {
                customer.orders.splice(index, 1);
            }

            const savedcustomer = await customer.save();

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

module.exports = { deleteOrderAfter }