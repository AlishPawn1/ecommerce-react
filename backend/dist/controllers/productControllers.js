function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productModel.js";
import mongoose from "mongoose";
import Category from "../models/category.js";
import Subcategory from "../models/subcategory.js";
import userModel from "../models/userModel.js";

// Add продукт
var addProduct = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(req, res) {
    var _req$files$image, _req$files$image2, _req$files$image3, _req$files$image4, _req$body, name, description, price, _category, subCategory, size, bestseller, stock, additionalDescription, parsedSize, imageFiles, imageUrls, newProduct, _t;
    return _regenerator().w(function (_context2) {
      while (1) switch (_context2.p = _context2.n) {
        case 0:
          _context2.p = 0;
          _req$body = req.body, name = _req$body.name, description = _req$body.description, price = _req$body.price, _category = _req$body.category, subCategory = _req$body.subCategory, size = _req$body.size, bestseller = _req$body.bestseller, stock = _req$body.stock, additionalDescription = _req$body.additionalDescription;
          if (!(!name || !description || !price || !_category || !subCategory)) {
            _context2.n = 1;
            break;
          }
          return _context2.a(2, res.status(400).json({
            success: false,
            message: "Missing required fields"
          }));
        case 1:
          if (!(!req.files || Object.keys(req.files).length === 0)) {
            _context2.n = 2;
            break;
          }
          return _context2.a(2, res.status(400).json({
            success: false,
            message: "No images uploaded"
          }));
        case 2:
          parsedSize = Array.isArray(size) ? size : JSON.parse(size || "[]");
          imageFiles = [(_req$files$image = req.files.image1) === null || _req$files$image === void 0 ? void 0 : _req$files$image[0], (_req$files$image2 = req.files.image2) === null || _req$files$image2 === void 0 ? void 0 : _req$files$image2[0], (_req$files$image3 = req.files.image3) === null || _req$files$image3 === void 0 ? void 0 : _req$files$image3[0], (_req$files$image4 = req.files.image4) === null || _req$files$image4 === void 0 ? void 0 : _req$files$image4[0]].filter(Boolean);
          _context2.n = 3;
          return Promise.all(imageFiles.map(/*#__PURE__*/function () {
            var _ref2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(item) {
              var result;
              return _regenerator().w(function (_context) {
                while (1) switch (_context.n) {
                  case 0:
                    _context.n = 1;
                    return cloudinary.uploader.upload(item.path, {
                      resource_type: "image",
                      folder: "products"
                    });
                  case 1:
                    result = _context.v;
                    return _context.a(2, result.secure_url);
                }
              }, _callee);
            }));
            return function (_x3) {
              return _ref2.apply(this, arguments);
            };
          }()));
        case 3:
          imageUrls = _context2.v;
          if (!(imageUrls.length === 0)) {
            _context2.n = 4;
            break;
          }
          return _context2.a(2, res.status(400).json({
            success: false,
            message: "Failed to upload images"
          }));
        case 4:
          newProduct = new productModel({
            name: name,
            description: description,
            price: price,
            category: _category,
            subCategory: subCategory,
            size: parsedSize,
            bestseller: bestseller === "true",
            stock: parseInt(stock, 10) || 0,
            image: imageUrls,
            additionalDescription: additionalDescription,
            date: Date.now()
          });
          _context2.n = 5;
          return newProduct.save();
        case 5:
          res.status(201).json({
            success: true,
            message: "Product added successfully",
            product: newProduct
          });
          _context2.n = 7;
          break;
        case 6:
          _context2.p = 6;
          _t = _context2.v;
          console.error("Error in addProduct:", _t);
          res.status(500).json({
            success: false,
            message: _t.message || "Internal server error"
          });
        case 7:
          return _context2.a(2);
      }
    }, _callee2, null, [[0, 6]]);
  }));
  return function addProduct(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

// Update product
var updateProduct = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(req, res) {
    var _req$user, id, _req$body2, name, description, price, _category2, subCategory, size, bestseller, stock, additionalDescription, product, parsedSize, imageUrls, _req$files$image5, _req$files$image6, _req$files$image7, _req$files$image8, imageFiles, _t2;
    return _regenerator().w(function (_context4) {
      while (1) switch (_context4.p = _context4.n) {
        case 0:
          _context4.p = 0;
          id = req.params.id;
          _req$body2 = req.body, name = _req$body2.name, description = _req$body2.description, price = _req$body2.price, _category2 = _req$body2.category, subCategory = _req$body2.subCategory, size = _req$body2.size, bestseller = _req$body2.bestseller, stock = _req$body2.stock, additionalDescription = _req$body2.additionalDescription;
          if (mongoose.Types.ObjectId.isValid(id)) {
            _context4.n = 1;
            break;
          }
          return _context4.a(2, res.status(400).json({
            success: false,
            message: "Invalid product ID"
          }));
        case 1:
          _context4.n = 2;
          return productModel.findById(id);
        case 2:
          product = _context4.v;
          if (product) {
            _context4.n = 3;
            break;
          }
          return _context4.a(2, res.status(404).json({
            success: false,
            message: "Product not found"
          }));
        case 3:
          parsedSize = size ? Array.isArray(size) ? size : JSON.parse(size || "[]") : product.size;
          imageUrls = product.image;
          if (!(req.files && Object.keys(req.files).length > 0)) {
            _context4.n = 5;
            break;
          }
          imageFiles = [(_req$files$image5 = req.files.image1) === null || _req$files$image5 === void 0 ? void 0 : _req$files$image5[0], (_req$files$image6 = req.files.image2) === null || _req$files$image6 === void 0 ? void 0 : _req$files$image6[0], (_req$files$image7 = req.files.image3) === null || _req$files$image7 === void 0 ? void 0 : _req$files$image7[0], (_req$files$image8 = req.files.image4) === null || _req$files$image8 === void 0 ? void 0 : _req$files$image8[0]].filter(Boolean);
          _context4.n = 4;
          return Promise.all(imageFiles.map(/*#__PURE__*/function () {
            var _ref4 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(item) {
              var result;
              return _regenerator().w(function (_context3) {
                while (1) switch (_context3.n) {
                  case 0:
                    _context3.n = 1;
                    return cloudinary.uploader.upload(item.path, {
                      resource_type: "image",
                      folder: "products"
                    });
                  case 1:
                    result = _context3.v;
                    return _context3.a(2, result.secure_url);
                }
              }, _callee3);
            }));
            return function (_x6) {
              return _ref4.apply(this, arguments);
            };
          }()));
        case 4:
          imageUrls = _context4.v;
        case 5:
          product.name = name || product.name;
          product.description = description || product.description;
          product.price = price !== undefined ? price : product.price;
          product.category = _category2 || product.category;
          product.subCategory = subCategory || product.subCategory;
          product.size = parsedSize;
          product.bestseller = bestseller === "true" || product.bestseller;
          product.stock = stock !== undefined ? parseInt(stock, 10) : product.stock;
          product.image = imageUrls.length > 0 ? imageUrls : product.image;
          product.additionalDescription = additionalDescription || product.additionalDescription;
          product._updatedBy = (_req$user = req.user) === null || _req$user === void 0 ? void 0 : _req$user._id;
          _context4.n = 6;
          return product.save();
        case 6:
          res.status(200).json({
            success: true,
            message: "Product updated successfully",
            product: product
          });
          _context4.n = 8;
          break;
        case 7:
          _context4.p = 7;
          _t2 = _context4.v;
          console.error("Error in updateProduct:", _t2);
          res.status(500).json({
            success: false,
            message: _t2.message || "Internal server error"
          });
        case 8:
          return _context4.a(2);
      }
    }, _callee4, null, [[0, 7]]);
  }));
  return function updateProduct(_x4, _x5) {
    return _ref3.apply(this, arguments);
  };
}();

