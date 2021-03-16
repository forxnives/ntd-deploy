const {Deposit}  = require('./depositModel');
const { subInvoice } = require('./depositModel');
const { Invoice } = require('../invoices/invoiceModel')
const archiver = require('archiver');
const { ExcelDepositCreate } = require('./depositExcelController')





const fs = require('fs');
const rimraf = require("rimraf");
// const { default: ChequeSupportinDocs } = require('./components/supportingdocs.cheques');



exports.bulkCreateDeposit = async (data) => {

    try {
        const newDeposit = new Deposit(data);
        const deposit = await newDeposit.save();
        const invoices = [];

        for ( let i = 0; i < data.invoices.length; i++) {
        
                let invoice = await Invoice.findByIdAndUpdate(
                  { _id: data.invoices[i].invoiceId },
                  { depositId: deposit._id }
                );
        }

        return deposit;

    }catch (err){

        throw err;

    }

} 

exports.bulkAddToDeposit = async (id, payload) => {

    try {

        const deposit = await Deposit.findById(id)
        const existingInvoiceIds = deposit.invoices.map(invoice => (invoice.invoiceId))

        for ( let i = 0; i < payload.invoices.length; i++) {

            if (!existingInvoiceIds.includes(payload.invoices[i].invoiceId)){

                const newSubInvoice = new subInvoice(payload.invoices[i]);
                deposit.invoices.push(newSubInvoice);

                let invoice = await Invoice.findByIdAndUpdate(
                    { _id: payload.invoices[i].invoiceId },
                    { depositId: id }
      
                );
            }
        }

        const savedDeposit = await deposit.save()
        return savedDeposit;

    }catch (err){

        throw err;

    }

} 



exports.addDocToDepositRecord = async (file, recParams, documentType)  => {


    try {

        const deposit = await Deposit.findById(recParams._id);
        
        depositObj = deposit.toObject();

        const pathSplitArray = file.destination.split('/');
        const pathNumber = pathSplitArray[pathSplitArray.length-1];


        if (documentType === 'SIGNATURE' && depositObj.signature) {                      //if  document already exists..
            throw new Error('Write Failure')
        };

        if (documentType === 'BANKRECIPET' && depositObj.bankReciept){
            throw new Error('Write Failure')
        }


        if (documentType === 'SIGNATURE') {

            deposit.supportingDocs.signature.signatureDocPath = pathNumber;
            deposit.supportingDocs.signature.signatureDocName = file.originalname;

        };

        if (documentType === 'BANKRECIEPT') {

            deposit.supportingDocs.bankReciept.bankRecieptDocPath = pathNumber;
            deposit.supportingDocs.bankReciept.bankRecieptDocName = file.originalname;

        };


        savedDeposit = deposit.save()

        return savedDeposit

    } catch(err){
        return err
    }
}



exports.deleteDepositDocUpdateRecord = async (docNumber, depositId, fileName, documentType) => {

    try {

        fs.unlink(`./uploads/${depositId}/${documentType}/${docNumber}/${fileName}`, function (err) {
            if (err) throw err;
            // if no error, file has been deleted successfully
            console.log('File deleted!');
        }); 


        rimraf(`./uploads/${depositId}/${documentType}/${docNumber}`, function () { console.log("done"); });

        
        const deposit = await Deposit.findById(depositId)


        if (documentType === 'signature') {
            deposit.supportingDocs.signature = null
            
        }

        if (documentType === 'bankreciept') {
            deposit.supportingDocs.bankReciept = null
            
        }

        savedDeposit = deposit.save()
        return savedDeposit

        
    } catch (err) {
        console.log(err)
    }
}


exports.addDateToDeposit = async (date, depositId) => {
    try {

        const deposit = await Deposit.findById(depositId)
        deposit.submissionDate = date
        savedDeposit = deposit.save()       
        return savedDeposit

    } catch (err){
        throw err
    }
}

exports.addDepositStatusToDeposit = async (status, depositId) => {
    try {

        const deposit = await Deposit.findById(depositId)
        deposit.depositStatus = status
        savedDeposit = deposit.save()       
        return savedDeposit


    } catch (err) {
        throw err
    }
}



exports.removeInvoiceFromDeposit = async (invoiceId, depositId) => {

    try {

        let invoice = await Invoice.findByIdAndUpdate(
            { _id: invoiceId },
            { depositId: null }

        );

        const savedInvoice = await invoice.save()

        let deposit = await Deposit.findById(depositId);

        if (deposit.invoices.length === 1) {

            Deposit.deleteOne({_id: depositId }, function (err) { 
                if (err) {
                    console.log(err)
                }
            })
        } else if (deposit.invoices.length > 1){
            deposit.invoices = deposit.invoices.filter(invoice => 
                (invoice.invoiceId !== invoiceId)
            )

            const savedDeposit = deposit.save()
        }

        return savedInvoice;


    } catch (err) {
        console.log(err)
    }
}

