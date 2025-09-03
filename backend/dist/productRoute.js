function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
import express from "express";
import { listProduct, addProduct, removeProduct, singleProduct, updateStock, editStockProduct, category, subcategory, getCategories, getSubCategories, checkCategoryExists, removeCategory, getSingleCategory, updateCategory, checksubCategoryExists, removesubCategory, getSinglesubCategory, updatesubCategory, updateProduct, addReview, deleteReview } from "../controllers/productControllers.js";
import upload from "../middleware/multer.js";
import adminAuth from "../middleware/adminAuth.js";
import auth from "../middleware/auth.js";
import productModel from "../models/productModel.js";
import authUser from "../middleware/auth.js";
var productRouter = express.Router();

// Product Management
productRouter.post("/add", adminAuth, upload.fields([{
  name: "image1",
  maxCount: 1
}, {
  name: "image2",
  maxCount: 1
}, {
  name: "image3",
  maxCount: 1
}, {
  name: "image4",
  maxCount: 1
}]), addProduct);
productRouter.post("/remove", adminAuth, removeProduct);
productRouter.post("/single", singleProduct);
productRouter.get("/list", listProduct);

// Stock Management
productRouter.get("/stock/:id", adminAuth, editStockProduct);
productRouter.put("/stock/:id", adminAuth, updateStock);

// Update Product
productRouter.put("/update/:id", adminAuth, upload.fields([{
  name: "image1",
  maxCount: 1
}, {
  name: "image2",
  maxCount: 1
}, {
  name: "image3",
  maxCount: 1
}, {
  name: "image4",
  maxCount: 1
}]), updateProduct);

// Categories
productRouter.post("/categories", adminAuth, category);
productRouter.post("/subcategories", adminAuth, subcategory);
productRouter.get("/categories", getCategories);
productRouter.get("/subcategories", getSubCategories);
productRouter.get("/categories/check", checkCategoryExists);
productRouter["delete"]("/categories/:id", adminAuth, removeCategory);
productRouter.get("/categories/:id", getSingleCategory);
productRouter.put("/categories/:id", adminAuth, updateCategory);
productRouter.get("/subcategories/check", checksubCategoryExists);
productRouter["delete"]("/subcategories/:id", adminAuth, removesubCategory);
productRouter.get("/subcategories/:id", getSinglesubCategory);
productRouter.put("/subcategories/:id", adminAuth, updatesubCategory);

// Reviews
productRouter.post("/reviews/:id", auth, addReview);
productRouter["delete"]("/reviews/:productId/:reviewId", deleteReview);

// View Count
productRouter.post("/view/:id", /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(req, res) {
    var _yield$import, incrementViewCount, _t;
    return _regenerator().w(function (_context) {
      while (1) switch (_context.p = _context.n) {
        case 0:
          _context.p = 0;
          _context.n = 1;
          return import("../controllers/productControllers.js");
        case 1:
          _yield$import = _context.v;
          incrementViewCount = _yield$import.incrementViewCount;
          _context.n = 2;
          return incrementViewCount(req, res);
        case 2:
          _context.n = 4;
          break;
        case 3:
          _context.p = 3;
          _t = _context.v;
          res.status(500).json({
            success: false,
            message: "Server error"
          });
        case 4:
          return _context.a(2);
      }
    }, _callee, null, [[0, 3]]);
  }));
  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());

// Top Products
productRouter.get("/top", /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(req, res) {
    var _yield$import2, getTopProducts, _t2;
    return _regenerator().w(function (_context2) {
      while (1) switch (_context2.p = _context2.n) {
        case 0:
          _context2.p = 0;
          _context2.n = 1;
          return import("../controllers/productControllers.js");
        case 1:
          _yield$import2 = _context2.v;
          getTopProducts = _yield$import2.getTopProducts;
          _context2.n = 2;
          return getTopProducts(req, res);
        case 2:
          _context2.n = 4;
          break;
        case 3:
          _context2.p = 3;
          _t2 = _context2.v;
          res.status(500).json({
            success: false,
            message: "Server error"
          });
        case 4:
          return _context2.a(2);
      }
    }, _callee2, null, [[0, 3]]);
  }));
  return function (_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}());

// Example: GET /api/product/my-reviews/count
productRouter.get("/my-reviews/count", authUser, /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(req, res) {
    var userId, products, totalReviews, _t3;
    return _regenerator().w(function (_context3) {
      while (1) switch (_context3.p = _context3.n) {
        case 0:
          _context3.p = 0;
          userId = req.user._id.toString(); // ✅ Convert to string for comparison
          _context3.n = 1;
          return productModel.find({
            "reviews.user": userId
          });
        case 1:
          products = _context3.v;
          totalReviews = 0;
          products.forEach(function (product) {
            totalReviews += product.reviews.filter(function (r) {
              return r.user.toString() === userId;
            }).length;
          });
          res.json({
            success: true,
            totalReviews: totalReviews
          });
          _context3.n = 3;
          break;
        case 2:
          _context3.p = 2;
          _t3 = _context3.v;
          console.error("Error counting reviews:", _t3);
          res.status(500).json({
            success: false,
            message: "Failed to count reviews"
          });
        case 3:
          return _context3.a(2);
      }
    }, _callee3, null, [[0, 2]]);
  }));
  return function (_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}());
productRouter.get("/slug/:slug", /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(req, res) {
    var product;
    return _regenerator().w(function (_context4) {
      while (1) switch (_context4.n) {
        case 0:
          _context4.n = 1;
          return productModel.findOne({
            slug: req.params.slug
          });
        case 1:
          product = _context4.v;
          if (product) {
            _context4.n = 2;
            break;
          }
          return _context4.a(2, res.status(404).json({
            success: false,
            message: "Not found"
          }));
        case 2:
          res.json({
            success: true,
            product: product
          });
        case 3:
          return _context4.a(2);
      }
    }, _callee4);
  }));
  return function (_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}());
export default productRouter;