
const {default: AdminBro} = require ('admin-bro');
const AdminBroMongoose = require('@admin-bro/mongoose');
const OrderWrapper = require('./orders/orderWrapper');
const InvoiceWrapper = require('./invoices/invoiceWrapper');
const DepositWrapper = require('./deposits/depositWrapper');
const CustomerWrapper = require('./customers/customerWrapper');


AdminBro.registerAdapter(AdminBroMongoose);

const options = {

    resources: [ CustomerWrapper, OrderWrapper, InvoiceWrapper, DepositWrapper ],

    branding: {
        softwareBrothers: false,
        companyName: 'NTD Ingredientes Admin',
        logo: 'http://ntdingredientes.com.jm/wp-content/uploads/2019/02/NTD-Ingredientes_Logo-300-WEB.png',
        favicon: '/uploads/cropped-favicon-NTD-32x32.ico'
    },

    dashboard: {
      handler: async () => {
        return { some: 'changalang' }
      },
      component: AdminBro.bundle('./dashboard-component.tsx')
    },

    locale: {

        translations: {

          labels: {

            Order: 'Orders',
            User: 'Users',
            Invoice: 'Invoices',
            Deposit: 'Deposits',
            SupportingDoc: 'Supporting Documents',
            Customer: 'Customers'

          },

          messages: {
            loginWelcome: 'NTD Ingredientes Admin.'
          }

        }
    }
}


module.exports = options;