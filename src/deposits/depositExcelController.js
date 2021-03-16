// Require library
var xl = require('excel4node');
 
exports.ExcelDepositCreate = async (chequeInvoicesUnreduced, cashInvoices, submissionDate) => {

    // adding up totals for later

    const cashTotal = cashInvoices.reduce((accumulator, invoice) => {

        return accumulator + invoice.amount
    }, 0) 

    const chequeTotal = chequeInvoicesUnreduced.reduce((accumulator, invoice) => {

        return accumulator + invoice.amount
    }, 0) 


    //adding invoices with the same cheque into one excel entry and adding invoice amounts

    const chequeInvoicesGRP = chequeInvoicesUnreduced.reduce((accumulator, invoice) => {

        if (accumulator.chequeNumbers.includes(invoice.paymentType)){

            accumulator.invoices = accumulator.invoices.map((_invoice, index) => {

                if (_invoice.paymentType === invoice.paymentType){
                    _invoice.invoiceNumber = invoice.invoiceNumber.concat(`, ${invoice.invoiceNumber}`) 
                    _invoice.amount = _invoice.amount + invoice.amount
                
                }
                return _invoice
            })
        } else {
            accumulator.invoices.push(invoice)
            accumulator.chequeNumbers.push(invoice.paymentType)
        }
        return accumulator
    },{
        chequeNumbers:[],
        invoices:[],
    } )

    let chequeInvoices = chequeInvoicesGRP.invoices




    // const cashInvoicesFiltered = cashInvoices.filter(object => (


    //     object.status === 'PAID'

    // ))



    







    // constructing excel workbook

    const wb = new xl.Workbook({  
        
        defaultFont: {
            size: 12,
            name: 'Times New Roman',
            color: '000000',
        },
    });
    

    const ws = wb.addWorksheet('Sheet 1');

    // creating reuseable styles

    const styleYellowHighlight = wb.createStyle({

        alignment: {
            horizontal: 'center'
        },

        fill: {
            type: 'pattern',
            patternType: 'solid',
            bgColor: '#FFFF00',
            fgColor: '#FFFF00',
          },

        border: {
        
            left: {
                style: 'medium', //§18.18.3 ST_BorderStyle (Border Line Styles) ['none', 'thin', 'medium', 'dashed', 'dotted', 'medium', 'double', 'hair', 'mediumDashed', 'dashDot', 'mediumDashDot', 'dashDotDot', 'mediumDashDotDot', 'slantDashDot']
                color: '#000000' // HTML style hex value
            },
            right: {
                style: 'medium',
                color: '#000000'
            },
            top: {
                style: 'medium',
                color: '#000000'
            },
            bottom: {
                style: 'medium',
                color: '#000000'
            },
        }
    });

    const styleThinBorders = wb.createStyle({

            border: {
            
                left: {
                    style: 'thin', //§18.18.3 ST_BorderStyle (Border Line Styles) ['none', 'thin', 'medium', 'dashed', 'dotted', 'medium', 'double', 'hair', 'mediumDashed', 'dashDot', 'mediumDashDot', 'dashDotDot', 'mediumDashDotDot', 'slantDashDot']
                    color: '#000000' // HTML style hex value
                },
                right: {
                    style: 'thin',
                    color: '#000000'
                },
                top: {
                    style: 'thin',
                    color: '#000000'
                },
                bottom: {
                    style: 'thin',
                    color: '#000000'
                },
            }
    })

    const styleBoldFont = wb.createStyle({
        font: {
            bold: true
        }
    })

    const styleRedFont = wb.createStyle({
        font: {
            color: '#FF0000'
        }
    })

    const stylePriceNumberFormat = wb.createStyle({
        numberFormat: '$#,##0.00; ($#,##0.00); -'
    })


    ws.column(2).setWidth(30);
    ws.column(3).setWidth(15);
    ws.column(4).setWidth(30);
    ws.column(5).setWidth(20);
    ws.column(6).setWidth(20);
    ws.column(7).setWidth(20);
   
    ws.cell(6, 2, 6, 7, true).string('DC7:H49eposit 1-BNS account').style(styleYellowHighlight).style(styleBoldFont);
    ws.cell(7, 2, 7, 7, true).string('Cheque Breakdown').style(styleThinBorders).style(styleBoldFont);

    ws.cell((8), 2).string('Date').style(styleThinBorders).style(styleBoldFont);
    ws.cell((8), 3).string('Customer Code').style(styleThinBorders).style(styleBoldFont);
    ws.cell((8), 4).string('Customers').style(styleThinBorders).style(styleBoldFont);
    ws.cell((8), 5).string('Payment Type').style(styleThinBorders).style(styleBoldFont);
    ws.cell((8), 6).string('Invoice #').style(styleThinBorders).style(styleBoldFont);
    ws.cell((8), 7).string('Amount').style(styleThinBorders).style(styleBoldFont);

    for (let i = 0; i < chequeInvoices.length; i++) {

        ws.cell((9+i), 2).string(submissionDate ? (submissionDate): ('')).style(styleThinBorders);
        ws.cell((9+i), 3).string(chequeInvoices[i].customerCode).style(styleThinBorders);
        ws.cell((9+i), 4).string(chequeInvoices[i].customer).style(styleThinBorders);
        ws.cell((9+i), 5).string(chequeInvoices[i].paymentType).style(styleThinBorders);
        ws.cell((9+i), 6).string(chequeInvoices[i].invoiceNumber).style(styleThinBorders);
        ws.cell((9+i), 7).number(chequeInvoices[i].amount).style(stylePriceNumberFormat).style(styleThinBorders);

    }

    ws.cell((9+chequeInvoices.length), 2).style(styleThinBorders);
    ws.cell((9+chequeInvoices.length), 3).style(styleThinBorders);
    ws.cell((9+chequeInvoices.length), 4).style(styleThinBorders);
    ws.cell((9+chequeInvoices.length), 5).style(styleThinBorders);
    ws.cell((9+chequeInvoices.length), 6).style(styleThinBorders);
    ws.cell((9+chequeInvoices.length), 7).style(styleThinBorders);

    ws.cell((10+chequeInvoices.length), 2, (10+chequeInvoices.length), 7, true).string('Cash Breakdown').style(styleYellowHighlight).style(styleBoldFont);

    for (let i = 0; i < cashInvoices.length; i++) {

        ws.cell((11+chequeInvoices.length + i), 2).string(submissionDate ? (submissionDate): ('')).style(styleThinBorders)
        ws.cell((11+chequeInvoices.length + i), 3).string(cashInvoices[i].customerCode).style(styleThinBorders);
        ws.cell((11+chequeInvoices.length + i), 4).string(cashInvoices[i].customer).style(styleThinBorders);
        ws.cell((11+chequeInvoices.length + i), 5).string(cashInvoices[i].paymentType.toLowerCase()).style(styleThinBorders);
        ws.cell((11+chequeInvoices.length + i), 6).string(cashInvoices[i].invoiceNumber).style(styleThinBorders);
        ws.cell((11+chequeInvoices.length + i), 7).number(cashInvoices[i].amount).style(stylePriceNumberFormat).style(styleThinBorders);
        
    }

    ws.cell((12+cashInvoices.length), 2).style(styleThinBorders);
    ws.cell((12+cashInvoices.length), 3).style(styleThinBorders);
    ws.cell((12+cashInvoices.length), 4).style(styleThinBorders);
    ws.cell((12+cashInvoices.length), 5).style(styleThinBorders);
    ws.cell((12+cashInvoices.length), 6).style(styleThinBorders);
    ws.cell((12+cashInvoices.length), 7).style(styleThinBorders);

    ws.cell((13+cashInvoices.length), 2).string('Total Cash').style(styleThinBorders).style(styleBoldFont);
    ws.cell((13+cashInvoices.length), 3).style(styleThinBorders);
    ws.cell((13+cashInvoices.length), 4).style(styleThinBorders);
    ws.cell((13+cashInvoices.length), 5).style(styleThinBorders);
    ws.cell((13+cashInvoices.length), 6).style(styleThinBorders);
    ws.cell((13+cashInvoices.length), 7).number(cashTotal).style(stylePriceNumberFormat).style(styleThinBorders).style(styleBoldFont);

    ws.cell((14+cashInvoices.length), 2).string('Total Cheque').style(styleThinBorders).style(styleBoldFont);
    ws.cell((14+cashInvoices.length), 3).style(styleThinBorders);
    ws.cell((14+cashInvoices.length), 4).style(styleThinBorders);
    ws.cell((14+cashInvoices.length), 5).style(styleThinBorders);
    ws.cell((14+cashInvoices.length), 6).style(styleThinBorders);
    ws.cell((14+cashInvoices.length), 7).number(chequeTotal).style(stylePriceNumberFormat).style(styleThinBorders).style(styleBoldFont);

    ws.cell((15+cashInvoices.length), 2).string('Total').style(styleThinBorders).style(styleBoldFont).style(styleRedFont);
    ws.cell((15+cashInvoices.length), 3).style(styleThinBorders);
    ws.cell((15+cashInvoices.length), 4).style(styleThinBorders);
    ws.cell((15+cashInvoices.length), 5).style(styleThinBorders);
    ws.cell((15+cashInvoices.length), 6).style(styleThinBorders);
    ws.cell((15+cashInvoices.length), 7).number(chequeTotal+cashTotal).style(stylePriceNumberFormat).style(styleThinBorders).style(styleBoldFont).style(styleRedFont);

    wb.write('./uploads/Excel.xlsx');
} 