// List all products
var listProduct = /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5(req, res) {
    var products, _t3;
    return _regenerator().w(function (_context5) {
      while (1) switch (_context5.p = _context5.n) {
        case 0:
          _context5.p = 0;
          _context5.n = 1;
          return productModel.find({});
        case 1:
          products = _context5.v;
          res.status(200).json({
            success: true,
            message: "Products retrieved successfully",
            products: products
          });
          _context5.n = 3;
          break;
        case 2:
          _context5.p = 2;
          _t3 = _context5.v;
          console.error("Error in listProduct:", _t3);
          res.status(500).json({
            success: false,
            message: "Failed to retrieve products"
          });
        case 3:
          return _context5.a(2);
      }
    }, _callee5, null, [[0, 2]]);
  }));
  return function listProduct(_x7, _x8) {
    return _ref5.apply(this, arguments);
  };
}();

// Remove product
var removeProduct = /*#__PURE__*/function () {
  var _ref6 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6(req, res) {
    var id, deletedProduct, _t4;
    return _regenerator().w(function (_context6) {
      while (1) switch (_context6.p = _context6.n) {
        case 0:
          _context6.p = 0;
          id = req.body.id;
          if (mongoose.Types.ObjectId.isValid(id)) {
            _context6.n = 1;
            break;
          }
          return _context6.a(2, res.status(400).json({
            success: false,
            message: "Invalid product ID"
          }));
        case 1:
          _context6.n = 2;
          return productModel.findByIdAndDelete(id);
        case 2:
          deletedProduct = _context6.v;
          if (deletedProduct) {
            _context6.n = 3;
            break;
          }
          return _context6.a(2, res.status(404).json({
            success: false,
            message: "Product not found"
          }));
        case 3:
          res.status(200).json({
            success: true,
            message: "Product removed successfully"
          });
          _context6.n = 5;
          break;
        case 4:
          _context6.p = 4;
          _t4 = _context6.v;
          console.error("Error in removeProduct:", _t4);
          res.status(500).json({
            success: false,
            message: _t4.message || "Internal server error"
          });
        case 5:
          return _context6.a(2);
      }
    }, _callee6, null, [[0, 4]]);
  }));
  return function removeProduct(_x9, _x0) {
    return _ref6.apply(this, arguments);
  };
}();

// Remove category
var removeCategory = /*#__PURE__*/function () {
  var _ref7 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee7(req, res) {
    var id, deletedCategory, _t5;
    return _regenerator().w(function (_context7) {
      while (1) switch (_context7.p = _context7.n) {
        case 0:
          _context7.p = 0;
          id = req.params.id;
          if (mongoose.Types.ObjectId.isValid(id)) {
            _context7.n = 1;
            break;
          }
          return _context7.a(2, res.status(400).json({
            success: false,
            message: "Invalid category ID"
          }));
        case 1:
          _context7.n = 2;
          return Category.findByIdAndDelete(id);
        case 2:
          deletedCategory = _context7.v;
          if (deletedCategory) {
            _context7.n = 3;
            break;
          }
          return _context7.a(2, res.status(404).json({
            success: false,
            message: "Category not found"
          }));
        case 3:
          res.status(200).json({
            success: true,
            message: "Category removed successfully"
          });
          _context7.n = 5;
          break;
        case 4:
          _context7.p = 4;
          _t5 = _context7.v;
          console.error("Error in removeCategory:", _t5);
          res.status(500).json({
            success: false,
            message: _t5.message || "Internal server error"
          });
        case 5:
          return _context7.a(2);
      }
    }, _callee7, null, [[0, 4]]);
  }));
  return function removeCategory(_x1, _x10) {
    return _ref7.apply(this, arguments);
  };
}();

