const AdminBro = require('admin-bro');
const { Invoice } = require('./invoiceModel');
const uploadFeature = require('@admin-bro/upload')
const { deleteInvoiceAfter } = require('./actions/delete-invoice.hook.js')


const canModifyOrders = ({ currentAdmin }) => currentAdmin && currentAdmin.userType === 'ADMIN';

const options = {

  listProperties: ['number', 'customer','status'],

    properties: {

        _id: {
            isVisible: false
        },

        number: {
          isVisible: {
            edit: true,
            show: false,
            filter: true
          }
        },

        customer: {
          isVisible: {
            list: true,

            show: false,
            filter: true
          },

          components: {
            list: AdminBro.bundle('./components/invoice-list.customer.display.tsx'),

          }
        },

        customerId: {
          isVisible: {
            list: false
          }
        },

        paymentMethod: {
          isVisible: {
            list: true,
            show: false,
            filter: true
          }
        },
        
        price: {
          components: {
            
            show: AdminBro.bundle('./components/invoice.show.tsx')
          }
        },

        status: {

          isVisible: {
            edit: true,
            show: false
          }
        },

        docStatus: {
          isVisible: {
            edit: false,
            show: false,

          }
        },

        customerCode: {
          isVisible: {
            list: true,
            show: false,
            filter: true

          }
        },

        orderId: {
            isVisible: false

        },

        depositId: {
          isVisible: {
            list: false,
            filter: false,
            edit: false
          }
        },

        orderItems: {
          isArray: true,
          isVisible: false,
        },


        "cancelled.cancelled": {
            isVisible: false
        },
        

        "cancelled.cancelDocName": {
            isVisible: false
        },

        "cancelled.cancelDocPath": {
          isVisible: false
        },

        "returned.returnDocName": {
            isVisible: false
        },

        "returned.returnDocPath": {
          isVisible: false
        },

        "returned.returnAmount": {
            isVisible: false
        },

        "returned.returnDoc": {
            isVisible: false
        },

        "paymentDoc.paymentDocName": {
            isVisible: false
        },

        "paymentDoc.paymentDocPath": {
          isVisible: false
        },

        "paymentDoc.paymentDocType": {
          isVisible: false
        },

        "paymentDoc.chequeNumber": {
          isVisible: false
        },

        uploadFile:{
          isVisible: false
        }

    },

    actions: {

      new: {
        component: AdminBro.bundle('./components/invoice-action.new.tsx'),
      },

        AddToExistingDeposit: {
            actionType: 'bulk',
            icon: 'View',
            isVisible: true,
            handler: async (request, response, context) => {
  
              const { records, resource, h, translateMessage } = context
  
              if (!records || !records.length) {
                throw new NotFoundError('no records were selected.', 'Action#handler')
              }
              if (request.method === 'get') {
                const recordsInJSON = records.map(record => record.toJSON(context.currentAdmin))
                return {
                  records: recordsInJSON,
                }
              }
              if (request.method === 'post') {
                await Promise.all(records.map(record => resource.delete(record.id())))
                return {
                  records: records.map(record => record.toJSON(context.currentAdmin)),
                  notice: {
                    message: translateMessage('successfullyBulkDeleted', resource.id(), {
                      count: records.length,
                    }),
                    type: 'success',
                  },
                  
                  redirectUrl: `${window.location.origin}/admin`,
                }
              }
              throw new Error('method should be either "post" or "get"')
    
            },
            component: AdminBro.bundle('./components/invoice-deposit.bulk.addexisting.tsx'),
          },

      
        AddToNewDeposit: {
          actionType: 'bulk',
          icon: 'View',
          isVisible: true,
          handler: async (request, response, context) => {

            const { records, resource, h, translateMessage } = context

            if (!records || !records.length) {
              throw new NotFoundError('no records were selected.', 'Action#handler')
            }
            if (request.method === 'get') {
              const recordsInJSON = records.map(record => record.toJSON(context.currentAdmin))
              return {
                records: recordsInJSON,
              }
            }
            if (request.method === 'post') {
              await Promise.all(records.map(record => resource.delete(record.id())))
              return {
                records: records.map(record => record.toJSON(context.currentAdmin)),
                notice: {
                  message: translateMessage('successfullyBulkDeleted', resource.id(), {
                    count: records.length,
                  }),
                  type: 'success',
                },
                
                redirectUrl: `${window.location.origin}/admin`,
              }
            }
            throw new Error('method should be either "post" or "get"')

          },
          component: AdminBro.bundle('./components/invoice-deposit.bulk.addnew.tsx'),
        },

        bulkDelete: {isAccessible: false},

        delete: {
          isAccessible: true,
          after: async (response, request, context) => {

            return deleteInvoiceAfter(response, request, context)
            
          }
      },
        
    },


}

const features = [
  
  uploadFeature({
    provider: { local: { bucket: 'uploads'}},
    properties: {
      key: 'uploadedFile.path',
      bucket: 'uploadedFile.folder',
      mimeType: 'uploadedFile.type',
      size: 'uploadedFile.size',
      filename: 'uploadedFile.filename',
      file: 'uploadFile',
    }
  })
]


module.exports = {
    options, 
    features: features,
    resource: Invoice,
}