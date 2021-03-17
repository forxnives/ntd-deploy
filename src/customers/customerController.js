const {Customer} = require('./customerModel');


exports.createCustomer = async (email, userName, code, password, trn) => {
  try {
    const customer = await new Customer({
      userName,
      code,
      trn,
      email,
      password,
    })

    const savedCustomer = await customer.save()
    return savedCustomer

  } catch (err) {
    throw err
  }
}


exports.findUserByEmail = async (email) => {
  try {

    const customer = await Customer.findOne({ email })
    return customer;

  } catch(e) {
    throw e;
  }
}

exports.findUserById = async (id) => {
  try {
    const customer = await Customer.findById(id);
    // return everything but password
    return {
      id: customer._id,
      userName: customer.userName,
      orderCount: customer.orderCount,
      code: customer.code,

    }
  } catch(e) {
    throw e;
  }
}

