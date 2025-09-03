function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
import mongoose from "mongoose";
import slugify from "slugify";
var stockHistorySchema = new mongoose.Schema({
  quantity: {
    type: Number,
    required: true
  },
  previousStock: {
    type: Number,
    required: true
  },
  newStock: {
    type: Number,
    required: true
  },
  changedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  date: {
    type: Date,
    "default": Date.now
  },
  reason: {
    type: String
  }
});
var reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  username: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: Date,
    "default": Date.now
  }
});
var productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    unique: true,
    index: true,
    sparse: true
  },
  // unique slug
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true
  },
  subCategory: {
    type: String,
    required: true
  },
  size: [{
    type: String
  }],
  bestseller: {
    type: Boolean,
    "default": false
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
    "default": 0
  },
  image: [{
    type: String
  }],
  additionalDescription: {
    type: String,
    required: false
  },
  stockHistory: [stockHistorySchema],
  reviews: [reviewSchema],
  viewCount: {
    type: Number,
    "default": 0
  },
  averageRating: {
    type: Number,
    "default": 0
  },
  reviewCount: {
    type: Number,
    "default": 0
  },
  stockUpdatedAt: {
    type: Date
  },
  date: {
    type: Date,
    "default": Date.now
  }
}, {
  timestamps: true
});

// Middleware: Track stock changes
productSchema.pre("save", function (next) {
  if (this.isModified("stock")) {
    if (!this.stockHistory) this.stockHistory = [];
    var previousStock = this.stockHistory.length > 0 ? this.stockHistory[this.stockHistory.length - 1].newStock : 0;
    this.stockHistory.push({
      quantity: this.stock - previousStock,
      previousStock: previousStock,
      newStock: this.stock,
      changedBy: this._updatedBy,
      date: Date.now()
    });
    this.stockUpdatedAt = Date.now();
  }
  next();
});

// Middleware: Update averageRating and reviewCount on reviews change
productSchema.pre("save", function (next) {
  if (this.isModified("reviews")) {
    this.reviewCount = this.reviews.length;
    this.averageRating = this.reviews.length > 0 ? this.reviews.reduce(function (sum, review) {
      return sum + review.rating;
    }, 0) / this.reviews.length : 0;
  }
  next();
});

// Middleware: Generate unique slug from product name before saving
productSchema.pre("save", /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(next) {
    var baseSlug, slug, counter;
    return _regenerator().w(function (_context) {
      while (1) switch (_context.n) {
        case 0:
          if (!this.isModified("name")) {
            _context.n = 4;
            break;
          }
          baseSlug = slugify(this.name, {
            lower: true,
            strict: true
          });
          slug = baseSlug;
          counter = 1; // Ensure slug uniqueness (excluding current document)
        case 1:
          _context.n = 2;
          return mongoose.models.product.findOne({
            slug: slug,
            _id: {
              $ne: this._id
            }
          });
        case 2:
          if (!_context.v) {
            _context.n = 3;
            break;
          }
          slug = "".concat(baseSlug, "-").concat(counter++);
          _context.n = 1;
          break;
        case 3:
          this.slug = slug;
        case 4:
          next();
        case 5:
          return _context.a(2);
      }
    }, _callee, this);
  }));
  return function (_x) {
    return _ref.apply(this, arguments);
  };
}());
var productModel = mongoose.models.product || mongoose.model("product", productSchema);
export default productModel;