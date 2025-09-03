function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";
import axios from "axios";
import mongoose from "mongoose";
mongoose.model("User", userModel.schema);
var stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Place order with COD
var placeOrder = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(req, res) {
    var _req$body, userId, items, amount, address, orderData, newOrder, _t;
    return _regenerator().w(function (_context) {
      while (1) switch (_context.p = _context.n) {
        case 0:
          _context.p = 0;
          _req$body = req.body, userId = _req$body.userId, items = _req$body.items, amount = _req$body.amount, address = _req$body.address;
          if (mongoose.Types.ObjectId.isValid(userId)) {
            _context.n = 1;
            break;
          }
          return _context.a(2, res.status(400).json({
            success: false,
            message: "Invalid userId format"
          }));
        case 1:
          if (!(!items || !amount || !address)) {
            _context.n = 2;
            break;
          }
          return _context.a(2, res.status(400).json({
            success: false,
            message: "Missing required fields"
          }));
        case 2:
          orderData = {
            userId: userId,
            items: items,
            address: address,
            amount: amount,
            paymentMethod: "COD",
            payment: false,
            date: new Date()
          };
          newOrder = new orderModel(orderData);
          _context.n = 3;
          return newOrder.save();
        case 3:
          _context.n = 4;
          return userModel.findByIdAndUpdate(userId, {
            cartData: {}
          });
        case 4:
          res.json({
            success: true,
            message: "Order placed successfully using COD"
          });
          _context.n = 6;
          break;
        case 5:
          _context.p = 5;
          _t = _context.v;
          console.error("COD Order Error:", _t);
          res.status(500).json({
            success: false,
            message: "Failed to place order using COD",
            error: _t.message
          });
        case 6:
          return _context.a(2);
      }
    }, _callee, null, [[0, 5]]);
  }));
  return function placeOrder(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

// Place order with Stripe payment
var placeOrderStripe = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(req, res) {
    var _req$body2, userId, items, amount, address, origin, orderData, newOrder, line_items, session, _t2;
    return _regenerator().w(function (_context2) {
      while (1) switch (_context2.p = _context2.n) {
        case 0:
          _context2.p = 0;
          _req$body2 = req.body, userId = _req$body2.userId, items = _req$body2.items, amount = _req$body2.amount, address = _req$body2.address;
          origin = req.headers.origin || "http://localhost:5173";
          if (mongoose.Types.ObjectId.isValid(userId)) {
            _context2.n = 1;
            break;
          }
          return _context2.a(2, res.status(400).json({
            success: false,
            message: "Invalid userId format"
          }));
        case 1:
          if (!(!items || !amount || !address)) {
            _context2.n = 2;
            break;
          }
          return _context2.a(2, res.status(400).json({
            success: false,
            message: "Missing required fields"
          }));
        case 2:
          if (!(amount < 50)) {
            _context2.n = 3;
            break;
          }
          return _context2.a(2, res.status(400).json({
            success: false,
            message: "Amount must be at least 50"
          }));
        case 3:
          orderData = {
            userId: userId,
            items: items,
            address: address,
            amount: amount,
            paymentMethod: "Stripe",
            payment: false,
            date: new Date()
          };
          newOrder = new orderModel(orderData);
          _context2.n = 4;
          return newOrder.save();
        case 4:
          line_items = items.map(function (item) {
            return {
              price_data: {
                currency: "npr",
                product_data: {
                  name: item.name
                },
                unit_amount: Math.round(item.price * 100)
              },
              quantity: item.quantity
            };
          });
          _context2.n = 5;
          return stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: line_items,
            mode: "payment",
            success_url: "".concat(origin, "/payment-verify?success=true&orderId=").concat(newOrder._id),
            cancel_url: "".concat(origin, "/payment-verify?success=false&orderId=").concat(newOrder._id)
          });
        case 5:
          session = _context2.v;
          res.json({
            success: true,
            session_url: session.url
          });
          _context2.n = 7;
          break;
        case 6:
          _context2.p = 6;
          _t2 = _context2.v;
          console.error("Stripe Error:", _t2);
          res.status(500).json({
            success: false,
            message: "Failed to create Stripe session",
            error: _t2.message
          });
        case 7:
          return _context2.a(2);
      }
    }, _callee2, null, [[0, 6]]);
  }));
  return function placeOrderStripe(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();

// Verify Stripe payment
var verifyStripe = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(req, res) {
    var _req$body3, orderId, success, order, _t3;
    return _regenerator().w(function (_context3) {
      while (1) switch (_context3.p = _context3.n) {
        case 0:
          _context3.p = 0;
          _req$body3 = req.body, orderId = _req$body3.orderId, success = _req$body3.success;
          if (mongoose.Types.ObjectId.isValid(orderId)) {
            _context3.n = 1;
            break;
          }
          return _context3.a(2, res.status(400).json({
            success: false,
            message: "Invalid orderId format"
          }));
        case 1:
          _context3.n = 2;
          return orderModel.findById(orderId);
        case 2:
          order = _context3.v;
          if (order) {
            _context3.n = 3;
            break;
          }
          return _context3.a(2, res.status(404).json({
            success: false,
            message: "Order not found"
          }));
        case 3:
          if (!(success === "true")) {
            _context3.n = 6;
            break;
          }
          _context3.n = 4;
          return orderModel.findByIdAndUpdate(orderId, {
            payment: true
          });
        case 4:
          _context3.n = 5;
          return userModel.findByIdAndUpdate(order.userId, {
            cartData: {}
          });
        case 5:
          return _context3.a(2, res.json({
            success: true,
            message: "Payment verified successfully"
          }));
        case 6:
          _context3.n = 7;
          return orderModel.findByIdAndDelete(orderId);
        case 7:
          return _context3.a(2, res.json({
            success: false,
            message: "Payment failed or cancelled"
          }));
        case 8:
          _context3.n = 10;
          break;
        case 9:
          _context3.p = 9;
          _t3 = _context3.v;
          console.error("Stripe Verification Error:", _t3);
          res.status(500).json({
            success: false,
            message: "Stripe verification failed",
            error: _t3.message
          });
        case 10:
          return _context3.a(2);
      }
    }, _callee3, null, [[0, 9]]);
  }));
  return function verifyStripe(_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}();