// Get single product
var singleProduct = /*#__PURE__*/function () {
  var _ref8 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee8(req, res) {
    var id, product, _t6;
    return _regenerator().w(function (_context8) {
      while (1) switch (_context8.p = _context8.n) {
        case 0:
          _context8.p = 0;
          id = req.body.id;
          if (mongoose.Types.ObjectId.isValid(id)) {
            _context8.n = 1;
            break;
          }
          return _context8.a(2, res.status(400).json({
            success: false,
            message: "Invalid product ID"
          }));
        case 1:
          _context8.n = 2;
          return productModel.findById(id);
        case 2:
          product = _context8.v;
          if (product) {
            _context8.n = 3;
            break;
          }
          return _context8.a(2, res.status(404).json({
            success: false,
            message: "Product not found"
          }));
        case 3:
          // Ensure all review.user fields are strings
          if (product.reviews && Array.isArray(product.reviews)) {
            product.reviews = product.reviews.map(function (r) {
              var reviewObj = typeof r.toObject === "function" ? r.toObject() : r;
              return _objectSpread(_objectSpread({}, reviewObj), {}, {
                user: reviewObj.user ? reviewObj.user.toString() : ""
              });
            });
          }
          res.status(200).json({
            success: true,
            product: product
          });
          _context8.n = 5;
          break;
        case 4:
          _context8.p = 4;
          _t6 = _context8.v;
          console.error("Error in singleProduct:", _t6);
          res.status(500).json({
            success: false,
            message: _t6.message || "Internal server error"
          });
        case 5:
          return _context8.a(2);
      }
    }, _callee8, null, [[0, 4]]);
  }));
  return function singleProduct(_x11, _x12) {
    return _ref8.apply(this, arguments);
  };
}();

// Get product for stock editing
var editStockProduct = /*#__PURE__*/function () {
  var _ref9 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee9(req, res) {
    var id, product, _t7;
    return _regenerator().w(function (_context9) {
      while (1) switch (_context9.p = _context9.n) {
        case 0:
          _context9.p = 0;
          id = req.params.id;
          if (mongoose.Types.ObjectId.isValid(id)) {
            _context9.n = 1;
            break;
          }
          return _context9.a(2, res.status(400).json({
            success: false,
            message: "Invalid product ID"
          }));
        case 1:
          _context9.n = 2;
          return productModel.findById(id).select("name stock image price");
        case 2:
          product = _context9.v;
          if (product) {
            _context9.n = 3;
            break;
          }
          return _context9.a(2, res.status(404).json({
            success: false,
            message: "Product not found"
          }));
        case 3:
          res.status(200).json({
            success: true,
            product: product
          });
          _context9.n = 5;
          break;
        case 4:
          _context9.p = 4;
          _t7 = _context9.v;
          console.error("Error in editStockProduct:", _t7);
          res.status(500).json({
            success: false,
            message: _t7.message || "Internal server error"
          });
        case 5:
          return _context9.a(2);
      }
    }, _callee9, null, [[0, 4]]);
  }));
  return function editStockProduct(_x13, _x14) {
    return _ref9.apply(this, arguments);
  };
}();

// Update product stock
var updateStock = /*#__PURE__*/function () {
  var _ref0 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee0(req, res) {
    var id, stock, product, _t8;
    return _regenerator().w(function (_context0) {
      while (1) switch (_context0.p = _context0.n) {
        case 0:
          _context0.p = 0;
          id = req.params.id;
          stock = req.body.stock;
          if (mongoose.Types.ObjectId.isValid(id)) {
            _context0.n = 1;
            break;
          }
          return _context0.a(2, res.status(400).json({
            success: false,
            message: "Invalid product ID"
          }));
        case 1:
          if (!(stock === undefined || isNaN(stock) || stock < 0)) {
            _context0.n = 2;
            break;
          }
          return _context0.a(2, res.status(400).json({
            success: false,
            message: "Stock must be a positive number"
          }));
        case 2:
          _context0.n = 3;
          return productModel.findByIdAndUpdate(id, {
            stock: parseInt(stock, 10)
          }, {
            "new": true
          });
        case 3:
          product = _context0.v;
          if (product) {
            _context0.n = 4;
            break;
          }
          return _context0.a(2, res.status(404).json({
            success: false,
            message: "Product not found"
          }));
        case 4:
          res.status(200).json({
            success: true,
            message: "Stock updated successfully",
            product: product
          });
          _context0.n = 6;
          break;
        case 5:
          _context0.p = 5;
          _t8 = _context0.v;
          console.error("Error in updateStock:", _t8);
          res.status(500).json({
            success: false,
            message: _t8.message || "Internal server error"
          });
        case 6:
          return _context0.a(2);
      }
    }, _callee0, null, [[0, 5]]);
  }));
  return function updateStock(_x15, _x16) {
    return _ref0.apply(this, arguments);
  };
}();

