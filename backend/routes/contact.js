const {Contact} = require("../models/contact");
const {auth, isUser, isAdmin} = require("../middleware/auth");
const moment = require("moment");

const router = require("express").Router();

//GET ALL USER

router.get("/", async(req, res) =>{
    try{
        const contact = await Contact.find().sort({_id:-1});
        res.status(200).send(contact);
    }catch(err){
        res.status(500).send(err);
    }
});
// CREATE CONTACT
router.post("/", auth, async (req, res) => {
    const newContact = new Contact({
      namex: req.body.namex,
      email: req.body.email,
      phone: req.body.phone,
      desc: req.body.desc,


    });

    try {
      const savedContact = await newContact.save();
      res.status(200).send(savedContact);
    } catch (err) {
      res.status(500).send(err);
    }
  });
//GET USER

router.get("/find/:id", isUser, async(req, res) =>{
    try{
        const contact = await Contact.findById(req.params.id);
        res.status(200).send(contact);
    }catch(err){
        res.status(500).send(err);

    }
});


//DELETE CONTACT

router.delete("/:id", isAdmin, async(req, res) =>{
    try{
        const deleteContact = await Contact.findByIdAndDelete(req.params.id);
        res.status(200).send(deleteContact);
    }catch(err){
        res.status(500).send(error);
    }
});

//UPDATE contact
router.put("/:id", isAdmin, async (req, res) => {
    try {
      const updatedContact = await Contact.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).send(updatedContact);
    } catch (err) {
      res.status(500).send(err);
    }
  });



module.exports = router;