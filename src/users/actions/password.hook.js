const argon2 = require('argon2');
const AdminBro = require('admin-bro');




const passwordAfter = async (response) => {

// copys any password error to datbase's encryptedpassword error

    if (response.record && response.record.errors && response.record.errors.encryptedPassword) {
        response.record.errors.password = response.record.errors.encryptedPassword;

    }
    return response
}


const passwordBefore = async (request) => {

// intercepting request, replacing password with hashed encryptedPassword

    if (request.method === 'post') {
        const { password, ...otherParams } = request.payload

        if (password) {
            const encryptedPassword = await argon2.hash(password);

            return {
                ...request,
                payload: {
                    ...otherParams,
                    encryptedPassword,
                }
            }
        }
    }



    return request;
}

module.exports = { passwordAfter, passwordBefore }