// Place order with Khalti payment
var placeOrderKhalti = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(req, res) {
    var _req$body4, userId, items, amount, address, origin, orderData, newOrder, khaltiPayload, response, _error$response, _t4;
    return _regenerator().w(function (_context4) {
      while (1) switch (_context4.p = _context4.n) {
        case 0:
          _context4.p = 0;
          _req$body4 = req.body, userId = _req$body4.userId, items = _req$body4.items, amount = _req$body4.amount, address = _req$body4.address;
          origin = req.headers.origin || "http://localhost:5173";
          if (mongoose.Types.ObjectId.isValid(userId)) {
            _context4.n = 1;
            break;
          }
          return _context4.a(2, res.status(400).json({
            success: false,
            message: "Invalid userId format"
          }));
        case 1:
          orderData = {
            userId: userId,
            items: items,
            address: address,
            amount: amount,
            paymentMethod: "Khalti",
            payment: false,
            date: new Date()
          };
          newOrder = new orderModel(orderData);
          _context4.n = 2;
          return newOrder.save();
        case 2:
          khaltiPayload = {
            return_url: "".concat(origin, "/payment-return"),
            website_url: origin,
            amount: Math.round(amount * 100),
            purchase_order_id: newOrder._id.toString(),
            purchase_order_name: "Newari Shop Order",
            customer_info: {
              name: "".concat(address.firstName || "", " ").concat(address.lastName || "").trim(),
              email: (address.email || "").toLowerCase().trim(),
              phone: (address.phone || "").replace(/\D/g, "")
            }
          };
          _context4.n = 3;
          return axios.post("https://a.khalti.com/api/v2/epayment/initiate/", khaltiPayload, {
            headers: {
              Authorization: "Key ".concat(process.env.KHALTI_SECRET_KEY),
              "Content-Type": "application/json"
            }
          });
        case 3:
          response = _context4.v;
          if (response.data.payment_url) {
            _context4.n = 5;
            break;
          }
          _context4.n = 4;
          return orderModel.findByIdAndDelete(newOrder._id);
        case 4:
          return _context4.a(2, res.status(500).json({
            success: false,
            message: "Khalti payment URL missing"
          }));
        case 5:
          res.status(200).json({
            success: true,
            session_url: response.data.payment_url,
            orderId: newOrder._id
          });
          _context4.n = 7;
          break;
        case 6:
          _context4.p = 6;
          _t4 = _context4.v;
          console.error("Khalti order error:", ((_error$response = _t4.response) === null || _error$response === void 0 ? void 0 : _error$response.data) || _t4);
          res.status(500).json({
            success: false,
            message: "Khalti error",
            error: _t4
          });
        case 7:
          return _context4.a(2);
      }
    }, _callee4, null, [[0, 6]]);
  }));
  return function placeOrderKhalti(_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}();
