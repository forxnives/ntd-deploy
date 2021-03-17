const {Customer}  = require('../../customers/customerModel');


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

module.exports = { deleteOrderAfter }