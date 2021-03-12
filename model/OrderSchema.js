const mongoose = require("mongoose");
const col_name = "Order";
const orderSchema = new mongoose.Schema({
    orderId:String,
    customerEmail:String,
    isApproved:Boolean,
    eBill:Number
});

mongoose.model(col_name, orderSchema);
module.exports = mongoose.model(col_name)