// Category functions
var getCategories = /*#__PURE__*/function () {
  var _ref1 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee1(req, res) {
    var categories, _t9;
    return _regenerator().w(function (_context1) {
      while (1) switch (_context1.p = _context1.n) {
        case 0:
          _context1.p = 0;
          _context1.n = 1;
          return Category.find({}).lean();
        case 1:
          categories = _context1.v;
          res.status(200).json({
            success: true,
            message: categories.length > 0 ? "Categories retrieved successfully" : "No categories found",
            data: categories || []
          });
          _context1.n = 3;
          break;
        case 2:
          _context1.p = 2;
          _t9 = _context1.v;
          console.error("Error fetching categories:", _t9);
          res.status(500).json({
            success: false,
            message: "Failed to fetch categories",
            error: _t9.message || "Internal server error"
          });
        case 3:
          return _context1.a(2);
      }
    }, _callee1, null, [[0, 2]]);
  }));
  return function getCategories(_x17, _x18) {
    return _ref1.apply(this, arguments);
  };
}();
var category = /*#__PURE__*/function () {
  var _ref10 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee10(req, res) {
    var name, trimmedName, existingCategory, newCategory, _t0;
    return _regenerator().w(function (_context10) {
      while (1) switch (_context10.p = _context10.n) {
        case 0:
          _context10.p = 0;
          name = req.body.name;
          if (!(!name || typeof name !== "string" || !name.trim())) {
            _context10.n = 1;
            break;
          }
          return _context10.a(2, res.status(400).json({
            success: false,
            message: "Category name is required and must be a non-empty string"
          }));
        case 1:
          trimmedName = name.trim();
          _context10.n = 2;
          return Category.findOne({
            name: trimmedName
          });
        case 2:
          existingCategory = _context10.v;
          if (!existingCategory) {
            _context10.n = 3;
            break;
          }
          return _context10.a(2, res.status(400).json({
            success: false,
            message: "Category already exists"
          }));
        case 3:
          newCategory = new Category({
            name: trimmedName
          });
          _context10.n = 4;
          return newCategory.save();
        case 4:
          res.status(201).json({
            success: true,
            message: "Category created successfully",
            data: newCategory
          });
          _context10.n = 7;
          break;
        case 5:
          _context10.p = 5;
          _t0 = _context10.v;
          console.error("Error creating category:", _t0);
          if (!(_t0.code === 11000)) {
            _context10.n = 6;
            break;
          }
          return _context10.a(2, res.status(400).json({
            success: false,
            message: "Category already exists"
          }));
        case 6:
          res.status(500).json({
            success: false,
            message: "Failed to create category",
            error: _t0.message || "Internal server error"
          });
        case 7:
          return _context10.a(2);
      }
    }, _callee10, null, [[0, 5]]);
  }));
  return function category(_x19, _x20) {
    return _ref10.apply(this, arguments);
  };
}();
var getSingleCategory = /*#__PURE__*/function () {
  var _ref11 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee11(req, res) {
    var id, _category3, _t1;
    return _regenerator().w(function (_context11) {
      while (1) switch (_context11.p = _context11.n) {
        case 0:
          _context11.p = 0;
          id = req.params.id;
          if (mongoose.Types.ObjectId.isValid(id)) {
            _context11.n = 1;
            break;
          }
          return _context11.a(2, res.status(400).json({
            success: false,
            message: "Invalid category ID"
          }));
        case 1:
          _context11.n = 2;
          return Category.findById(id);
        case 2:
          _category3 = _context11.v;
          if (_category3) {
            _context11.n = 3;
            break;
          }
          return _context11.a(2, res.status(404).json({
            success: false,
            message: "Category not found"
          }));
        case 3:
          res.status(200).json({
            success: true,
            message: "Category retrieved successfully",
            data: _category3
          });
          _context11.n = 5;
          break;
        case 4:
          _context11.p = 4;
          _t1 = _context11.v;
          console.error("Error in getSingleCategory:", _t1);
          res.status(500).json({
            success: false,
            message: _t1.message || "Internal server error"
          });
        case 5:
          return _context11.a(2);
      }
    }, _callee11, null, [[0, 4]]);
  }));
  return function getSingleCategory(_x21, _x22) {
    return _ref11.apply(this, arguments);
  };
}();
var updateCategory = /*#__PURE__*/function () {
  var _ref12 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee12(req, res) {
    var id, name, trimmedName, _category4, _t10;
    return _regenerator().w(function (_context12) {
      while (1) switch (_context12.p = _context12.n) {
        case 0:
          _context12.p = 0;
          id = req.params.id;
          name = req.body.name;
          if (mongoose.Types.ObjectId.isValid(id)) {
            _context12.n = 1;
            break;
          }
          return _context12.a(2, res.status(400).json({
            success: false,
            message: "Invalid category ID"
          }));
        case 1:
          if (!(!name || typeof name !== "string" || !name.trim())) {
            _context12.n = 2;
            break;
          }
          return _context12.a(2, res.status(400).json({
            success: false,
            message: "Category name is required and must be a non-empty string"
          }));
        case 2:
          trimmedName = name.trim();
          _context12.n = 3;
          return Category.findByIdAndUpdate(id, {
            name: trimmedName
          }, {
            "new": true,
            runValidators: true
          });
        case 3:
          _category4 = _context12.v;
          if (_category4) {
            _context12.n = 4;
            break;
          }
          return _context12.a(2, res.status(404).json({
            success: false,
            message: "Category not found"
          }));
        case 4:
          res.status(200).json({
            success: true,
            message: "Category updated successfully",
            data: _category4
          });
          _context12.n = 7;
          break;
        case 5:
          _context12.p = 5;
          _t10 = _context12.v;
          console.error("Error in updateCategory:", _t10);
          if (!(_t10.code === 11000)) {
            _context12.n = 6;
            break;
          }
          return _context12.a(2, res.status(400).json({
            success: false,
            message: "Category name already exists"
          }));
        case 6:
          res.status(500).json({
            success: false,
            message: _t10.message || "Internal server error"
          });
        case 7:
          return _context12.a(2);
      }
    }, _callee12, null, [[0, 5]]);
  }));
  return function updateCategory(_x23, _x24) {
    return _ref12.apply(this, arguments);
  };
}();
var checkCategoryExists = /*#__PURE__*/function () {
  var _ref13 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee13(req, res) {
    var name, exists, _t11;
    return _regenerator().w(function (_context13) {
      while (1) switch (_context13.p = _context13.n) {
        case 0:
          _context13.p = 0;
          name = req.query.name;
          if (name) {
            _context13.n = 1;
            break;
          }
          return _context13.a(2, res.status(400).json({
            success: false,
            message: "Category name is required"
          }));
        case 1:
          _context13.n = 2;
          return Category.exists({
            name: name
          });
        case 2:
          exists = _context13.v;
          res.status(200).json({
            exists: exists
          });
          _context13.n = 4;
          break;
        case 3:
          _context13.p = 3;
          _t11 = _context13.v;
          console.error("Error in checkCategoryExists:", _t11);
          res.status(500).json({
            success: false,
            message: "Error checking category",
            error: _t11.message
          });
        case 4:
          return _context13.a(2);
      }
    }, _callee13, null, [[0, 3]]);
  }));
  return function checkCategoryExists(_x25, _x26) {
    return _ref13.apply(this, arguments);
  };
}();

