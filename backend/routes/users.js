const {User} = require("../models/user");
const {auth, isUser, isAdmin} = require("../middleware/auth");
const moment = require("moment");

const router = require("express").Router();

//GET ALL USER

router.get("/", isAdmin, async(req, res) =>{
    try{
        const users = await User.find().sort({_id:-1});
        res.status(200).send(users);
    }catch(err){
        res.status(500).send(err);
    }
});


//GET USER

router.get("/find/:id", isUser, async(req, res) =>{
    try{
        const users = await User.findById(req.params.id);
        res.status(200).send(users);
    }catch(err){
        res.status(500).send(err);

    }
});


// Update USER

router.put("/:id", isUser, async(req, res) =>{
    try{
        const users = await User.findById(req.params.id);
        if( !(users.email === req.email)){
            const emailInUse = await User.findOne({email: req.body.email});
            if(emailInUse)
            return res.status(400).send("That email is already taken,..");

        }
        if(req.body.password && user){
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.body.password, salt);

            users.password = hashedPassword;
        }

        const updateUser = await User.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                email: req.body.email,
                isAdmin: req.body.isAdmin,
                password: users.password,
            },
            {new: true}
        );

        res.status(200).send({
            _id: updateUser.id,
            name:updateUser.name,
            email:updateUser.email,
            isAdmin: updateUser.isAdmin,
        });


    }catch(err){
        res.status(500).send(err);
    }
});



//DELETE USER

router.delete("/:id", isAdmin, async(req, res) =>{
    try{
        const deleteUsers = await User.findByIdAndDelete(req.params.id);
        res.status(200).send(deleteUsers);
    }catch(err){
        res.status(500).send(error);
    }
});


//Get User stast
router.get("/stats", async(req, res) =>{
    const previousMonth = moment()
        .month(moment().month()-1)
        .set("date", 1)
        .format("YYYY-MM-DD HH:mm:ss");

    try{
        const users = await User.aggregate([
            {
                $match: {createdAt : {$gte: new Date(previousMonth)}},
            },
        {
            $project: {
                month: {$month: "$createdAt"},
            },
        },
        {
            $group:{
                _id: "$month",
                total: {$sum: 1},

            },
        },
    ]);
        res.status(200).send(users)

    }
    catch (err){
        console.log(err);
        res.status(500).send(err);

    }
    // res.send(previousMonth);

});
module.exports = router;