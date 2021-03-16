const {Order}  = require('./orderModel')

const {Customer} = require('../customers/customerModel')

exports.replyToOrder = async (orderId, data) => {

    try {
        const order = await Order.findById(orderId);

        order.replyItems = data.availability;
        order.replyTotalPrice = data.totalPrice;
        order.invoiceStatus = 'REPLIED';
        const savedOrder = order.save();
        return savedOrder;


    }catch (err){

        throw err;

    }

} 

exports.createOrder = async (body) => {

    try {
        
        const newOrder = new Order(body)

        




        const customer = await Customer.findById(newOrder.customerId)

        customer.orders.push(newOrder._id)

        customer.orderCount = customer.orderCount + 1

        newOrder.orderNumber = customer.orderCount

        const savedCustomer = customer.save()

        const savedOrder = await newOrder.save();



        return savedOrder


    }catch (err){
        throw err;
    }
}

exports.retrieveOrders = async (customerId) => {

    try {

        const customer = await Customer.findById(customerId)

        const orders = [];

        for ( let i = 0; i < customer.orders.length; i++) {
        
            let order = await Order.findById(customer.orders[i])
            orders.push(order)

        }

        return orders


    } catch (err){

        throw err;

    }

}

exports.requestInvoice = async (orderId) => {


    try {

        const order = await Order.findById(orderId)

        order.requests = [];

        order.requests = order.replyItems

        order.replyItems = [];

        order.invoiceStatus = 'INVOICEREQUESTED';

        const savedOrder = order.save()

        return savedOrder

    }   catch (err) {
        throw err;
    }


}