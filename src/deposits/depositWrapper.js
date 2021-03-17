const AdminBro = require('admin-bro');
const { Deposit } = require('./depositModel');
const { deleteDepositBefore } = require('../deposits/actions/delete-deposit.hook');


const canModifyOrders = ({ currentAdmin }) => currentAdmin && currentAdmin.userType === 'ADMIN';

const options = {

    properties: {

        depositStatus: {
            isVisible: {show: false, list: true, filter: true}
        },

        _id: {
            isVisible: false
        },

        approvalStatus: {
            isVisible: {show: false, list: false, filter: true}
        },

        invoices: {

            components: {

                show: AdminBro.bundle('./components/deposit.show.tsx'),
                list: AdminBro.bundle('./components/invoices.list.tsx')

            },
            isVisible: {show: true, list: true, filter: true}
        },

        submissionDate: {
            isVisible: {show: false, list: true, }
        },

        "supportingDocs.signature.signatureDocPath": {
            isVisible: false
        },

        "supportingDocs.signature.signatureDocName": {
            isVisible: false
        },

        "supportingDocs.bankReciept.bankRecieptDocPath": {
            isVisible: false,
        },

        "supportingDocs.bankReciept.bankRecieptDocName": {
            isVisible: false,
        },

        "supportingDocs.cheques": {
            isVisible: false,               
        }

    },


    actions: {

        new: {
            isAccessible: false,
        },

        edit: {

            isAccessible: false,
        },

        delete: {
            isAccessible: canModifyOrders,

            before: async (request, context) => {
                return deleteDepositBefore(request, context)
            }

        },
        bulkDelete: {
            isAccessible: canModifyOrders,
        },
        
    },

}


module.exports = {
    options, 
    resource: Deposit,
}