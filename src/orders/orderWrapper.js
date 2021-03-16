const AdminBro = require('admin-bro');
const { deleteOrderAfter } = require('./actions/delete-order.hook.js')



const { Order, orderSchema } = require('./orderModel');



const canModifyOrders = ({ currentAdmin }) => currentAdmin && currentAdmin.userType === 'ADMIN';


const options = {


    listProperties: ['customer', 'date','invoiceStatus'],

    properties: {


        _id: {
            isVisible: false
        },



        customer: {
            isVisible: {
                // list: false,
                filter: true,
                
            },
            components: {
                list: AdminBro.bundle('./components/order-customer-list-display.tsx')
            }


        },


        customerCode: {
            isVisible: {
                // list: false,
                filter: true
            }
        },

        customerId: {
            isVisible: {
                show: false
            }
        },

        orderNumber: {
            isVisible: {
                show: false
            }
        },


        requests: {

            // isArray: true,
            components: {
                show: AdminBro.bundle('./components/order-requests.show.tsx'),
                // list: AdminBro.bundle('../test-component.tsx')
            }

        },

        date: {
            isVisible: {list: true, filter: true}
        },

        invoiceStatus: {
            isVisible: {list: true, filter: true}
        },

        replyItems : {
            isVisible: false
        },

        replyTotalPrice: {
            isVisible: false
        },

        replyNotes: {
            isVisible: false
        },




        reply: {

            isVisible: {
                // list: true,
                filter: false,
                show: true,
                edit: false
            },


            components: {
                edit: AdminBro.bundle('./components/order-invoice.create.tsx'),
                show: AdminBro.bundle('./components/order-request.reply.tsx')

            },

        }

    },

    actions: {

        new: {
            isAccessible: canModifyOrders,
        },

        edit: {

            isAccessible: canModifyOrders,
        },

        delete: {
            isAccessible: canModifyOrders,
            after: async (response, request, context) => {

                return deleteOrderAfter(response, request, context)

              }

        },
        bulkDelete: {
            isAccessible: canModifyOrders,
        },



        
    },

    parent: null

}




module.exports = {
    options, 
    resource: Order,
}