var verifyKhalti = /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5(req, res) {
    var _req$query, pidx, orderId, khaltiRes, order, _error$response2, _t5;
    return _regenerator().w(function (_context5) {
      while (1) switch (_context5.p = _context5.n) {
        case 0:
          _context5.p = 0;
          _req$query = req.query, pidx = _req$query.pidx, orderId = _req$query.orderId;
          if (!(!pidx || !orderId)) {
            _context5.n = 1;
            break;
          }
          return _context5.a(2, res.status(400).json({
            success: false,
            message: "Missing pidx or orderId"
          }));
        case 1:
          _context5.n = 2;
          return axios.post("https://a.khalti.com/api/v2/epayment/lookup/", {
            pidx: pidx
          }, {
            headers: {
              Authorization: "Key ".concat(process.env.KHALTI_SECRET_KEY),
              "Content-Type": "application/json"
            }
          });
        case 2:
          khaltiRes = _context5.v;
          if (!(khaltiRes.data.status === "Completed")) {
            _context5.n = 6;
            break;
          }
          _context5.n = 3;
          return orderModel.findByIdAndUpdate(orderId, {
            payment: true,
            status: "Order Placed"
          });
        case 3:
          _context5.n = 4;
          return orderModel.findById(orderId);
        case 4:
          order = _context5.v;
          if (!order) {
            _context5.n = 5;
            break;
          }
          _context5.n = 5;
          return userModel.findByIdAndUpdate(order.userId, {
            cartData: {}
          });
        case 5:
          return _context5.a(2, res.json({
            success: true,
            message: "Payment verified successfully"
          }));
        case 6:
          _context5.n = 7;
          return orderModel.findByIdAndDelete(orderId);
        case 7:
          return _context5.a(2, res.json({
            success: false,
            message: "Payment not completed"
          }));
        case 8:
          _context5.n = 10;
          break;
        case 9:
          _context5.p = 9;
          _t5 = _context5.v;
          console.error("Khalti verification error:", ((_error$response2 = _t5.response) === null || _error$response2 === void 0 ? void 0 : _error$response2.data) || _t5.message);
          return _context5.a(2, res.status(500).json({
            success: false,
            message: "Verification failed",
            error: _t5.message
          }));
        case 10:
          return _context5.a(2);
      }
    }, _callee5, null, [[0, 9]]);
  }));
  return function verifyKhalti(_x9, _x0) {
    return _ref5.apply(this, arguments);
  };
}();

