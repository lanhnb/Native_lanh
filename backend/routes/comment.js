const { Comment } = require("../models/comment");
const { auth, isUser, isAdmin } = require("../middleware/auth");
const moment = require("moment");
const router = require("express").Router();


//GET ORDER

router.get("/", isAdmin, async(req,res)=>{
  const query = req.query.new

  try{
    const comment = query ? await Comment.find().sort({id:-1}).limit(4):
    await Comment.find().sort({_id:-1});

    res.status(200).send(comment);
  }catch(err){
    console.log(err)
    res.status(500).send(err)
  }

})

router.post("/", async (req, res) => {
  const newComment = new Comment({
   emailorPhone: req.body.emailorPhone,
   namec: req.body.namec,
   comment: req.body.comment,
   rate: req.body.rate,


  });

  try {
    const savedComment = await newComment.save();
    res.status(200).send(savedComment);
  } catch (err) {
    res.status(500).send(err);
  }
});

//UPDATE Order
router.put("/:id", isAdmin, async (req, res) => {
  try {
    const updatedComment = await Comment.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).send(updatedComment);
  } catch (err) {
    res.status(500).send(err);
  }
});


//DELETE
router.delete("/:id", isAdmin, async (req, res) => {
  try {
    const deleteComment = await Comment.findByIdAndDelete(req.params.id);
    res.status(200).send(deleteComment);
  } catch (err) {
    res.status(500).send(err);
  }
});

//GET USER ORDERS
router.get("/find/:userId", isUser, async (req, res) => {
  try {
    const coment = await Comment.find({ userId: req.params.userId });
    res.status(200).send(coment);
  } catch (err) {
    res.status(500).send(err);
  }
});


//GET AN ORDERS
router.get("/findOne/:id", auth, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (comment) {
      res.send(comment);
    } else {
      res.status(404).send({ message: 'Comment Not Found' });
    }


  } catch (err) {
    res.status(500).send(err);
    console.log(err)
  }
});
  router.get('/:id', auth, async (req, res) => {
      const comment = await Comment.findById(req.params.id);
      if (comment) {
        res.send(comment);
      } else {
        res.status(404).send({ message: 'Comment Not Found' });
      }
    }
  );
module.exports = router;