// Subcategory functions
var getSubCategories = /*#__PURE__*/function () {
  var _ref14 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee14(req, res) {
    var subcategories, _t12;
    return _regenerator().w(function (_context14) {
      while (1) switch (_context14.p = _context14.n) {
        case 0:
          _context14.p = 0;
          _context14.n = 1;
          return Subcategory.find({}).lean();
        case 1:
          subcategories = _context14.v;
          res.status(200).json({
            success: true,
            message: subcategories.length > 0 ? "Subcategories retrieved successfully" : "No subcategories found",
            data: subcategories || []
          });
          _context14.n = 3;
          break;
        case 2:
          _context14.p = 2;
          _t12 = _context14.v;
          console.error("Error fetching subcategories:", _t12);
          res.status(500).json({
            success: false,
            message: "Failed to fetch subcategories",
            error: _t12.message || "Internal server error"
          });
        case 3:
          return _context14.a(2);
      }
    }, _callee14, null, [[0, 2]]);
  }));
  return function getSubCategories(_x27, _x28) {
    return _ref14.apply(this, arguments);
  };
}();
var subcategory = /*#__PURE__*/function () {
  var _ref15 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee15(req, res) {
    var name, trimmedName, existingSubCategory, newSubCategory, _t13;
    return _regenerator().w(function (_context15) {
      while (1) switch (_context15.p = _context15.n) {
        case 0:
          _context15.p = 0;
          name = req.body.name;
          if (!(!name || typeof name !== "string" || !name.trim())) {
            _context15.n = 1;
            break;
          }
          return _context15.a(2, res.status(400).json({
            success: false,
            message: "Subcategory name is required and must be a non-empty string"
          }));
        case 1:
          trimmedName = name.trim();
          _context15.n = 2;
          return Subcategory.findOne({
            name: trimmedName
          });
        case 2:
          existingSubCategory = _context15.v;
          if (!existingSubCategory) {
            _context15.n = 3;
            break;
          }
          return _context15.a(2, res.status(400).json({
            success: false,
            message: "Subcategory already exists"
          }));
        case 3:
          newSubCategory = new Subcategory({
            name: trimmedName
          });
          _context15.n = 4;
          return newSubCategory.save();
        case 4:
          res.status(201).json({
            success: true,
            message: "Subcategory created successfully",
            data: newSubCategory
          });
          _context15.n = 7;
          break;
        case 5:
          _context15.p = 5;
          _t13 = _context15.v;
          console.error("Error creating subcategory:", _t13);
          if (!(_t13.code === 11000)) {
            _context15.n = 6;
            break;
          }
          return _context15.a(2, res.status(400).json({
            success: false,
            message: "Subcategory already exists"
          }));
        case 6:
          res.status(500).json({
            success: false,
            message: "Failed to create subcategory",
            error: _t13.message || "Internal server error"
          });
        case 7:
          return _context15.a(2);
      }
    }, _callee15, null, [[0, 5]]);
  }));
  return function subcategory(_x29, _x30) {
    return _ref15.apply(this, arguments);
  };
}();
var getSinglesubCategory = /*#__PURE__*/function () {
  var _ref16 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee16(req, res) {
    var id, _subcategory, _t14;
    return _regenerator().w(function (_context16) {
      while (1) switch (_context16.p = _context16.n) {
        case 0:
          _context16.p = 0;
          id = req.params.id;
          if (mongoose.Types.ObjectId.isValid(id)) {
            _context16.n = 1;
            break;
          }
          return _context16.a(2, res.status(400).json({
            success: false,
            message: "Invalid subcategory ID"
          }));
        case 1:
          _context16.n = 2;
          return Subcategory.findById(id);
        case 2:
          _subcategory = _context16.v;
          if (_subcategory) {
            _context16.n = 3;
            break;
          }
          return _context16.a(2, res.status(404).json({
            success: false,
            message: "Subcategory not found"
          }));
        case 3:
          res.status(200).json({
            success: true,
            message: "Subcategory retrieved successfully",
            data: _subcategory
          });
          _context16.n = 5;
          break;
        case 4:
          _context16.p = 4;
          _t14 = _context16.v;
          console.error("Error in getSinglesubCategory:", _t14);
          res.status(500).json({
            success: false,
            message: _t14.message || "Internal server error"
          });
        case 5:
          return _context16.a(2);
      }
    }, _callee16, null, [[0, 4]]);
  }));
  return function getSinglesubCategory(_x31, _x32) {
    return _ref16.apply(this, arguments);
  };
}();
var removesubCategory = /*#__PURE__*/function () {
  var _ref17 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee17(req, res) {
    var id, deletedSubCategory, _t15;
    return _regenerator().w(function (_context17) {
      while (1) switch (_context17.p = _context17.n) {
        case 0:
          _context17.p = 0;
          id = req.params.id;
          if (mongoose.Types.ObjectId.isValid(id)) {
            _context17.n = 1;
            break;
          }
          return _context17.a(2, res.status(400).json({
            success: false,
            message: "Invalid subcategory ID"
          }));
        case 1:
          _context17.n = 2;
          return Subcategory.findByIdAndDelete(id);
        case 2:
          deletedSubCategory = _context17.v;
          if (deletedSubCategory) {
            _context17.n = 3;
            break;
          }
          return _context17.a(2, res.status(404).json({
            success: false,
            message: "Subcategory not found"
          }));
        case 3:
          res.status(200).json({
            success: true,
            message: "Subcategory removed successfully"
          });
          _context17.n = 5;
          break;
        case 4:
          _context17.p = 4;
          _t15 = _context17.v;
          console.error("Error in removesubCategory:", _t15);
          res.status(500).json({
            success: false,
            message: _t15.message || "Internal server error"
          });
        case 5:
          return _context17.a(2);
      }
    }, _callee17, null, [[0, 4]]);
  }));
  return function removesubCategory(_x33, _x34) {
    return _ref17.apply(this, arguments);
  };
}();
var updatesubCategory = /*#__PURE__*/function () {
  var _ref18 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee18(req, res) {
    var id, name, trimmedName, _subcategory2, _t16;
    return _regenerator().w(function (_context18) {
      while (1) switch (_context18.p = _context18.n) {
        case 0:
          _context18.p = 0;
          id = req.params.id;
          name = req.body.name;
          if (mongoose.Types.ObjectId.isValid(id)) {
            _context18.n = 1;
            break;
          }
          return _context18.a(2, res.status(400).json({
            success: false,
            message: "Invalid subcategory ID"
          }));
        case 1:
          if (!(!name || typeof name !== "string" || !name.trim())) {
            _context18.n = 2;
            break;
          }
          return _context18.a(2, res.status(400).json({
            success: false,
            message: "Subcategory name is required and must be a non-empty string"
          }));
        case 2:
          trimmedName = name.trim();
          _context18.n = 3;
          return Subcategory.findByIdAndUpdate(id, {
            name: trimmedName
          }, {
            "new": true,
            runValidators: true
          });
        case 3:
          _subcategory2 = _context18.v;
          if (_subcategory2) {
            _context18.n = 4;
            break;
          }
          return _context18.a(2, res.status(404).json({
            success: false,
            message: "Subcategory not found"
          }));
        case 4:
          res.status(200).json({
            success: true,
            message: "Subcategory updated successfully",
            data: _subcategory2
          });
          _context18.n = 7;
          break;
        case 5:
          _context18.p = 5;
          _t16 = _context18.v;
          console.error("Error in updatesubCategory:", _t16);
          if (!(_t16.code === 11000)) {
            _context18.n = 6;
            break;
          }
          return _context18.a(2, res.status(400).json({
            success: false,
            message: "Subcategory name already exists"
          }));
        case 6:
          res.status(500).json({
            success: false,
            message: _t16.message || "Internal server error"
          });
        case 7:
          return _context18.a(2);
      }
    }, _callee18, null, [[0, 5]]);
  }));
  return function updatesubCategory(_x35, _x36) {
    return _ref18.apply(this, arguments);
  };
}();
var checksubCategoryExists = /*#__PURE__*/function () {
  var _ref19 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee19(req, res) {
    var name, exists, _t17;
    return _regenerator().w(function (_context19) {
      while (1) switch (_context19.p = _context19.n) {
        case 0:
          _context19.p = 0;
          name = req.query.name;
          if (name) {
            _context19.n = 1;
            break;
          }
          return _context19.a(2, res.status(400).json({
            success: false,
            message: "Subcategory name is required"
          }));
        case 1:
          _context19.n = 2;
          return Subcategory.exists({
            name: name
          });
        case 2:
          exists = _context19.v;
          res.status(200).json({
            exists: exists
          });
          _context19.n = 4;
          break;
        case 3:
          _context19.p = 3;
          _t17 = _context19.v;
          console.error("Error in checksubCategoryExists:", _t17);
          res.status(500).json({
            success: false,
            message: "Error checking subcategory",
            error: _t17.message
          });
        case 4:
          return _context19.a(2);
      }
    }, _callee19, null, [[0, 3]]);
  }));
  return function checksubCategoryExists(_x37, _x38) {
    return _ref19.apply(this, arguments);
  };
}();
var incrementViewCount = /*#__PURE__*/function () {
  var _ref20 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee20(req, res) {
    var id, product, _t18;
    return _regenerator().w(function (_context20) {
      while (1) switch (_context20.p = _context20.n) {
        case 0:
          _context20.p = 0;
          id = req.params.id;
          if (mongoose.Types.ObjectId.isValid(id)) {
            _context20.n = 1;
            break;
          }
          return _context20.a(2, res.status(400).json({
            success: false,
            message: "Invalid product ID"
          }));
        case 1:
          _context20.n = 2;
          return productModel.findById(id);
        case 2:
          product = _context20.v;
          if (product) {
            _context20.n = 3;
            break;
          }
          return _context20.a(2, res.status(404).json({
            success: false,
            message: "Product not found"
          }));
        case 3:
          product.viewCount += 1;
          _context20.n = 4;
          return product.save();
        case 4:
          res.json({
            success: true,
            message: "View count incremented"
          });
          _context20.n = 6;
          break;
        case 5:
          _context20.p = 5;
          _t18 = _context20.v;
          console.error("Error incrementing view count:", _t18);
          res.status(500).json({
            success: false,
            message: "Error incrementing view count",
            error: _t18.message
          });
        case 6:
          return _context20.a(2);
      }
    }, _callee20, null, [[0, 5]]);
  }));
  return function incrementViewCount(_x39, _x40) {
    return _ref20.apply(this, arguments);
  };
}();
var addReview = /*#__PURE__*/function () {
  var _ref21 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee21(req, res) {
    var id, _req$body3, rating, comment, _id, userId, username, user, product, existingReview, _t19;
    return _regenerator().w(function (_context21) {
      while (1) switch (_context21.p = _context21.n) {
        case 0:
          _context21.p = 0;
          id = req.params.id; // product ID
          _req$body3 = req.body, rating = _req$body3.rating, comment = _req$body3.comment, _id = _req$body3._id; // Include _id for explicit updates
          userId = req.user.id; // Injected by auth middleware
          username = req.user.name; // Basic validation
          if (!(!rating || !comment)) {
            _context21.n = 1;
            break;
          }
          return _context21.a(2, res.status(400).json({
            success: false,
            message: "Rating and comment are required."
          }));
        case 1:
          if (!(rating < 1 || rating > 5)) {
            _context21.n = 2;
            break;
          }
          return _context21.a(2, res.status(400).json({
            success: false,
            message: "Rating must be between 1 and 5."
          }));
        case 2:
          if (mongoose.Types.ObjectId.isValid(id)) {
            _context21.n = 3;
            break;
          }
          return _context21.a(2, res.status(400).json({
            success: false,
            message: "Invalid product ID."
          }));
        case 3:
          _context21.n = 4;
          return userModel.findById(userId);
        case 4:
          user = _context21.v;
          if (user) {
            _context21.n = 5;
            break;
          }
          return _context21.a(2, res.status(404).json({
            success: false,
            message: "User not found."
          }));
        case 5:
          _context21.n = 6;
          return productModel.findById(id);
        case 6:
          product = _context21.v;
          if (product) {
            _context21.n = 7;
            break;
          }
          return _context21.a(2, res.status(404).json({
            success: false,
            message: "Product not found."
          }));
        case 7:
          // Check for existing review by this user
          existingReview = product.reviews.find(function (r) {
            return r.user.toString() === userId.toString();
          });
          if (!(existingReview && !_id)) {
            _context21.n = 8;
            break;
          }
          return _context21.a(2, res.status(400).json({
            success: false,
            message: "You have already submitted a review for this product. Please edit or delete your existing review."
          }));
        case 8:
          if (!(_id && existingReview && existingReview._id.toString() === _id.toString())) {
            _context21.n = 10;
            break;
          }
          // Update existing review
          existingReview.rating = rating;
          existingReview.comment = comment.trim();
          existingReview.date = new Date();
          _context21.n = 9;
          return product.save();
        case 9:
          return _context21.a(2, res.json({
            success: true,
            message: "Review updated successfully.",
            review: existingReview
          }));
        case 10:
          if (!_id) {
            _context21.n = 11;
            break;
          }
          return _context21.a(2, res.status(403).json({
            success: false,
            message: "You can only edit your own review."
          }));
        case 11:
          // Otherwise push a new one
          product.reviews.push({
            user: new mongoose.Types.ObjectId(userId),
            username: username,
            rating: rating,
            comment: comment.trim(),
            date: new Date()
          });

          // Update review count and average rating
          product.reviewCount = product.reviews.length;
          product.averageRating = product.reviews.reduce(function (acc, r) {
            return acc + r.rating;
          }, 0) / (product.reviews.length || 1);
          _context21.n = 12;
          return product.save();
        case 12:
          return _context21.a(2, res.json({
            success: true,
            message: "Review added successfully."
          }));
        case 13:
          _context21.p = 13;
          _t19 = _context21.v;
          console.error("Error in addReview:", _t19);
          return _context21.a(2, res.status(500).json({
            success: false,
            message: "Server error.",
            error: _t19.message
          }));
      }
    }, _callee21, null, [[0, 13]]);
  }));
  return function addReview(_x41, _x42) {
    return _ref21.apply(this, arguments);
  };
}();