// Fetch all orders (admin)
var allOrders = /*#__PURE__*/function () {
  var _ref6 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6(req, res) {
    var orders, _t6;
    return _regenerator().w(function (_context6) {
      while (1) switch (_context6.p = _context6.n) {
        case 0:
          _context6.p = 0;
          _context6.n = 1;
          return orderModel.find();
        case 1:
          orders = _context6.v;
          res.status(200).json({
            success: true,
            orders: orders
          });
          _context6.n = 3;
          break;
        case 2:
          _context6.p = 2;
          _t6 = _context6.v;
          console.error("Fetch Orders Error:", _t6);
          res.status(500).json({
            success: false,
            message: "Failed to fetch all orders",
            error: _t6.message
          });
        case 3:
          return _context6.a(2);
      }
    }, _callee6, null, [[0, 2]]);
  }));
  return function allOrders(_x1, _x10) {
    return _ref6.apply(this, arguments);
  };
}();

// Fetch user orders
var userOrder = /*#__PURE__*/function () {
  var _ref7 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee7(req, res) {
    var userId, orders, _t7;
    return _regenerator().w(function (_context7) {
      while (1) switch (_context7.p = _context7.n) {
        case 0:
          _context7.p = 0;
          userId = req.body.userId;
          if (mongoose.Types.ObjectId.isValid(userId)) {
            _context7.n = 1;
            break;
          }
          return _context7.a(2, res.status(400).json({
            success: false,
            message: "Invalid userId format"
          }));
        case 1:
          _context7.n = 2;
          return orderModel.find({
            userId: userId
          });
        case 2:
          orders = _context7.v;
          res.status(200).json({
            success: true,
            orders: orders
          });
          _context7.n = 4;
          break;
        case 3:
          _context7.p = 3;
          _t7 = _context7.v;
          console.error("Fetch User Orders Error:", _t7);
          res.status(500).json({
            success: false,
            message: "Failed to fetch user orders",
            error: _t7.message
          });
        case 4:
          return _context7.a(2);
      }
    }, _callee7, null, [[0, 3]]);
  }));
  return function userOrder(_x11, _x12) {
    return _ref7.apply(this, arguments);
  };
}();

// Update order status (admin)
var updateStatus = /*#__PURE__*/function () {
  var _ref8 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee8(req, res) {
    var _req$body5, orderId, status, updatedOrder, _t8;
    return _regenerator().w(function (_context8) {
      while (1) switch (_context8.p = _context8.n) {
        case 0:
          _context8.p = 0;
          _req$body5 = req.body, orderId = _req$body5.orderId, status = _req$body5.status;
          if (mongoose.Types.ObjectId.isValid(orderId)) {
            _context8.n = 1;
            break;
          }
          return _context8.a(2, res.status(400).json({
            success: false,
            message: "Invalid orderId format"
          }));
        case 1:
          if (status) {
            _context8.n = 2;
            break;
          }
          return _context8.a(2, res.status(400).json({
            success: false,
            message: "Missing status"
          }));
        case 2:
          _context8.n = 3;
          return orderModel.findByIdAndUpdate(orderId, {
            status: status
          }, {
            "new": true
          });
        case 3:
          updatedOrder = _context8.v;
          if (updatedOrder) {
            _context8.n = 4;
            break;
          }
          return _context8.a(2, res.status(404).json({
            success: false,
            message: "Order not found"
          }));
        case 4:
          res.json({
            success: true,
            message: "Order #".concat(orderId, " status updated to ").concat(status),
            order: updatedOrder
          });
          _context8.n = 6;
          break;
        case 5:
          _context8.p = 5;
          _t8 = _context8.v;
          console.error("Update Status Error:", _t8);
          res.status(500).json({
            success: false,
            message: "Failed to update order status",
            error: _t8.message
          });
        case 6:
          return _context8.a(2);
      }
    }, _callee8, null, [[0, 5]]);
  }));
  return function updateStatus(_x13, _x14) {
    return _ref8.apply(this, arguments);
  };
}();

