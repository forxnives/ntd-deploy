const path = require('path');
const fs = require ('fs')


const uploadImageAfter = async (response, request, context) => {

    const {record, uploadImage} =  context;


    if (record.isValid() && uploadImage) {

        const filePath = path.join('uploads', record.id().toString(), uploadImage.name);
        await fs.promises.mkdir(path.dirname(filePath), {recursive: true});

        const is = fs.createReadStream(uploadImage.path);
        const os = fs.createWriteStream(filePath);

        is.pipe(os);
        is.on('end',function() {
            fs.unlinkSync(uploadImage.path);
        });


        await record.update({displayPicPath: `/${filePath}` });
        
    }
    return response;
}


const uploadImageBefore = async (request, context) => {

// intercepting request, replacing password with hashed encryptedPassword

    if (request.method === 'post') {
        const { uploadImage, ...otherParams } = request.payload;

        context.uploadImage = uploadImage;

        return {
            ...request,
            payload: otherParams,
        };
    }



    return request;
}

module.exports = { uploadImageAfter, uploadImageBefore }