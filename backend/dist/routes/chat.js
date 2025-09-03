function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
import express from "express";
import Product from "../models/productModel.js";
var chatRoute = express.Router();
chatRoute.post("/", /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(req, res) {
    var _message$toLowerCase;
    var message, lower, greetings, product, _product$image, popularProducts, names, _t;
    return _regenerator().w(function (_context) {
      while (1) switch (_context.p = _context.n) {
        case 0:
          message = req.body.message;
          lower = (message === null || message === void 0 || (_message$toLowerCase = message.toLowerCase()) === null || _message$toLowerCase === void 0 ? void 0 : _message$toLowerCase.trim()) || "";
          console.log("💬 Received:", lower);

          // Greeting detection
          greetings = ["hi", "hello", "hey", "good morning", "good evening"];
          if (!greetings.some(function (greet) {
            return lower.startsWith(greet);
          })) {
            _context.n = 1;
            break;
          }
          return _context.a(2, res.json({
            reply: "Hello! How can I assist you today?"
          }));
        case 1:
          _context.p = 1;
          if (!(lower.includes("have") || lower.includes("show") || lower.includes("product") || lower.includes("price") || lower.includes("buy"))) {
            _context.n = 3;
            break;
          }
          _context.n = 2;
          return Product.findOne({
            $or: [{
              name: {
                $regex: lower,
                $options: "i"
              }
            }, {
              description: {
                $regex: lower,
                $options: "i"
              }
            }]
          });
        case 2:
          product = _context.v;
          if (!product) {
            _context.n = 3;
            break;
          }
          return _context.a(2, res.json({
            reply: "Yes, we have \"".concat(product.name, "\". Price: Rs.").concat(product.price),
            product: {
              _id: product._id,
              name: product.name,
              price: product.price,
              image: ((_product$image = product.image) === null || _product$image === void 0 ? void 0 : _product$image[0]) || ""
            }
          }));
        case 3:
          if (!(lower.includes("best sellers") || lower.includes("popular products"))) {
            _context.n = 6;
            break;
          }
          _context.n = 4;
          return Product.find({
            bestseller: true
          }).limit(3);
        case 4:
          popularProducts = _context.v;
          if (!(popularProducts.length > 0)) {
            _context.n = 5;
            break;
          }
          names = popularProducts.map(function (p) {
            return p.name;
          }).join(", ");
          return _context.a(2, res.json({
            reply: "Our best sellers include: ".concat(names, ". Ask me about any of them!")
          }));
        case 5:
          return _context.a(2, res.json({
            reply: "Sorry, we don't have best sellers to show right now."
          }));
        case 6:
          if (!lower.includes("price")) {
            _context.n = 7;
            break;
          }
          return _context.a(2, res.json({
            reply: "Prices vary depending on the product. Can you tell me which item?"
          }));
        case 7:
          if (!lower.includes("delivery")) {
            _context.n = 8;
            break;
          }
          return _context.a(2, res.json({
            reply: "We offer delivery within 3-5 business days."
          }));
        case 8:
          if (!lower.includes("return")) {
            _context.n = 9;
            break;
          }
          return _context.a(2, res.json({
            reply: "You can return items within 7 days of delivery."
          }));
        case 9:
          if (!(lower.includes("payment") || lower.includes("payment methods") || lower.includes("payment options"))) {
            _context.n = 10;
            break;
          }
          return _context.a(2, res.json({
            reply: "We accept COD, Stripe, eSewa, and Khalti."
          }));
        case 10:
          if (!(lower.includes("shipping cost") || lower.includes("shipping fee"))) {
            _context.n = 11;
            break;
          }
          return _context.a(2, res.json({
            reply: "Shipping costs depend on your location and order size. Free shipping on orders above Rs.3000!"
          }));
        case 11:
          if (!(lower.includes("order status") || lower.includes("track order"))) {
            _context.n = 12;
            break;
          }
          return _context.a(2, res.json({
            reply: "You can track your order status in your account dashboard or provide your order ID here."
          }));
        case 12:
          if (!(lower.includes("cancel order") || lower.includes("return order"))) {
            _context.n = 13;
            break;
          }
          return _context.a(2, res.json({
            reply: "Orders can be cancelled within 24 hours of purchase. Returns accepted within 7 days of delivery."
          }));
        case 13:
          if (!(lower.includes("discount") || lower.includes("offer") || lower.includes("sale"))) {
            _context.n = 14;
            break;
          }
          return _context.a(2, res.json({
            reply: "We regularly offer discounts and sales. Follow our newsletter or website for the latest offers!"
          }));
        case 14:
          if (!(lower.includes("store location") || lower.includes("address"))) {
            _context.n = 15;
            break;
          }
          return _context.a(2, res.json({
            reply: "We are located at Bhaktapur, and also available online 24/7!"
          }));
        case 15:
          if (!(lower.includes("contact") || lower.includes("support"))) {
            _context.n = 16;
            break;
          }
          return _context.a(2, res.json({
            reply: "You can reach our support team at support@traditionshop.com or call +977-984-6543210."
          }));
        case 16:
          if (!(lower.includes("product availability") || lower.includes("in stock"))) {
            _context.n = 17;
            break;
          }
          return _context.a(2, res.json({
            reply: "You can ask about any product by name to check its availability."
          }));
        case 17:
          if (!(lower.includes("what product") || lower.includes("show product") || lower.includes("products available"))) {
            _context.n = 18;
            break;
          }
          return _context.a(2, res.json({
            reply: "We have sarees, jewelry, topis, and more! Ask about any item by name."
          }));
        case 18:
          return _context.a(2, res.json({
            reply: "I'm not sure how to help with that yet."
          }));
        case 19:
          _context.p = 19;
          _t = _context.v;
          console.error("❌ Chat route error:", _t);
          res.status(500).json({
            reply: "Something went wrong on the server."
          });
        case 20:
          return _context.a(2);
      }
    }, _callee, null, [[1, 19]]);
  }));
  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());
export default chatRoute;