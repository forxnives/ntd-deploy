const AdminBro = require('admin-bro');

const { passwordBefore, passwordAfter } = require('./actions/password.hook');
const { uploadImageBefore, uploadImageAfter } = require('./actions/upload-image.hook');

const { User, userSchema } = require('./userModel');



const canModifyUsers = ({ currentAdmin }) => currentAdmin && currentAdmin.userType === 'ADMIN';


const options = {

    properties: {
        encryptedPassword: {
            isVisible: false,
        },

        _id: {
            isVisible: false,
        },

        uploadImage: {
            components: {
                edit: AdminBro.bundle('./components/upload-image.edit.tsx'),
                list: AdminBro.bundle('./components/upload-image.list.tsx')
            }
        },
        displayPicPath: {
            isVisible: false
        },
        password: {
            type: "password",
        },
    },

    actions: {

        new: {

            before: async (request, context) => {

                const modifiedRequest = await passwordBefore(request);
                return uploadImageBefore(modifiedRequest, context);                     //chaining hooks

            },

            after: async (response, request, context) => {

                const modifiedResponse = await passwordAfter(response)
                return uploadImageAfter(modifiedResponse, request, context);                  //chaining hooks

            },

            isAccessible: canModifyUsers,
        },

        edit: {
            before: async (request, context) => {

                const modifiedRequest = await passwordBefore(request);
                return uploadImageBefore(modifiedRequest, context);                     //chaining hooks

            },

            after: async (response, request, context) => {

                const modifiedResponse = await passwordAfter(response)
                return uploadImageAfter(modifiedResponse, request, context);                  //chaining hooks

            },
            isAccessible: canModifyUsers,
        },

        delete:{
            isAccessible: canModifyUsers,
        },
        // show: {
        //     isVisible: false,
        // }

        bulkDelete: {
            isAccessible: canModifyUsers,
        }

        
    },

    parent: null


}


module.exports = {
    options, 
    resource: User,
}