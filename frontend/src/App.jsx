import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Collection from "./pages/Collection";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import PlaceOrder from "./pages/PlaceOrder";
import Order from "./pages/Order";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SearchBar from "./components/SearchBar";
import { ToastContainer, toast } from "react-toastify";
import Test from "./pages/Test";
import Verify from "./pages/Verify";
import EmailVerify from "./pages/EmailVerify";
import "animate.css";
import NotFound from "./pages/NotFound";
import ScrollToTop from "./components/ScrollToTop";
import ProfileCard from "./pages/ProfileCard";
import ChatBot from "./components/ChatBot";
import InfoPolicy from "./pages/InfoPolicy";
import ResetPassword from "./components/ResetPassword";
import PaymentReturn from "./pages/PaymentReturn";
import PaymentFailed from "./pages/PaymentFailed";
import OrderSuccess from "./pages/OrderSuccess";

export const backendUrl = import.meta.env.VITE_BACKEND_URL;

const App = () => {
  return (
    <div className="main-content">
      <Navbar />
      <ToastContainer />
      <SearchBar />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/email-verify" element={<EmailVerify />} />
        <Route path="/collection" element={<Collection />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        {/* <Route path='/product/:productId' element={<Product/>}/> */}
        <Route path="/product/:slug" element={<Product />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/place-order" element={<PlaceOrder />} />
        <Route path="/order" element={<Order />} />
        <Route path="/payment-verify" element={<Verify />} />
        <Route path="/profile" element={<ProfileCard />} />
        <Route path="/info-policy" element={<InfoPolicy />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/payment-return" element={<PaymentReturn />} />
        <Route path="/payment-failed" element={<PaymentFailed />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {/* <ChatBot/> */}
      <Footer />
    </div>
  );
};

export default App;