// Delete a review
var deleteReview = /*#__PURE__*/function () {
  var _ref22 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee22(req, res) {
    var _req$params, productId, reviewId, product, reviewIndex, _t20;
    return _regenerator().w(function (_context22) {
      while (1) switch (_context22.p = _context22.n) {
        case 0:
          _context22.p = 0;
          _req$params = req.params, productId = _req$params.productId, reviewId = _req$params.reviewId;
          if (!(!mongoose.Types.ObjectId.isValid(productId) || !mongoose.Types.ObjectId.isValid(reviewId))) {
            _context22.n = 1;
            break;
          }
          return _context22.a(2, res.status(400).json({
            success: false,
            message: "Invalid product or review ID."
          }));
        case 1:
          _context22.n = 2;
          return productModel.findById(productId);
        case 2:
          product = _context22.v;
          if (product) {
            _context22.n = 3;
            break;
          }
          return _context22.a(2, res.status(404).json({
            success: false,
            message: "Product not found."
          }));
        case 3:
          reviewIndex = product.reviews.findIndex(function (r) {
            return r._id.toString() === reviewId;
          });
          if (!(reviewIndex === -1)) {
            _context22.n = 4;
            break;
          }
          return _context22.a(2, res.status(404).json({
            success: false,
            message: "Review not found."
          }));
        case 4:
          product.reviews.splice(reviewIndex, 1);
          _context22.n = 5;
          return product.save();
        case 5:
          res.json({
            success: true,
            message: "Review deleted successfully."
          });
          _context22.n = 7;
          break;
        case 6:
          _context22.p = 6;
          _t20 = _context22.v;
          console.error("Error deleting review:", _t20);
          res.status(500).json({
            success: false,
            message: "Server error.",
            error: _t20.message
          });
        case 7:
          return _context22.a(2);
      }
    }, _callee22, null, [[0, 6]]);
  }));
  return function deleteReview(_x43, _x44) {
    return _ref22.apply(this, arguments);
  };
}();

