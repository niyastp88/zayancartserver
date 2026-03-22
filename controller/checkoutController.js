const Checkout = require("../models/Checkout");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const Order = require("../models/Order");
const razorpay = require("../utils/razorpay");
const crypto = require("crypto");

// Create new checkout session
exports.createCheckout = async (req, res) => {
  const { checkoutItems, shippingAddress, paymentMethod, totalPrice } =
    req.body;

  if (!checkoutItems) {
    return res.status(400).json({ message: "no items in checkout" });
  }
  if (!shippingAddress) {
    return res.status(400).json({ message: "Shipping address required" });
  }
  const { firstname, lastName, address, city, postalcode, state, phone } =
    shippingAddress;

  if (!firstname?.trim())
    return res.status(400).json({ message: "First name is required" });

  if (!address?.trim())
    return res.status(400).json({ message: "Address is required" });

  if (!city?.trim())
    return res.status(400).json({ message: "City is required" });
  const postalRegex = /^[0-9]{6}$/;
  if (!postalRegex.test(postalcode)) {
    return res.status(400).json({
      message: "Postal code must be exactly 6 digits",
    });
  }

  if (!state?.trim())
    return res.status(400).json({ message: "State is required" });

  const phoneRegex = /^[0-9]{10}$/;
  if (!phoneRegex.test(phone)) {
    return res.status(400).json({
      message: "Phone number must be exactly 10 digits",
    });
  }

  try {
    // Create a new checkout session
    const newCheckout = await Checkout.create({
      user: req.user._id,
      checkoutItems: checkoutItems,
      shippingAddress,
      paymentMethod,
      totalPrice,
      paymentMethod,
      totalPrice,
      paymentStatus: "pending",
      isPaid: false,
    });

    res.status(201).json(newCheckout);
  } catch (error) {
    console.error("Error Creating checkout session", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Mark checkout as paid
exports.markCheckoutPaid = async (req, res) => {
  const { paymentStatus, paymentDetails } = req.body;

  try {
    const checkout = await Checkout.findById(req.params.id);
    if (!checkout) {
      return res.status(404).json({ message: "Checkout not found" });
    }

    if (paymentStatus === "paid") {
      ((checkout.isPaid = true),
        (checkout.paymentStatus = paymentStatus),
        (checkout.paymentDetails = paymentDetails),
        (checkout.paidAt = Date.now()),
        await checkout.save());

      res.status(200).json(checkout);
    } else {
      res.status(400).json({ message: "Invalid Payment Status" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Finalize checkout and create order
exports.finalizeCheckout = async (req, res) => {
  try {
    const checkout = await Checkout.findById(req.params.id);
    if (!checkout) {
      return res.status(404).json({ message: "Checkout not found" });
    }

    //  Already finalized guard
    if (checkout.isFinalized) {
      return res.status(400).json({ message: "Checkout already finalized" });
    }

    //  Payment not completed
    if (!checkout.isPaid) {
      return res.status(400).json({ message: "Checkout is not paid" });
    }

    // STOCK VALIDATION & REDUCTION
    for (const item of checkout.checkoutItems) {
      const product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({
          message: `Product not found: ${item.productId}`,
        });
      }

      if (product.countInStock < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for ${product.name}. Only ${product.countInStock} left.`,
        });
      }
    }

    //  actual stock update
    for (const item of checkout.checkoutItems) {
      const product = await Product.findById(item.productId);

      product.countInStock -= item.quantity;
      await product.save();
    }

    // CREATE FINAL ORDER
    const finalOrder = await Order.create({
      user: checkout.user,
      orderItems: checkout.checkoutItems,
      shippingAddress: checkout.shippingAddress,
      paymentMethod: checkout.paymentMethod,
      totalPrice: checkout.totalPrice,
      isPaid: true,
      paidAt: checkout.paidAt,
      isDelivered: false,
      paymentStatus: "paid",
      paymentDetails: checkout.paymentDetails,
    });

    // FINALIZE CHECKOUT
    checkout.isFinalized = true;
    checkout.finalizedAt = Date.now();
    await checkout.save();

    // CLEAR USER CART
    await Cart.findOneAndDelete({ user: checkout.user });

    res.status(201).json(finalOrder);
  } catch (error) {
    console.error("Finalize error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Create Razorpay order
exports.createRazorpayOrder = async (req, res) => {
  const checkout = await Checkout.findById(req.params.id);
  if (!checkout) {
    return res.status(404).json({ message: "Checkout not found" });
  }

  const options = {
    amount: checkout.totalPrice * 100,
    currency: "INR",
    receipt: `checkout_${checkout._id}`,
  };

  const order = await razorpay.orders.create(options);
  res.json(order);
};

// Verify Razorpay payment
exports.verifyRazorpayPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    return res.status(400).json({ message: "Payment verification failed" });
  }

  // REUSE EXISTING PAY LOGIC
  req.body = {
    paymentStatus: "paid",
    paymentDetails: req.body,
  };

  // call existing pay route logic
  const checkout = await Checkout.findById(req.params.id);
  checkout.isPaid = true;
  checkout.paymentStatus = "paid";
  checkout.paymentDetails = req.body;
  checkout.paidAt = Date.now();
  await checkout.save();

  res.json(checkout);
};
