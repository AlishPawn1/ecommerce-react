function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
import userModel from "../models/userModel.js";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendEmail } from "./sendEmail.js";
import { v2 as cloudinary } from "cloudinary";

// Function to create a JWT token
var createToken = function createToken(id) {
  return jwt.sign({
    id: id
  }, process.env.JWT_SECRET, {
    expiresIn: "30d"
  });
};

// Generate 6-digit code
var generateVerificationCode = function generateVerificationCode() {
  return crypto.randomInt(100000, 999999).toString();
};

// Route for user registration
var registerUser = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(req, res) {
    var _req$body, name, email, password, address, number, exists, result, salt, hashedPassword, code, newUser, user, frontendUrls, baseUrl, verificationLink, emailSubject, emailMessage, _t;
    return _regenerator().w(function (_context) {
      while (1) switch (_context.p = _context.n) {
        case 0:
          _req$body = req.body, name = _req$body.name, email = _req$body.email, password = _req$body.password, address = _req$body.address, number = _req$body.number;
          _context.p = 1;
          _context.n = 2;
          return userModel.findOne({
            email: email
          });
        case 2:
          exists = _context.v;
          if (!exists) {
            _context.n = 3;
            break;
          }
          return _context.a(2, res.status(400).json({
            success: false,
            message: "User already exists"
          }));
        case 3:
          if (validator.isEmail(email)) {
            _context.n = 4;
            break;
          }
          return _context.a(2, res.status(400).json({
            success: false,
            message: "Please enter a valid email"
          }));
        case 4:
          if (!(!password || password.length < 8)) {
            _context.n = 5;
            break;
          }
          return _context.a(2, res.status(400).json({
            success: false,
            message: "Password must be at least 8 characters"
          }));
        case 5:
          if (!(!address || address.trim().split(" ").length < 2)) {
            _context.n = 6;
            break;
          }
          return _context.a(2, res.status(400).json({
            success: false,
            message: "Address must contain at least 2 words"
          }));
        case 6:
          if (/^(9[876]\d{8})$/.test(number)) {
            _context.n = 7;
            break;
          }
          return _context.a(2, res.status(400).json({
            success: false,
            message: "Phone number must be 10 digits starting with 98, 97, or 96"
          }));
        case 7:
          if (req.file) {
            _context.n = 8;
            break;
          }
          return _context.a(2, res.status(400).json({
            success: false,
            message: "No image uploaded"
          }));
        case 8:
          _context.n = 9;
          return cloudinary.uploader.upload(req.file.path, {
            resource_type: "image",
            folder: "users"
          });
        case 9:
          result = _context.v;
          if (result.secure_url) {
            _context.n = 10;
            break;
          }
          return _context.a(2, res.status(400).json({
            success: false,
            message: "Failed to upload image"
          }));
        case 10:
          _context.n = 11;
          return bcrypt.genSalt(10);
        case 11:
          salt = _context.v;
          _context.n = 12;
          return bcrypt.hash(password, salt);
        case 12:
          hashedPassword = _context.v;
          // Generate verification code
          code = generateVerificationCode(); // Create new user document
          newUser = new userModel({
            name: name,
            email: email,
            password: hashedPassword,
            address: address,
            number: number,
            image: result.secure_url,
            verificationCode: code,
            verificationCodeExpires: Date.now() + 30 * 60 * 1000 // expires in 30 minutes
          });
          _context.n = 13;
          return newUser.save();
        case 13:
          user = _context.v;
          // Prepare verification email
          frontendUrls = process.env.FRONTEND_URLS.split(",").map(function (url) {
            return url.trim().replace(/\/+$/, "");
          });
          baseUrl = frontendUrls[0];
          verificationLink = "".concat(baseUrl, "/email-verify?email=").concat(encodeURIComponent(email), "&code=").concat(code);
          console.log("Verification Link:", verificationLink);
          emailSubject = "Verify Your Email Address";
          emailMessage = "\n      <html>\n        <head>\n          <style>\n            body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px; }\n            .container { max-width: 600px; margin: auto; background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); }\n            .button { padding: 10px 20px; background-color: #007bff; color: white !important; text-decoration: none; border-radius: 5px; }\n            .heading { color: #333; }\n            .message { font-size: 16px; }\n          </style>\n        </head>\n        <body>\n          <div class=\"container\">\n            <h2 class=\"heading\">Welcome to Our E-commerce Store!</h2>\n            <p class=\"message\">Please verify your email by clicking the link below or entering the code manually:</p>\n            <p><strong>Verification Code:</strong> ".concat(code, "</p>\n            <p><a href=\"").concat(verificationLink, "\" class=\"button\">Verify Email</a></p>\n            <p>This code expires in 30 minutes.</p>\n          </div>\n        </body>\n      </html>\n    ");
          _context.n = 14;
          return sendEmail(email, emailSubject, emailMessage);
        case 14:
          res.status(201).json({
            success: true,
            message: "Registration successful! Please check your email to verify your account."
          });
          _context.n = 16;
          break;
        case 15:
          _context.p = 15;
          _t = _context.v;
          console.error("Error in registerUser:", _t);
          res.status(500).json({
            success: false,
            message: _t.message
          });
        case 16:
          return _context.a(2);
      }
    }, _callee, null, [[1, 15]]);
  }));
  return function registerUser(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

// Route to get authenticated user's profile
var getUserProfile = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(req, res) {
    var _req$headers$authoriz, token, decoded, user, _t2;
    return _regenerator().w(function (_context2) {
      while (1) switch (_context2.p = _context2.n) {
        case 0:
          _context2.p = 0;
          token = (_req$headers$authoriz = req.headers.authorization) === null || _req$headers$authoriz === void 0 ? void 0 : _req$headers$authoriz.split(" ")[1];
          if (token) {
            _context2.n = 1;
            break;
          }
          return _context2.a(2, res.status(401).json({
            success: false,
            message: "No token provided"
          }));
        case 1:
          decoded = jwt.verify(token, process.env.JWT_SECRET);
          _context2.n = 2;
          return userModel.findById(decoded.id, "name email number address image isVerified");
        case 2:
          user = _context2.v;
          if (user) {
            _context2.n = 3;
            break;
          }
          return _context2.a(2, res.status(404).json({
            success: false,
            message: "User not found"
          }));
        case 3:
          res.status(200).json({
            success: true,
            user: user
          });
          _context2.n = 5;
          break;
        case 4:
          _context2.p = 4;
          _t2 = _context2.v;
          console.error("Error fetching user profile:", _t2);
          res.status(500).json({
            success: false,
            message: "Server error"
          });
        case 5:
          return _context2.a(2);
      }
    }, _callee2, null, [[0, 4]]);
  }));
  return function getUserProfile(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();

// Other functions remain unchanged
var loginUser = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(req, res) {
    var _req$body2, email, password, user, isMatch, token, _t3;
    return _regenerator().w(function (_context3) {
      while (1) switch (_context3.p = _context3.n) {
        case 0:
          _context3.p = 0;
          if (!(!req.body || !req.body.email || !req.body.password)) {
            _context3.n = 1;
            break;
          }
          return _context3.a(2, res.status(400).json({
            success: false,
            message: "Email and password are required"
          }));
        case 1:
          _req$body2 = req.body, email = _req$body2.email, password = _req$body2.password;
          console.log("Received login data:", {
            email: email,
            password: password
          });
          _context3.n = 2;
          return userModel.findOne({
            email: email
          });
        case 2:
          user = _context3.v;
          if (user) {
            _context3.n = 3;
            break;
          }
          return _context3.a(2, res.status(400).json({
            success: false,
            message: "User not found"
          }));
        case 3:
          if (user.isVerified) {
            _context3.n = 4;
            break;
          }
          return _context3.a(2, res.status(400).json({
            success: false,
            message: "Please verify your email first"
          }));
        case 4:
          _context3.n = 5;
          return bcrypt.compare(password, user.password);
        case 5:
          isMatch = _context3.v;
          if (isMatch) {
            _context3.n = 6;
            break;
          }
          return _context3.a(2, res.status(400).json({
            success: false,
            message: "Invalid credentials"
          }));
        case 6:
          token = createToken(user._id);
          res.status(200).json({
            success: true,
            token: token,
            userId: user._id,
            userName: user.name
          });
          _context3.n = 8;
          break;
        case 7:
          _context3.p = 7;
          _t3 = _context3.v;
          console.error("Login error:", _t3);
          res.status(500).json({
            success: false,
            message: "Login failed"
          });
        case 8:
          return _context3.a(2);
      }
    }, _callee3, null, [[0, 7]]);
  }));
  return function loginUser(_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}();