// const getTopProducts = async (req, res) => {
//   try {
//     const { by } = req.query;

//     if (!['viewCount', 'averageRating'].includes(by)) {
//       return res.status(400).json({ success: false, message: 'Invalid sort parameter' });
//     }

//     let products = await productModel.find().populate('reviews.user', 'name').lean();

//     if (by === 'averageRating') {
//       // Add score based on rating and review count
//       products = products.map(p => ({
//         ...p,
//         score: p.averageRating * Math.log(p.reviewCount + 1),
//       }));

//       // Sort descending by score
//       products.sort((a, b) => b.score - a.score);
//     } else if (by === 'viewCount') {
//       // Sort descending by viewCount
//       products.sort((a, b) => b.viewCount - a.viewCount);
//     }

//     // Limit to top 5
//     products = products.slice(0, 5);

//     console.log(`Sorted by ${by}:`);
//     products.forEach(p => {
//       if (by === 'averageRating') {
//         console.log(`- ${p.name} | averageRating: ${p.averageRating} | reviewCount: ${p.reviewCount} | score: ${p.score.toFixed(2)}`);
//       } else {
//         console.log(`- ${p.name} | viewCount: ${p.viewCount}`);
//       }
//     });

//     res.json({ success: true, data: products });
//   } catch (error) {
//     console.error('Error fetching top products:', error);
//     res.status(500).json({ success: false, message: 'Error fetching top products', error: error.message });
//   }
// };