exports.createExcelFile = async (depositId) => {

    try {

      const chequeInvoices = [];
      const cashInvoices = [];

      const chequeTotal = 0;
      const cashTotal = 0;

      

///////////////////////////////////////////////////////////////////////////////

        const deposit = await Deposit.findById(depositId);
        const invoices = deposit.invoices.map(obj => (obj.invoiceId))

        for (let i=0 ; i < invoices.length ; i++) {
          
          const invoice = await Invoice.findById(invoices[i]);

          if (!invoice.paymentDoc.chequeNumber && invoice.status === 'PAID' && invoice.paymentMethod === 'CASH'){

            let price = invoice.price

            if (invoice.returned && invoice.returned.returnAmount) {
                price = price - invoice.returned.returnAmount
                

            } 

              
            cashInvoices.push({
              customerCode: invoice.customerCode,
              customer: invoice.customer,
              paymentType: 'CASH',
              invoiceNumber: invoice.number,
              amount:price
            })

            // cashTotal = cashTotal + invoice.price
          }else {

            if (invoice.paymentDoc.paymentDocType === 'CHEQUE'){

                let price = invoice.price

                if (invoice.returned && Object.keys(invoice.returned).length === 0) {
                    price = price - invoice.returned.returnAmount
    
                } 
              
              chequeInvoices.push({
                customerCode: invoice.customerCode,
                customer: invoice.customer,
                paymentType: invoice.paymentDoc.chequeNumber,
                invoiceNumber: invoice.number,
                amount: price
              })

              
            }

          }

          
        }


        ExcelDepositCreate(chequeInvoices, cashInvoices, deposit.submissionDate)    

////////////////////////////////////////////////////////////////////////

      
        return depositId

    } catch (err) {
        throw err;
    }
}


exports.queryDeposits = async () => {

    try {

        const deposits = await Deposit.find({depositStatus: 'PENDING'})

        return deposits;

    }catch (err){

        throw err;

    }

} 

exports.depositDocsZip = async (depositId) => {


    try {
        const deposit = await Deposit.findById(depositId)


        const _dir = `./uploads/deposits/`;

        if (!fs.existsSync(_dir)){
            fs.mkdirSync(_dir);
        }

        const __dir = `uploads/deposits/${depositId}`

        if (!fs.existsSync(__dir)){
            fs.mkdirSync(__dir);
        }


        // create a file to stream archive data to.
        const output = fs.createWriteStream(__dir + '/deposit.zip');
        const archive = archiver('zip', {
        zlib: { level: 9 } // Sets the compression level.
        });

        // listen for all archive data to be written
        // 'close' event is fired only when a file descriptor is involved
        output.on('close', function() {

        });

        // This event is fired when the data source is drained no matter what was the data source.
        // It is not part of this library but rather from the NodeJS Stream API.
        // @see: https://nodejs.org/api/stream.html#stream_event_end
        output.on('end', function() {
        
        });

        // good practice to catch warnings (ie stat failures and other non-blocking errors)
        archive.on('warning', function(err) {
        if (err.code === 'ENOENT') {
            // log warning
        } else {
            // throw error
            throw err;
        }
        });

        // good practice to catch this error explicitly
        archive.on('error', function(err) {
        throw err;
        });

        // pipe archive data to the file
        archive.pipe(output);


        archive.file(`./uploads/Excel.xlsx`, { name: `Excel.xlsx` });

        if (deposit.supportingDocs.signature){
            archive.file(`./uploads/${deposit._id}/signature/${deposit.supportingDocs.signature.signatureDocPath}/${deposit.supportingDocs.signature.signatureDocName}`, { name: `${deposit.supportingDocs.signature.signatureDocName}` });
        }

        if (deposit.supportingDocs.bankReciept){
            archive.file(`./uploads/${deposit._id}/bankreciept/${deposit.supportingDocs.bankReciept.bankRecieptDocPath}/${deposit.supportingDocs.bankReciept.bankRecieptDocName}`, { name: `${deposit.supportingDocs.bankReciept.bankRecieptDocName}` });
        }


        for (let i=0 ; i < deposit.invoices.length ; i++) {

            
            const invoice = await Invoice.findById(deposit.invoices[i].invoiceId)


            if (invoice.paymentDoc.paymentDocType){
                
                archive.file(`./uploads/${invoice._id}/${invoice.paymentDoc.paymentDocType.toLowerCase()}/${invoice.paymentDoc.paymentDocPath}/${invoice.paymentDoc.paymentDocName}`, { name: `${invoice.paymentDoc.paymentDocName}` });
            }

            if (invoice.returned){
                archive.file(`./uploads/${invoice._id}/return/${invoice.returned.returnDocPath}/${invoice.returned.returnDocName}`, { name: `${invoice.returned.returnDocName}` });
            }

            if (invoice.cancelled) {
                archive.file(`./uploads/${invoice._id}/cancel/${invoice.cancelled.cancelDocPath}/${invoice.cancelled.cancelDocName}`, { name: `${invoice.cancelled.cancelDocName}` });
            }

        }

        archive.finalize();



    } catch (err) {

        throw err;

    }



}