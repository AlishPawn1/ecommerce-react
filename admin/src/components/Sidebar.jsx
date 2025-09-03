import React, { useState } from "react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const [openDropdown, setOpenDropdown] = useState(null);

  const toggleDropdown = (menu) => {
    setOpenDropdown(openDropdown === menu ? null : menu);
  };

  return (
    <div className="w-[18%] min-h-screen border-r-2 border-gray-300">
      <ul className="primary-menu flex flex-col gap-4 pt-6 pl-[20%] text-[15px]">
        <li>
          <NavLink to="http://localhost:5173/">
            <i className="fa-solid fa-house-chimney"></i>
            <span className="hidden md:block">View Site</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/dashboard">
            <i className="fa-solid fa-house"></i>
            <span className="hidden md:block">Dashboard</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/list">
            <i className="fa-solid fa-eye"></i>
            <span className="hidden md:block">List Item</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/addstock">
            <i className="fa-solid fa-arrow-trend-up"></i>
            <span className="hidden md:block">Add Stock</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/history">
            <i className="fa-solid fa-clock-rotate-left"></i>
            <span className="hidden md:block">History</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/reviews">
            <i className="fa-solid fa-star"></i>
            <span className="hidden md:block">Reviews</span>
          </NavLink>
        </li>
        {/* Dropdown Menu */}
        <li className="relative">
          <button onClick={() => toggleDropdown("insert")}>
            <i className="fa-solid fa-download"></i>
            <span className="hidden md:block">Insert</span>
            <i
              className={`fa-solid fa-chevron-down transition-transform ml-auto ${openDropdown === "insert" ? "rotate-180" : ""}`}
            ></i>
          </button>
          {openDropdown === "insert" && (
            <ul className="sub-menu mt-2 pl-4">
              <li>
                <NavLink to="/add">Add Item</NavLink>
              </li>
              <li>
                <NavLink to="/insertCategory">Category</NavLink>
              </li>
              <li>
                <NavLink to="/insertSubCategory">Sub Category</NavLink>
              </li>
            </ul>
          )}
        </li>
        <li className="relative">
          <button onClick={() => toggleDropdown("list")}>
            <i className="fa-solid fa-list"></i>
            <span className="hidden md:block">List</span>
            <i
              className={`fa-solid fa-chevron-down transition-transform ml-auto ${openDropdown === "list" ? "rotate-180" : ""}`}
            ></i>
          </button>
          {openDropdown === "list" && (
            <ul className="sub-menu mt-2 pl-4">
              <li>
                <NavLink to="/order">Order Item</NavLink>
              </li>
              <li>
                <NavLink to="/listUser">User</NavLink>
              </li>
              <li>
                <NavLink to="/subscriptions">Subscription</NavLink>
              </li>
            </ul>
          )}
        </li>
        <li>
          <NavLink to="/feedback">
            <i className="fa-solid fa-comments"></i>
            <span className="hidden md:block">Feedback</span>
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