var verifyEmail = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(req, res) {
    var _req$query, email, code, user, _t4;
    return _regenerator().w(function (_context4) {
      while (1) switch (_context4.p = _context4.n) {
        case 0:
          _context4.p = 0;
          _req$query = req.query, email = _req$query.email, code = _req$query.code;
          _context4.n = 1;
          return userModel.findOne({
            email: email
          });
        case 1:
          user = _context4.v;
          if (user) {
            _context4.n = 2;
            break;
          }
          return _context4.a(2, res.status(400).json({
            success: false,
            message: "User not found"
          }));
        case 2:
          if (!(user.verificationCodeExpires < Date.now())) {
            _context4.n = 3;
            break;
          }
          return _context4.a(2, res.status(400).json({
            success: false,
            message: "Verification code expired"
          }));
        case 3:
          if (!(user.verificationCode !== code)) {
            _context4.n = 4;
            break;
          }
          return _context4.a(2, res.status(400).json({
            success: false,
            message: "Invalid verification code"
          }));
        case 4:
          user.isVerified = true;
          user.verificationCode = undefined;
          user.verificationCodeExpires = undefined;
          _context4.n = 5;
          return user.save();
        case 5:
          res.status(200).json({
            success: true,
            message: "Email verified successfully"
          });
          _context4.n = 7;
          break;
        case 6:
          _context4.p = 6;
          _t4 = _context4.v;
          console.error("Verification error:", _t4);
          res.status(500).json({
            success: false,
            message: "Server error"
          });
        case 7:
          return _context4.a(2);
      }
    }, _callee4, null, [[0, 6]]);
  }));
  return function verifyEmail(_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}();