var getTopProducts = /*#__PURE__*/function () {
  var _ref23 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee23(req, res) {
    var by, allProducts, totalRatingSum, totalReviewCount, C, m, products, _t21;
    return _regenerator().w(function (_context23) {
      while (1) switch (_context23.p = _context23.n) {
        case 0:
          _context23.p = 0;
          by = req.query.by;
          if (["viewCount", "averageRating"].includes(by)) {
            _context23.n = 1;
            break;
          }
          return _context23.a(2, res.status(400).json({
            success: false,
            message: "Invalid sort parameter"
          }));
        case 1:
          _context23.n = 2;
          return productModel.find({}).select("averageRating reviewCount").lean();
        case 2:
          allProducts = _context23.v;
          // Calculate global average rating C
          totalRatingSum = allProducts.reduce(function (sum, p) {
            return sum + p.averageRating * p.reviewCount;
          }, 0);
          totalReviewCount = allProducts.reduce(function (sum, p) {
            return sum + p.reviewCount;
          }, 0);
          C = totalReviewCount ? totalRatingSum / totalReviewCount : 0;
          m = 5; // Fetch products for sorting
          _context23.n = 3;
          return productModel.find().lean();
        case 3:
          products = _context23.v;
          if (by === "averageRating") {
            // Add Bayesian score to each product
            products = products.map(function (p) {
              var score = (p.averageRating * p.reviewCount + C * m) / (p.reviewCount + m);
              return _objectSpread(_objectSpread({}, p), {}, {
                score: score
              });
            });

            // Sort by score descending
            products.sort(function (a, b) {
              return b.score - a.score;
            });

            // Limit top 5
            products = products.slice(0, 5);

            // Optional: Log for debugging
            console.log("Sorted by Bayesian score:");
            products.forEach(function (p) {
              console.log("- ".concat(p.name, " | averageRating: ").concat(p.averageRating, " | reviewCount: ").concat(p.reviewCount, " | score: ").concat(p.score.toFixed(2)));
            });
          } else if (by === "viewCount") {
            // Sort by viewCount descending and limit
            products = products.sort(function (a, b) {
              return b.viewCount - a.viewCount;
            }).slice(0, 5);
          }
          res.json({
            success: true,
            data: products
          });
          _context23.n = 5;
          break;
        case 4:
          _context23.p = 4;
          _t21 = _context23.v;
          console.error("Error fetching top products:", _t21);
          res.status(500).json({
            success: false,
            message: "Error fetching top products",
            error: _t21.message
          });
        case 5:
          return _context23.a(2);
      }
    }, _callee23, null, [[0, 4]]);
  }));
  return function getTopProducts(_x45, _x46) {
    return _ref23.apply(this, arguments);
  };
}();
export { listProduct, addProduct, removeProduct, singleProduct, updateStock, editStockProduct, getCategories, getSubCategories, category, subcategory, checkCategoryExists, removeCategory, getSingleCategory, updateCategory, checksubCategoryExists, removesubCategory, getSinglesubCategory, updatesubCategory, incrementViewCount, addReview, getTopProducts, updateProduct, deleteReview };