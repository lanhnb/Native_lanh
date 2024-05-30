const { Order } = require("../models/order");
const { auth, isUser, isAdmin } = require("../middleware/auth");
const moment = require("moment");
const router = require("express").Router();

//CREATE

// createOrder is fired by stripe webhook
// example endpoint
// payos

// router.post("/create", async function (req, res) {
//   const { description, returnUrl, cancelUrl, amount } = req.body;
//   const body = {
//     orderCode: Number(String(new Date().getTime()).slice(-6)),
//     amount,
//     description,
//     cancelUrl,
//     returnUrl
//   };

//   try {
//     const paymentLinkRes = await payOS.createPaymentLink(body);

//     return res.json({
//       error: 0,
//       message: "Success",
//       data: {
//         bin: paymentLinkRes.bin,
//         checkoutUrl: paymentLinkRes.checkoutUrl,
//         accountNumber: paymentLinkRes.accountNumber,
//         accountName: paymentLinkRes.accountName,
//         amount: paymentLinkRes.amount,
//         description: paymentLinkRes.description,
//         orderCode: paymentLinkRes.orderCode,
//         qrCode: paymentLinkRes.qrCode,
//       },
//     });
//   } catch (error) {
//     console.log(error);
//     return res.json({
//       error: -1,
//       message: "fail",
//       data: null,
//     });
//   }
// });

// router.get("/:orderId", async function (req, res) {
//   try {
//     const order = await payOS.getPaymentLinkInfomation(req.params.orderId);
//     if (!order) {
//       return res.json({
//         error: -1,
//         message: "failed",
//         data: null,
//       });
//     }
//     return res.json({
//       error: 0,
//       message: "ok",
//       data: order,
//     });
//   } catch (error) {
//     console.log(error);
//     return res.json({
//       error: -1,
//       message: "failed",
//       data: null,
//     });
//   }
// });

// router.put("/:orderId", async function (req, res) {
//   try {
//     const { orderId } = req.params;
//     const body = req.body;
//     const order = await payOS.cancelPaymentLink(orderId, body.cancellationReason);
//     if (!order) {
//       return res.json({
//         error: -1,
//         message: "failed",
//         data: null,
//       });
//     }
//     return res.json({
//       error: 0,
//       message: "ok",
//       data: order,
//     });
//   } catch (error) {
//     console.error(error);
//     return res.json({
//       error: -1,
//       message: "failed",
//       data: null,
//     });
//   }
// });

// router.post("/confirm-webhook", async (req, res) => {
//   const { webhookUrl } = req.body;
//   try {
//     await payOS.confirmWebhook(webhookUrl);
//     return res.json({
//       error: 0,
//       message: "ok",
//       data: null,
//     });
//   } catch (error) {
//     console.error(error);
//     return res.json({
//       error: -1,
//       message: "failed",
//       data: null,
//     });
//   }
// });


// End payos
//Get order stats
router.get("/stats", async(req, res) =>{
  const previousMonth = moment()
      .month(moment().month()-1)
      .set("date",1)
      .format("YYYY-MM-DD HH:mm:ss");
    try{
      const orders = await Order.aggregate([
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
      res.status(200).send(orders)
  }
  catch (err){
      console.log(err);
      res.status(500).send(err);
  }
 });


//GET ORDER

router.get("/", isAdmin, async(req,res)=>{
  const query = req.query.new

  try{
    const orders = query ? await Order.find().sort({id:-1}).limit(4):
    await Order.find().sort({_id:-1});

    res.status(200).send(orders);
  }catch(err){
    console.log(err)
    res.status(500).send(err)
  }

})

router.post("/create", auth, async (req, res) => {
  const newOrder = new Order({
    orderItems: req.body.orderItems,
    shippingAddress: req.body.shippingAddress,
    paymentMethod: req.body.paymentMethod,
    itemsPrice: req.body.itemsPrice,
    shippingPrice: req.body.shippingPrice,
    taxPrice: req.body.taxPrice,
    totalPrice: req.body.totalPrice,
    user: req.user._id,
  });

  try {
    const savedOrder = await newOrder.save();
    res.status(200).send(savedOrder);
  } catch (err) {
    res.status(500).send(err);
  }
});

//UPDATE Order
router.put("/:id", isAdmin, async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).send(updatedOrder);
  } catch (err) {
    res.status(500).send(err);
  }
});