var verifyCode = /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5(req, res) {
    var _req$body3, email, code, user, _t5;
    return _regenerator().w(function (_context5) {
      while (1) switch (_context5.p = _context5.n) {
        case 0:
          _context5.p = 0;
          _req$body3 = req.body, email = _req$body3.email, code = _req$body3.code;
          _context5.n = 1;
          return userModel.findOne({
            email: email
          });
        case 1:
          user = _context5.v;
          if (user) {
            _context5.n = 2;
            break;
          }
          return _context5.a(2, res.status(400).json({
            success: false,
            message: "User not found"
          }));
        case 2:
          if (!(user.verificationCodeExpires < Date.now())) {
            _context5.n = 3;
            break;
          }
          return _context5.a(2, res.status(400).json({
            success: false,
            message: "Verification code expired"
          }));
        case 3:
          if (!(user.verificationCode !== code)) {
            _context5.n = 4;
            break;
          }
          return _context5.a(2, res.status(400).json({
            success: false,
            message: "Invalid verification code"
          }));
        case 4:
          user.isVerified = true;
          user.verificationCode = undefined;
          user.verificationCodeExpires = undefined;
          _context5.n = 5;
          return user.save();
        case 5:
          res.status(200).json({
            success: true,
            message: "Email verified successfully"
          });
          _context5.n = 7;
          break;
        case 6:
          _context5.p = 6;
          _t5 = _context5.v;
          console.error("Verification error:", _t5);
          res.status(500).json({
            success: false,
            message: "Server error"
          });
        case 7:
          return _context5.a(2);
      }
    }, _callee5, null, [[0, 6]]);
  }));
  return function verifyCode(_x9, _x0) {
    return _ref5.apply(this, arguments);
  };
}();
var adminLogin = /*#__PURE__*/function () {
  var _ref6 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6(req, res) {
    var _req$body4, email, password, token, _t6;
    return _regenerator().w(function (_context6) {
      while (1) switch (_context6.p = _context6.n) {
        case 0:
          _context6.p = 0;
          _req$body4 = req.body, email = _req$body4.email, password = _req$body4.password;
          if (!(!email || !password)) {
            _context6.n = 1;
            break;
          }
          return _context6.a(2, res.status(400).json({
            success: false,
            message: "Email and password are required."
          }));
        case 1:
          console.log("Admin login attempt:", {
            email: email
          });
          if (!(email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD)) {
            _context6.n = 2;
            break;
          }
          return _context6.a(2, res.status(401).json({
            success: false,
            message: "Invalid credentials."
          }));
        case 2:
          // Include both email and password in the token payload for adminAuth middleware
          token = jwt.sign({
            email: email,
            password: password
          }, process.env.JWT_SECRET);
          console.log("Generated token:", token);
          res.status(200).json({
            success: true,
            token: token
          });
          _context6.n = 4;
          break;
        case 3:
          _context6.p = 3;
          _t6 = _context6.v;
          console.error("Admin login error:", _t6.message);
          res.status(500).json({
            success: false,
            message: "Server error."
          });
        case 4:
          return _context6.a(2);
      }
    }, _callee6, null, [[0, 3]]);
  }));
  return function adminLogin(_x1, _x10) {
    return _ref6.apply(this, arguments);
  };
}();
var resendCode = /*#__PURE__*/function () {
  var _ref7 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee7(req, res) {
    var email, user, code, frontendUrls, baseUrl, verificationLink, emailSubject, emailMessage, _t7;
    return _regenerator().w(function (_context7) {
      while (1) switch (_context7.p = _context7.n) {
        case 0:
          _context7.p = 0;
          email = req.body.email;
          _context7.n = 1;
          return userModel.findOne({
            email: email
          });
        case 1:
          user = _context7.v;
          if (user) {
            _context7.n = 2;
            break;
          }
          return _context7.a(2, res.status(400).json({
            success: false,
            message: "User not found"
          }));
        case 2:
          if (!user.isVerified) {
            _context7.n = 3;
            break;
          }
          return _context7.a(2, res.status(400).json({
            success: false,
            message: "Email already verified"
          }));
        case 3:
          code = generateVerificationCode();
          user.verificationCode = code;
          user.verificationCodeExpires = Date.now() + 30 * 60 * 1000;
          _context7.n = 4;
          return user.save();
        case 4:
          frontendUrls = process.env.FRONTEND_URLS.split(",").map(function (url) {
            return url.trim().replace(/\/+$/, "");
          });
          baseUrl = frontendUrls[0];
          verificationLink = "".concat(baseUrl, "/email-verify?email=").concat(encodeURIComponent(email), "&code=").concat(code);
          console.log("Resend Verification Link:", verificationLink);
          emailSubject = "Verify Your Email Address";
          emailMessage = "\n      <html>\n        <head>\n          <style>\n            body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px; }\n            .container { max-width: 600px; margin: auto; background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); }\n            .button { padding: 10px 20px; background-color: #007bff; color: white !important; text-decoration: none; border-radius: 5px; }\n            .heading { color: #333; }\n            .message { font-size: 16px; }\n          </style>\n        </head>\n        <body>\n          <div class=\"container\">\n            <h2 class=\"heading\">Welcome to Our E-commerce Store!</h2>\n            <p class=\"message\">Please verify your email by clicking the link below or entering the code manually:</p>\n            <p><strong>Verification Code:</strong> ".concat(code, "</p>\n            <p><a href=\"").concat(verificationLink, "\" class=\"button\">Verify Email</a></p>\n            <p>This code expires in 30 minutes.</p>\n          </div>\n        </body>\n      </html>\n    ");
          _context7.n = 5;
          return sendEmail(email, emailSubject, emailMessage);
        case 5:
          res.status(200).json({
            success: true,
            message: "Verification code resent"
          });
          _context7.n = 7;
          break;
        case 6:
          _context7.p = 6;
          _t7 = _context7.v;
          console.error("Error in resendCode:", _t7);
          res.status(500).json({
            success: false,
            message: "Server error"
          });
        case 7:
          return _context7.a(2);
      }
    }, _callee7, null, [[0, 6]]);
  }));
  return function resendCode(_x11, _x12) {
    return _ref7.apply(this, arguments);
  };
}();
var getAllUsers = /*#__PURE__*/function () {
  var _ref8 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee8(req, res) {
    var users, _t8;
    return _regenerator().w(function (_context8) {
      while (1) switch (_context8.p = _context8.n) {
        case 0:
          _context8.p = 0;
          console.log("Fetching all users...");
          _context8.n = 1;
          return userModel.find({}, "name email number address image isVerified");
        case 1:
          users = _context8.v;
          console.log("Users fetched:", users);
          res.status(200).json(users);
          _context8.n = 3;
          break;
        case 2:
          _context8.p = 2;
          _t8 = _context8.v;
          console.error("Error fetching users:", _t8);
          res.status(500).json({
            success: false,
            message: "Failed to fetch users"
          });
        case 3:
          return _context8.a(2);
      }
    }, _callee8, null, [[0, 2]]);
  }));
  return function getAllUsers(_x13, _x14) {
    return _ref8.apply(this, arguments);
  };
}();
var deleteUser = /*#__PURE__*/function () {
  var _ref9 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee9(req, res) {
    var id, user, _t9;
    return _regenerator().w(function (_context9) {
      while (1) switch (_context9.p = _context9.n) {
        case 0:
          _context9.p = 0;
          id = req.params.id;
          _context9.n = 1;
          return userModel.findByIdAndDelete(id);
        case 1:
          user = _context9.v;
          if (user) {
            _context9.n = 2;
            break;
          }
          return _context9.a(2, res.status(404).json({
            success: false,
            message: "User not found"
          }));
        case 2:
          res.status(200).json({
            success: true,
            message: "User deleted successfully"
          });
          _context9.n = 4;
          break;
        case 3:
          _context9.p = 3;
          _t9 = _context9.v;
          console.error("Error deleting user:", _t9);
          res.status(500).json({
            success: false,
            message: "Server error"
          });
        case 4:
          return _context9.a(2);
      }
    }, _callee9, null, [[0, 3]]);
  }));
  return function deleteUser(_x15, _x16) {
    return _ref9.apply(this, arguments);
  };
}();
var updateUserProfile = /*#__PURE__*/function () {
  var _ref0 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee0(req, res) {
    var _req$headers$authoriz2, token, decoded, user, _req$body5, name, number, address, password, salt, result, userResponse, _t0;
    return _regenerator().w(function (_context0) {
      while (1) switch (_context0.p = _context0.n) {
        case 0:
          _context0.p = 0;
          token = (_req$headers$authoriz2 = req.headers.authorization) === null || _req$headers$authoriz2 === void 0 ? void 0 : _req$headers$authoriz2.split(" ")[1];
          if (token) {
            _context0.n = 1;
            break;
          }
          return _context0.a(2, res.status(401).json({
            success: false,
            message: "Unauthorized"
          }));
        case 1:
          decoded = jwt.verify(token, process.env.JWT_SECRET);
          _context0.n = 2;
          return userModel.findById(decoded.id);
        case 2:
          user = _context0.v;
          if (user) {
            _context0.n = 3;
            break;
          }
          return _context0.a(2, res.status(404).json({
            success: false,
            message: "User not found"
          }));
        case 3:
          _req$body5 = req.body, name = _req$body5.name, number = _req$body5.number, address = _req$body5.address, password = _req$body5.password;
          if (name) user.name = name;
          if (number) user.number = number;
          if (address) user.address = address;
          if (!password) {
            _context0.n = 7;
            break;
          }
          if (!(password.length < 8)) {
            _context0.n = 4;
            break;
          }
          return _context0.a(2, res.status(400).json({
            success: false,
            message: "Password must be at least 8 characters"
          }));
        case 4:
          _context0.n = 5;
          return bcrypt.genSalt(10);
        case 5:
          salt = _context0.v;
          _context0.n = 6;
          return bcrypt.hash(password, salt);
        case 6:
          user.password = _context0.v;
        case 7:
          if (!req.file) {
            _context0.n = 10;
            break;
          }
          _context0.n = 8;
          return cloudinary.uploader.upload(req.file.path, {
            resource_type: "image",
            folder: "users"
          });
        case 8:
          result = _context0.v;
          if (result.secure_url) {
            _context0.n = 9;
            break;
          }
          return _context0.a(2, res.status(400).json({
            success: false,
            message: "Failed to upload image"
          }));
        case 9:
          user.image = result.secure_url;
        case 10:
          _context0.n = 11;
          return user.save();
        case 11:
          // Remove sensitive info before sending response
          userResponse = {
            name: user.name,
            email: user.email,
            number: user.number,
            address: user.address,
            image: user.image,
            isVerified: user.isVerified
          };
          res.status(200).json({
            success: true,
            user: userResponse
          });
          _context0.n = 13;
          break;
        case 12:
          _context0.p = 12;
          _t0 = _context0.v;
          console.error("Error updating profile:", _t0.message);
          res.status(500).json({
            success: false,
            message: "Failed to update profile"
          });
        case 13:
          return _context0.a(2);
      }
    }, _callee0, null, [[0, 12]]);
  }));
  return function updateUserProfile(_x17, _x18) {
    return _ref0.apply(this, arguments);
  };
}();
var forgotPassword = /*#__PURE__*/function () {
  var _ref1 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee1(req, res) {
    var email, user, resetToken, resetTokenExpiry, frontendUrls, baseUrl, resetUrl, message, _t1;
    return _regenerator().w(function (_context1) {
      while (1) switch (_context1.p = _context1.n) {
        case 0:
          email = req.body.email;
          _context1.p = 1;
          if (email) {
            _context1.n = 2;
            break;
          }
          return _context1.a(2, res.status(400).json({
            success: false,
            message: "Email is required"
          }));
        case 2:
          _context1.n = 3;
          return userModel.findOne({
            email: email
          });
        case 3:
          user = _context1.v;
          if (user) {
            _context1.n = 4;
            break;
          }
          return _context1.a(2, res.status(404).json({
            success: false,
            message: "User not found with this email"
          }));
        case 4:
          // Generate a random reset token (hex string)
          resetToken = crypto.randomBytes(32).toString("hex"); // Set token expiration 1 hour from now
          resetTokenExpiry = Date.now() + 3600000; // Save token and expiry on user document
          user.resetPasswordToken = resetToken;
          user.resetPasswordExpires = resetTokenExpiry;
          _context1.n = 5;
          return user.save();
        case 5:
          // Construct reset URL for frontend
          frontendUrls = (process.env.FRONTEND_URLS || "http://localhost:5173").split(",").map(function (url) {
            return url.trim().replace(/\/+$/, "");
          });
          baseUrl = frontendUrls[0];
          resetUrl = "".concat(baseUrl, "/reset-password?token=").concat(resetToken, "&email=").concat(encodeURIComponent(email)); // Email message content
          message = "\n      <h3>Password Reset Request</h3>\n      <p>You requested a password reset. Click the link below to reset your password:</p>\n      <a href=\"".concat(resetUrl, "\">Reset Password</a>\n      <p>If you did not request this, please ignore this email.</p>\n    "); // Send reset email
          _context1.n = 6;
          return sendEmail(email, "Password Reset Request", message);
        case 6:
          console.log("Password reset email sent: ".concat(resetUrl));
          res.status(200).json({
            success: true,
            message: "Password reset email sent. Please check your inbox."
          });
          _context1.n = 8;
          break;
        case 7:
          _context1.p = 7;
          _t1 = _context1.v;
          console.error("Forgot password error:", _t1);
          res.status(500).json({
            success: false,
            message: "Server error while processing forgot password."
          });
        case 8:
          return _context1.a(2);
      }
    }, _callee1, null, [[1, 7]]);
  }));
  return function forgotPassword(_x19, _x20) {
    return _ref1.apply(this, arguments);
  };
}();

