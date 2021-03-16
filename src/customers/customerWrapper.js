const AdminBro = require('admin-bro');


const { Customer, customerSchema } = require('./customerModel');




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
                
                // edit: false,
                // show: true,
                // new: true


            }
        }


        // encryptedPassword: {
        //     isVisible: false,
        // },

        // _id: {
        //     isVisible: false,
        // },

        // uploadImage: {
        //     components: {
        //         edit: AdminBro.bundle('./components/upload-image.edit.tsx'),
        //         list: AdminBro.bundle('./components/upload-image.list.tsx')
        //     }
        // },
        // displayPicPath: {
        //     isVisible: false
        // },
        // password: {
        //     type: "password",
        // },
    },

    actions: {

        new: {
            component: AdminBro.bundle('./components/customer-action.new.tsx'),
            isAccessible: canModifyOrders,
          },

        
    },

    // parent: null


}


module.exports = {
    options, 
    resource: Customer,
}