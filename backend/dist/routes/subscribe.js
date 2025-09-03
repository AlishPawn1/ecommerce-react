function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
import express from "express";
import nodemailer from "nodemailer";
import NewsletterSubscriber from "../models/newsletterModel.js";
var router = express.Router();
router.post("/", /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(req, res) {
    var email, existing, transporter, mailOptions, _t;
    return _regenerator().w(function (_context) {
      while (1) switch (_context.p = _context.n) {
        case 0:
          email = req.body.email;
          if (!(!email || !validateEmail(email))) {
            _context.n = 1;
            break;
          }
          return _context.a(2, res.status(400).json({
            error: "Invalid email address"
          }));
        case 1:
          _context.p = 1;
          _context.n = 2;
          return NewsletterSubscriber.findOne({
            email: email
          });
        case 2:
          existing = _context.v;
          if (existing) {
            _context.n = 5;
            break;
          }
          _context.n = 3;
          return NewsletterSubscriber.create({
            email: email
          });
        case 3:
          // Setup transporter (use your SMTP credentials here)
          transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || "smtp.gmail.com",
            port: process.env.SMTP_PORT || 587,
            secure: false,
            // use TLS
            auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASS
            },
            tls: {
              rejectUnauthorized: false // optional: helps with some SSL issues
            }
          }); // Email options
          mailOptions = {
            from: '"Traditional Newari Shop" <no-reply@yourshop.com>',
            to: email,
            subject: "Subscription Confirmation",
            text: "Thank you for subscribing to our newsletter! You'll get 20% off on your next purchase.",
            html: "<p>Thank you for subscribing to our newsletter! You'll get <strong>20% off</strong> on your next purchase.</p>"
          }; // Send email
          _context.n = 4;
          return transporter.sendMail(mailOptions);
        case 4:
          return _context.a(2, res.json({
            success: true,
            message: "Subscribed successfully"
          }));
        case 5:
          return _context.a(2, res.json({
            success: true,
            message: "Already subscribed"
          }));
        case 6:
          _context.n = 8;
          break;
        case 7:
          _context.p = 7;
          _t = _context.v;
          console.error("Email sending failed:", _t);
          res.status(500).json({
            error: "Failed to send confirmation email"
          });
        case 8:
          return _context.a(2);
      }
    }, _callee, null, [[1, 7]]);
  }));
  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());
function validateEmail(email) {
  // Basic regex email validation
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
export default router;