// Reset Password: Validate token + expiry, update password
var resetPassword = /*#__PURE__*/function () {
  var _ref10 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee10(req, res) {
    var _req$body6, token, email, password, user, salt, _t10;
    return _regenerator().w(function (_context10) {
      while (1) switch (_context10.p = _context10.n) {
        case 0:
          _req$body6 = req.body, token = _req$body6.token, email = _req$body6.email, password = _req$body6.password;
          console.log("Reset password request:", {
            token: token,
            email: email,
            passwordProvided: !!password
          });
          _context10.p = 1;
          if (!(!token || !email || !password)) {
            _context10.n = 2;
            break;
          }
          return _context10.a(2, res.status(400).json({
            success: false,
            message: "Token, email and new password are required"
          }));
        case 2:
          _context10.n = 3;
          return userModel.findOne({
            email: email
          });
        case 3:
          user = _context10.v;
          // Debug logs for token and expiry in DB
          console.log("Stored reset token:", user === null || user === void 0 ? void 0 : user.resetPasswordToken);
          console.log("Stored token expiry:", user === null || user === void 0 ? void 0 : user.resetPasswordExpires);
          console.log("Current time:", Date.now());

          // Check user exists, token matches, and token is not expired
          if (!(!user || user.resetPasswordToken !== token || !user.resetPasswordExpires || user.resetPasswordExpires < Date.now())) {
            _context10.n = 4;
            break;
          }
          return _context10.a(2, res.status(400).json({
            success: false,
            message: "Invalid or expired token"
          }));
        case 4:
          if (!(password.length < 8)) {
            _context10.n = 5;
            break;
          }
          return _context10.a(2, res.status(400).json({
            success: false,
            message: "Password must be at least 8 characters"
          }));
        case 5:
          _context10.n = 6;
          return bcrypt.genSalt(10);
        case 6:
          salt = _context10.v;
          _context10.n = 7;
          return bcrypt.hash(password, salt);
        case 7:
          user.password = _context10.v;
          // Clear reset token fields
          user.resetPasswordToken = undefined;
          user.resetPasswordExpires = undefined;
          _context10.n = 8;
          return user.save();
        case 8:
          res.status(200).json({
            success: true,
            message: "Password has been reset successfully"
          });
          _context10.n = 10;
          break;
        case 9:
          _context10.p = 9;
          _t10 = _context10.v;
          console.error("Reset password error:", _t10);
          res.status(500).json({
            success: false,
            message: "Server error while resetting password"
          });
        case 10:
          return _context10.a(2);
      }
    }, _callee10, null, [[1, 9]]);
  }));
  return function resetPassword(_x21, _x22) {
    return _ref10.apply(this, arguments);
  };
}();
export { registerUser, loginUser, verifyEmail, verifyCode, resendCode, adminLogin, getAllUsers, deleteUser, getUserProfile, updateUserProfile, forgotPassword, resetPassword };