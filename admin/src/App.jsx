import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Add from "./pages/Add";
import List from "./pages/List";
import Order from "./pages/Orders";
import Login from "./components/Login";
import { ToastContainer } from "react-toastify";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Dashboard from "./pages/Dashboard";
import AddStock from "./pages/AddStock";
import History from "./pages/History";
import InsertCategory from "./pages/InsertCategory";
import InsertSubCategory from "./pages/InsertSubCategory";
import ListUser from "./pages/ListUser";
import Feedback from "./pages/Feedback";
import EditStock from "./components/EditStock";
import EditCategory from "./components/EditCategory";
import EditSubCategory from "./components/EditSubCategory";

export const backendUrl = import.meta.env.VITE_BACKEND_URL;
export const currency = "Rs.";

const App = () => {
  const [token, setToken] = useState(
    localStorage.getItem("token") ? localStorage.getItem("token") : ""
  );

  useEffect(() => {
    localStorage.setItem("token", token);
  }, [token]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <ToastContainer />
      {token === "" ? (
        <Login setToken={setToken} />
      ) : (
        <>
          <hr />
          <Navbar setToken={setToken} />
          <div className="flex w-full">
            <Sidebar />
            <div className="w-[70%] mx-auto ml-[max(5vw, 25px)] my-8 text-gray-600 text-base">
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" />} />
                <Route path="/dashboard" element={<Dashboard token={token} />} />
                <Route path="/add" element={<Add token={token} />} />
                <Route path="/list" element={<List token={token} />} />
                <Route path="/order" element={<Order token={token} />} />
                <Route path="/addstock" element={<AddStock token={token} />} />
                <Route path="/history" element={<History token={token} />} />
                <Route path="/insertCategory" element={<InsertCategory token={token} />} />
                <Route path="/insertSubCategory" element={<InsertSubCategory token={token} />} />
                <Route path="/listUser" element={<ListUser token={token} />} />
                <Route path="/feedback" element={<Feedback token={token} />} />
                <Route path="/stock/:id" element={<EditStock />} />
                <Route path="/edit-category/:id" element={<EditCategory />} />
                <Route path="/edit-sub-category/:id" element={<EditSubCategory />} />
              </Routes>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default App;
