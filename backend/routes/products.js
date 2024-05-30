const { Product } = require("../models/product");
const { isAdmin } = require("../middleware/auth");
const cloudinary = require("../utils/cloudinary");



const router = require("express").Router();

//CREATE
router.post("/create", isAdmin, async (req, res) => {
  const { name, category, company, price, priceOff, stars, stock,description, info, reviews, colors, image } = req.body;

  try {
    // if (image) {
    //   const uploadedResponse = await cloudinary.uploader.upload(image, {
    //     upload_preset: "lanhnb2",
    //   });
      if (image) {
        const product = new Product({
          name,
          category,
          company,
          description,
          info,
          stock,
          reviews,
          stars,
          colors,
          price,
          priceOff,
          image,

        });
        const savedProduct = await product.save();
        res.status(200).send(savedProduct);
      }

    }
  catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

//Edit product

router.post("/", isAdmin, async (req, res) => {
  // const { name, brand, desc, price, image } = req.body;

  if (req.body.producImg) {
    try {


      const destroyResponse = await cloudinary.uploads.destroy(
        req.body.product.image.public_id
      );

      if (destroyResponse) {
        const uploadedResponse = await cloudinary.uploads.upload(
          req.body.producImg,
          {
            upload_preset: "lanhnb",
          }
        );

        if (uploadedResponse) {
          const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            {
              $set: {
                ...req.body.product,
                image: uploadedResponse,
              },
            },
            { new: true }
          );
          res.status(200).send(updatedProduct);
        }

      }
    }
    catch (err) {
      res.status(500).send(err);
    }

  }
  else {
    try {
      const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body.product,
        },
        { new: true }
      );
      res.status(200).send(updatedProduct);
    } catch (err) {
      res.status(500).send(err);
    }
  }

});


//DELETE

router.delete("/:id", isAdmin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).send("Product has been deleted...");
  } catch (error) {
    res.status(500).send(error);
  }
});

//GET ALL PRODUCTS

router.get("/", async (req, res) => {
  const qcategory = req.query.category;
  try {
    let products;

    if (qcategory) {
      products = await Product.find({
        category: qcategory,
      });
    } else {
      products = await Product.find();
    }

    res.status(200).send(products);
  } catch (error) {
    res.status(500).send(error);
  }
});

//GET PRODUCT

router.get("/find/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.status(200).send(product);
  } catch (error) {
    res.status(500).send(error);
  }
});

//UPDATE product

router.put("/:id", async (req, res) => {

    try {
      const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body.product,
        },
        { new: true }
      );
      res.status(200).send(updatedProduct);
    } catch (err) {
      res.status(500).send(err);
    }
  }
);




module.exports = router;