//DELETE
router.delete("/:id", isAdmin, async (req, res) => {
  try {
    const deleteOrders = await Order.findByIdAndDelete(req.params.id);
    res.status(200).send(deleteOrders);
  } catch (err) {
    res.status(500).send(err);
  }
});

//GET USER ORDERS
router.get("/find/:userId", isUser, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId });
    res.status(200).send(orders);
  } catch (err) {
    res.status(500).send(err);
  }
});


//GET AN ORDERS
router.get("/findOne/:id", auth, isAdmin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      res.send(order);
    } else {
      res.status(404).send({ message: 'Order Not Found' });
    }


  } catch (err) {
    res.status(500).send(err);
    console.log(err)
  }
});





//GET ALL ORDERS

// router.get("/", isAdmin, async (req, res) => {
//   const query = req.query.new;
//   try {
//     const orders = query
//       ? await Order.find().sort({id: -1}).limit(4)
//       : await Order.find().sort( {id:-1});
//     res.status(200).send(orders);
//   } catch (err) {
//     res.status(500).send(err);
//   }
// });

// GET MONTHLY INCOME cho isAdmin vao sau

router.get("/income", async (req, res) => {
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

  try {
    const income = await Order.aggregate([
      { $match: { createdAt: { $gte: previousMonth } } },
      {
        $project: {
          month: { $month: "$createdAt" },
          sales: "$totalPrice",
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: "$sales" },
        },
      },
    ]);
    res.status(200).send(income);

  } catch (err) {
    res.status(500).send(err);
  }
});


// GET I weekend sales

router.get("/week", async(req, res) =>{
  const last7Days = moment()
      .day(moment().day()-7)
      .set("date",1)
      .format("YYYY-MM-DD HH:mm:ss");

  try{
      const income = await Order.aggregate([
          {
              $match: {createdAt : {$gte: new Date(last7Days)}},
          },
      {
          $project: {
              day: {$dayOfWeek:"$createdAt"},
              sales: "$totalPrice",
          },
      },
      {
          $group:{
              _id: "$day",
              total: {$sum: "$sales"},

          },
      },
  ]);
      res.status(200).send(income)

  }
  catch (err){
      console.log(err);
      res.status(500).send(err);

  }


});

router.put('/:id/deliver', auth, async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
      await order.save();
      res.send({ message: 'Order Delivered' });
    } else {
      res.status(404).send({ message: 'Order Not Found' });
    }
  });

router.put('/:id/pay', auth, async (req, res) => {
    const order = await Order.findById(req.params.id).populate(
      'user',
      'email name'
    );
    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.email_address,
      };

      const updatedOrder = await order.save();
      mailgun()
        .messages()
        .send(
          {
            from: 'Amazona <amazona@mg.yourdomain.com>',
            to: `${order.user.name} <${order.user.email}>`,
            subject: `New order ${order._id}`,
            html: payOrderEmailTemplate(order),
          },
          (error, body) => {
            if (error) {
              console.log(error);
            } else {
              console.log(body);
            }
          }
        );

      res.send({ message: 'Order Paid', order: updatedOrder });
    } else {
      res.status(404).send({ message: 'Order Not Found' });
    }
  });
  router.get('/:id', auth, async (req, res) => {
      const order = await Order.findById(req.params.id);
      if (order) {
        res.send(order);
      } else {
        res.status(404).send({ message: 'Order Not Found' });
      }
    }
  );
module.exports = router;
