import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { Link, NavLink } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";

const Navbar = () => {
    const [visible, setVisible] = useState(false);
    const {
        setShowSearch,
        getCartCount,
        navigate,
        token,
        setToken,
        setCartItems,
        user,
    } = useContext(ShopContext);

    //   console.log('Navbar context user:', user); // Debug log

    const logout = () => {
        navigate("/login");
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("name"); // Corrected to 'name'
        setToken("");
        setCartItems({});
        toast.success("Logged out successfully");
    };

    return (
        <header>
            <div className="container">
                <nav className="flex items-center justify-between py-5 font-medium">
                    <div className="siteLogo">
                        <Link to="/">
                            <img src={assets.logo} alt="logo" className="w-full" />
                        </Link>
                    </div>

                    <div className="cursor-pointer lg:hidden">
                        <img
                            onClick={() => setVisible(true)}
                            src={assets.hamburgerIcon}
                            alt="hamburger"
                            className="h-[20px]"
                        />
                    </div>

                    <div className={`nav-item ${visible ? "active" : ""}`}>
                        <div className="closeBtn lg:hidden pb-6 justify-self-end">
                            <img
                                src={assets.closeIcon}
                                onClick={() => setVisible(false)}
                                className="cursor-pointer"
                                alt="close"
                            />
                        </div>

                        <ul className="primary-menu lg:flex gap-5">
                            <li>
                                <NavLink onClick={() => setVisible(false)} to="/">
                                    Home
                                </NavLink>
                            </li>
                            <li>
                                <NavLink onClick={() => setVisible(false)} to="/collection">
                                    Collection
                                </NavLink>
                            </li>
                            <li>
                                <NavLink onClick={() => setVisible(false)} to="/about">
                                    About
                                </NavLink>
                            </li>
                            <li>
                                <NavLink onClick={() => setVisible(false)} to="/contact">
                                    Contact
                                </NavLink>
                            </li>
                        </ul>
                    </div>

                    <div className="header-btn">
                        <ul className="flex gap-6">
                            <li>
                                <div className="search-box">
                                    <img
                                        onClick={() => {
                                            setShowSearch(true);
                                            navigate("/collection");
                                        }}
                                        src={assets.searchIcon}
                                        className="cursor-pointer"
                                        alt="searchIcon"
                                    />
                                </div>
                            </li>

                            <li>
                                <div className="profile-box group relative">
                                    <img
                                        onClick={() => (token ? null : navigate("/login"))}
                                        src={assets.userIcon}
                                        className="cursor-pointer"
                                        alt="profileIcon"
                                    />
                                    {token && (
                                        <div className="group-hover:block z-50 hidden absolute dropdown-menu right-0 pt-4">
                                            <div className="flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded">
                                                <p onClick={() => navigate("/profile")}
                                                    className="cursor-pointer hover:text-black">
                                                    {user?.name || "User"} {/* Changed to user.name */}
                                                </p>
                                                <p
                                                    onClick={() => navigate("/order")}
                                                    className="cursor-pointer hover:text-black"
                                                >
                                                    Order
                                                </p>
                                                <p
                                                    onClick={logout}
                                                    className="cursor-pointer hover:text-black"
                                                >
                                                    Logout
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </li>

                            <li>
                                <div className="cart-box">
                                    <Link to="/cart" className="relative">
                                        <img
                                            src={assets.shoppingCartIcon}
                                            className="cursor-pointer"
                                            alt="cartIcon"
                                        />
                                        <p className="absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]">
                                            {getCartCount()}
                                        </p>
                                    </Link>
                                </div>
                            </li>
                        </ul>
                    </div>
                </nav>
            </div>
        </header>
    );
};

export default Navbar;