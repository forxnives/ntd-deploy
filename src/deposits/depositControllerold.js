const {Deposit}  = require('./depositModel');
const { subInvoice } = require('./depositModel');
const { Invoice } = require('../invoices/invoiceModel')

if (typeof require !== 'undefined') XLSX = require('xlsx-style');



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
        // console.log(deposit)
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

        const datenum = (v, date1904) => {
            if(date1904) v+=1462;
            var epoch = Date.parse(v);
            return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000);
        }
        
        const sheet_from_array_of_arrays = (data, opts) => {
            var ws = {};
            var range = {s: {c:10000000, r:10000000}, e: {c:0, r:0 }};
            for(var R = 0; R != data.length; ++R) {
                for(var C = 0; C != data[R].length; ++C) {
                    if(range.s.r > R) range.s.r = R;
                    if(range.s.c > C) range.s.c = C;
                    if(range.e.r < R) range.e.r = R;
                    if(range.e.c < C) range.e.c = C;
                    var cell = {v: data[R][C] };
                    if(cell.v == null) continue;
                    var cell_ref = XLSX.utils.encode_cell({c:C,r:R});
                    
                    if(typeof cell.v === 'number') cell.t = 'n';
                    else if(typeof cell.v === 'boolean') cell.t = 'b';
                    else if(cell.v instanceof Date) {
                        cell.t = 'n'; cell.z = XLSX.SSF._table[14];
                        cell.v = datenum(cell.v);
                    }
                    else cell.t = 's';
                    
                    ws[cell_ref] = cell;
                }
            }


            if(range.s.c < 10000000) ws['!ref'] = XLSX.utils.encode_range(range);
            return ws;
        }
        
        /* original data */


        // var data = [[1,2,3],[true, false, null, "sheetjs"],["foo","bar",new Date("2014-02-19T14:30Z"), "0.3"], ["baz", null, "qux"]]

        const data = [[null], [null], [null], [null], [null], [null, 'DC7:H49eposit 1-BNS account'], [null, 'Cheque Breakdown'], [null, 'Date', 'Customer Code', 'Customers', 'Payment Type', 'Invoice #', 'Amount' ]]
        var ws_name = "SheetJS";


        
        function Workbook() {
            if(!(this instanceof Workbook)) return new Workbook();
            this.SheetNames = [];
            this.Sheets = {};
        }


///////////////////////////////////////////////////////////////////////////////

        const deposit = await Deposit.findById(depositId);

        const invoices = deposit.invoices.map(obj => (obj._id))

        console.log(invoices)

////////////////////////////////////////////////////////////////////////

        
        var wb = new Workbook(), ws = sheet_from_array_of_arrays(data);
        
        /* add worksheet to workbook */
        wb.SheetNames.push(ws_name);
        wb.Sheets[ws_name] = ws;

        // wb.Sheets[ws_name]["B6"].s = {alignment: {horizontal: 'center'}, fill: { patternType: 'solid', fgColor: { rgb: "FFFF00" } }, border: {top: {style: 'thick', color: { rgb: "FFFFAA00" }}, bottom: {style: 'thick', color: { rgb: "FFFFAA00" }}, left: {style: 'thick', color: { rgb: "FFFFAA00" }}, right: {style: 'thick', color: { rgb: "FFFFAA00" }} } } ;
        // wb.Sheets[ws_name]["C6"].s = {alignment: {horizontal: 'center'}, fill: { patternType: 'solid', fgColor: { rgb: "FFFF00" } }, border: {top: {style: 'thick', color: { rgb: "FFFFAA00" }}, bottom: {style: 'thick', color: { rgb: "FFFFAA00" }}  } } ;


        
        
        // wb.Sheets[ws_name]['!merges'] = [{s:{c:1, r:5}, e:{c:6, r:5}}]
        const workbook = {
            "SheetNames": [
              "Main"
            ],
            "Sheets": {
              "Main": {
                "!merges": [
                  {
                    "s": {
                      "c": 0,
                      "r": 0
                    },
                    "e": {
                      "c": 2,
                      "r": 0
                    }
                  }
                ],
                "A1": {
                  "v": "This is a submerged cell",
                  "s": {
                    "border": {
                      "left": {
                        "style": "thick",
                        "color": {
                          "auto": 1
                        }
                      },
                      "top": {
                        "style": "thick",
                        "color": {
                          "auto": 1
                        }
                      },
                      "bottom": {
                        "style": "thick",
                        "color": {
                          "auto": 1
                        }
                      }
                    }
                  },
                  "t": "s"
                },
                "B1": {
                  "v": "Pirate ship",
                  "s": {
                    "border": {
                      "top": {
                        "style": "thick",
                        "color": {
                          "auto": 1
                        }
                      },
                      "bottom": {
                        "style": "thick",
                        "color": {
                          "auto": 1
                        }
                      }
                    }
                  },
                  "t": "s"
                }
              }
            }
          }
        

        


        

        console.log(wb.Sheets[ws_name])

        XLSX.writeFile(workbook, './uploads/test.xlsx');

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