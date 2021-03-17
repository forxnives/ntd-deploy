const AdminBro = require('admin-bro');
const { Customer } = require('./customerModel');


const canModifyOrders = ({ currentAdmin }) => currentAdmin && currentAdmin.userType === 'ADMIN';

const options = {

    listProperties: ['userName', 'orders','invoices'],

    properties: {

        _id: {
            isVisible: {
                show: false
            }
        },

        orders: {
            components: {
                list: AdminBro.bundle('./components/customer-orders-list-display.tsx'),
                show: AdminBro.bundle('./components/customer-orders-list-display.tsx'),
            },

            isVisible: {
                edit: false
            }
        },

        invoices: {
            components: {
                list: AdminBro.bundle('./components/customer-invoices-list-display.tsx'),
                show: AdminBro.bundle('./components/customer-invoices-list-display.tsx'),
            },

            isVisible: {
                edit: false,
            }
        },

        password: {
            isVisible: {
                
                filter: false,
            }
        }
    },

    actions: {

        new: {
            component: AdminBro.bundle('./components/customer-action.new.tsx'),
            isAccessible: canModifyOrders,
          }, 
    },
}


module.exports = {
    options, 
    resource: Customer,
}