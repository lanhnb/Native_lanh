const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    namex: { type: String, required: true},
    email: { type: String,required: true},
    phone: { type: String,required: true},
    desc: { type: String,required: true},
    isCall: { type: Boolean, default: false },
     },


  { timestamps: true }
);

const Contact = mongoose.model("Contact", contactSchema);

exports.Contact = Contact;