// Update payment status for COD orders (admin/user)
var updatePaymentStatus = /*#__PURE__*/function () {
  var _ref9 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee9(req, res) {
    var _req$body6, orderId, payment, order, updatedOrder, _t9;
    return _regenerator().w(function (_context9) {
      while (1) switch (_context9.p = _context9.n) {
        case 0:
          _context9.p = 0;
          _req$body6 = req.body, orderId = _req$body6.orderId, payment = _req$body6.payment;
          if (mongoose.Types.ObjectId.isValid(orderId)) {
            _context9.n = 1;
            break;
          }
          return _context9.a(2, res.status(400).json({
            success: false,
            message: "Invalid orderId format"
          }));
        case 1:
          if (!(typeof payment !== "boolean")) {
            _context9.n = 2;
            break;
          }
          return _context9.a(2, res.status(400).json({
            success: false,
            message: "Payment status must be a boolean"
          }));
        case 2:
          _context9.n = 3;
          return orderModel.findById(orderId);
        case 3:
          order = _context9.v;
          if (order) {
            _context9.n = 4;
            break;
          }
          return _context9.a(2, res.status(404).json({
            success: false,
            message: "Order not found"
          }));
        case 4:
          if (!(order.paymentMethod !== "COD")) {
            _context9.n = 5;
            break;
          }
          return _context9.a(2, res.status(400).json({
            success: false,
            message: "Payment status can only be updated for COD orders"
          }));
        case 5:
          _context9.n = 6;
          return orderModel.findByIdAndUpdate(orderId, {
            payment: payment
          }, {
            "new": true
          });
        case 6:
          updatedOrder = _context9.v;
          res.json({
            success: true,
            message: "Order #".concat(orderId, " payment status updated to ").concat(payment ? "Done" : "Pending"),
            order: updatedOrder
          });
          _context9.n = 8;
          break;
        case 7:
          _context9.p = 7;
          _t9 = _context9.v;
          console.error("Update Payment Status Error:", _t9);
          res.status(500).json({
            success: false,
            message: "Failed to update payment status",
            error: _t9.message
          });
        case 8:
          return _context9.a(2);
      }
    }, _callee9, null, [[0, 7]]);
  }));
  return function updatePaymentStatus(_x15, _x16) {
    return _ref9.apply(this, arguments);
  };
}();

// Get orders from last X days (admin)
var getOrdersByDays = /*#__PURE__*/function () {
  var _ref0 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee0(req, res) {
    var days, start, orders, formattedOrders, _t0;
    return _regenerator().w(function (_context0) {
      while (1) switch (_context0.p = _context0.n) {
        case 0:
          _context0.p = 0;
          days = parseInt(req.query.days) || 7;
          start = new Date();
          start.setUTCHours(0, 0, 0, 0);
          start.setUTCDate(start.getUTCDate() - days + 1);
          _context0.n = 1;
          return orderModel.find({
            date: {
              $gte: start
            }
          }).populate("userId", "name");
        case 1:
          orders = _context0.v;
          formattedOrders = orders.map(function (order) {
            var _order$userId;
            return {
              order_id: order._id.toString(),
              user_name: ((_order$userId = order.userId) === null || _order$userId === void 0 ? void 0 : _order$userId.name) || "Unknown User",
              product_name: order.items.map(function (item) {
                return item.name;
              }).join(", "),
              amount_due: order.amount,
              invoice_number: order._id.toString(),
              total_products: order.items.reduce(function (sum, item) {
                return sum + item.quantity;
              }, 0),
              order_date: order.date,
              order_status: order.status,
              payment_method: order.paymentMethod,
              payment_status: order.payment ? "Paid" : "Pending"
            };
          });
          res.json({
            success: true,
            orders: formattedOrders
          });
          _context0.n = 3;
          break;
        case 2:
          _context0.p = 2;
          _t0 = _context0.v;
          console.error("Error fetching orders:", _t0);
          res.status(500).json({
            success: false,
            message: "Failed to fetch orders",
            error: _t0.message
          });
        case 3:
          return _context0.a(2);
      }
    }, _callee0, null, [[0, 2]]);
  }));
  return function getOrdersByDays(_x17, _x18) {
    return _ref0.apply(this, arguments);
  };
}();
export { placeOrder, placeOrderStripe, placeOrderKhalti, verifyStripe, verifyKhalti, allOrders, userOrder, updateStatus, updatePaymentStatus, getOrdersByDays };