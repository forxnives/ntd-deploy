const mongoose = require('mongoose');
const { Schema } = mongoose;
const argon2 = require('argon2');



const customerSchema = new Schema({

    userName: String,
    code: String,
    orders: [String],
    invoices: [String],
    trn: String,
    email: String,
    password: String,

    
    orderCount: {
        type: Number,
        default: 0
    },



})

customerSchema.pre('save', async function(next) {
    const user = this;
    
    try {
      if (user.isModified('password') || user.isNew) {
        // validate password is long enough and has special characters
        const hashedPassword = await argon2.hash(user.password);
        user.password = hashedPassword;
      }
      next();
    } catch(e) {

      next(e);
    }
  })
  
  // comparison function for when user logins
  // password in this case will be PLAINTEXT, readable password
  customerSchema.methods.comparePasswords = function(password) {
    const user = this;

    return argon2.verify(user.password, password);
  }





const Customer = mongoose.model('Customer', customerSchema);
module.exports = { customerSchema, Customer };