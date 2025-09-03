function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
import userModel from "../models/userModel.js";

// Add products to user cart
var addToCart = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(req, res) {
    var _req$body, userId, itemId, size, userData, cartData, _t;
    return _regenerator().w(function (_context) {
      while (1) switch (_context.p = _context.n) {
        case 0:
          _context.p = 0;
          _req$body = req.body, userId = _req$body.userId, itemId = _req$body.itemId, size = _req$body.size; // Retrieve the user data and initialize cartData if it doesn't exist
          _context.n = 1;
          return userModel.findById(userId);
        case 1:
          userData = _context.v;
          cartData = userData.cartData || {}; // Default to empty object if cartData doesn't exist
          // Check if the item already exists in the cart
          if (cartData[itemId]) {
            // If the item exists, check if the size exists
            if (cartData[itemId][size]) {
              cartData[itemId][size] += 1; // Increment the quantity if size already exists
            } else {
              cartData[itemId][size] = 1; // Set quantity to 1 if size doesn't exist
            }
          } else {
            // If the item doesn't exist, initialize it with the size and quantity
            cartData[itemId] = _defineProperty({}, size, 1);
          }

          // Update the user's cart in the database
          _context.n = 2;
          return userModel.findByIdAndUpdate(userId, {
            cartData: cartData
          });
        case 2:
          res.json({
            success: true,
            message: "Added to cart"
          });
          _context.n = 4;
          break;
        case 3:
          _context.p = 3;
          _t = _context.v;
          console.log(_t);
          res.json({
            success: false,
            message: _t.message
          });
        case 4:
          return _context.a(2);
      }
    }, _callee, null, [[0, 3]]);
  }));
  return function addToCart(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

// Update product quantity in user cart
var updateCart = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(req, res) {
    var _req$body2, userId, itemId, size, quantity, userData, cartData, _t2;
    return _regenerator().w(function (_context2) {
      while (1) switch (_context2.p = _context2.n) {
        case 0:
          _context2.p = 0;
          _req$body2 = req.body, userId = _req$body2.userId, itemId = _req$body2.itemId, size = _req$body2.size, quantity = _req$body2.quantity; // Retrieve the user data
          _context2.n = 1;
          return userModel.findById(userId);
        case 1:
          userData = _context2.v;
          cartData = userData.cartData || {}; // Default to empty object if cartData doesn't exist
          // Ensure the item and size exist before updating
          if (!(cartData[itemId] && cartData[itemId][size])) {
            _context2.n = 2;
            break;
          }
          cartData[itemId][size] = quantity; // Update the quantity for the specified item and size
          _context2.n = 3;
          break;
        case 2:
          return _context2.a(2, res.json({
            success: false,
            message: "Item or size not found in cart"
          }));
        case 3:
          _context2.n = 4;
          return userModel.findByIdAndUpdate(userId, {
            cartData: cartData
          });
        case 4:
          res.json({
            success: true,
            message: "Cart updated"
          });
          _context2.n = 6;
          break;
        case 5:
          _context2.p = 5;
          _t2 = _context2.v;
          console.log(_t2);
          res.json({
            success: false,
            message: _t2.message
          });
        case 6:
          return _context2.a(2);
      }
    }, _callee2, null, [[0, 5]]);
  }));
  return function updateCart(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();

// Get user cart with total item count
var getUserCart = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(req, res) {
    var userId, userData, cartData, totalCount, itemId, size, _t3;
    return _regenerator().w(function (_context3) {
      while (1) switch (_context3.p = _context3.n) {
        case 0:
          _context3.p = 0;
          userId = req.body.userId; // Retrieve the user data and get the cart
          _context3.n = 1;
          return userModel.findById(userId);
        case 1:
          userData = _context3.v;
          cartData = userData.cartData || {}; // Default to empty object if cartData doesn't exist
          // Calculate total count of items in the cart
          totalCount = 0;
          for (itemId in cartData) {
            for (size in cartData[itemId]) {
              totalCount += cartData[itemId][size]; // Sum up the quantities
            }
          }
          res.json({
            success: true,
            cartData: cartData,
            totalCount: totalCount
          }); // Include totalCount in the response
          _context3.n = 3;
          break;
        case 2:
          _context3.p = 2;
          _t3 = _context3.v;
          console.log(_t3);
          res.json({
            success: false,
            message: _t3.message
          });
        case 3:
          return _context3.a(2);
      }
    }, _callee3, null, [[0, 2]]);
  }));
  return function getUserCart(_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}();
export { addToCart, updateCart, getUserCart };