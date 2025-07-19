import React, { useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { assets } from "../assets/assets";

const PlaceOrder = () => {
  const {
    backendUrl,
    token,
    cartItem,
    getCartAmount,
    products,
    setCartItems,
    navigate,
    user, // get full user object here
  } = useContext(ShopContext);

  const [method, setMethod] = useState("cod");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  useEffect(() => {
    if (!products.length) {
      console.warn("Products list is empty. Refetching...");
    }
  }, [products]);

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setFormData((data) => ({ ...data, [name]: value }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!user.userId) {
      toast.error("Please log in to place your order.");
      navigate("/login");
      return;
    }

    try {
      let orderItems = [];

      for (const items in cartItem) {
        for (const item in cartItem[items]) {
          if (cartItem[items][item] > 0) {
            const itemInfo = structuredClone(
              products.find((product) => product._id === items)
            );
            if (itemInfo) {
              itemInfo.size = item;
              itemInfo.quantity = cartItem[items][item];
              orderItems.push(itemInfo);
            }
          }
        }
      }

      if (orderItems.length === 0) {
        toast.error("Cart is empty. Please add items to proceed.");
        return;
      }

      let orderData = {
        userId: user.userId, // use user.userId here
        address: formData,
        items: orderItems,
        amount: getCartAmount(),
      };

      console.log("Frontend Order Data:", orderData);

      switch (method) {
        case "cod":
          const response = await axios.post(
            `${backendUrl}/api/order/place`,
            orderData,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          if (response.data.success) {
            setCartItems({});
            toast.success("Order placed successfully using Cash on Delivery!");
            navigate("/order");
          } else {
            toast.error(response.data.message);
          }
          break;

        case "stripe":
          const responseStripe = await axios.post(
            `${backendUrl}/api/order/stripe`,
            orderData,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          if (responseStripe.data.success) {
            const { session_url } = responseStripe.data;
            window.location.replace(session_url);
          } else {
            toast.error(responseStripe.data.message);
          }
          break;

        case "khalti":
          const responseKhalti = await axios.post(
            `${backendUrl}/api/order/khalti`,
            orderData,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          console.log("Khalti Response:", responseKhalti.data);

          if (responseKhalti.data.success) {
            const { session_url } = responseKhalti.data;
            window.location.replace(session_url);
          } else {
            toast.error(responseKhalti.data.message);
          }
          break;

        default:
          toast.error("Invalid payment method selected");
          break;
      }
    } catch (error) {
      console.error("Order Placement Error:", {
        message: error.message,
        response: error.response ? error.response.data : null,
        request: error.request ? error.request : null,
      });
      if (error.response) {
        toast.error(error.response.data.message || "Failed to place order");
      } else if (error.request) {
        toast.error("No response from server. Please try again.");
      } else {
        toast.error("Error setting up order request.");
      }
    }
  };

  return (
    <section className="place-order-section">
      <div className="container">
        <form
          onSubmit={onSubmitHandler}
          className="flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh]"
        >
          <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
            <div className="text-xl sm:text-2xl my-3">
              <Title text1="Delivery" text2="Information" />
            </div>
            <div className="flex gap-3">
              <input
                onChange={onChangeHandler}
                name="firstName"
                value={formData.firstName}
                className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
                type="text"
                placeholder="First Name"
                required
              />
              <input
                onChange={onChangeHandler}
                name="lastName"
                value={formData.lastName}
                className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
                type="text"
                placeholder="Last Name"
                required
              />
            </div>
            <input
              onChange={onChangeHandler}
              name="email"
              value={formData.email}
              className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
              type="email"
              placeholder="Email Address"
              required
            />
            <input
              onChange={onChangeHandler}
              name="street"
              value={formData.street}
              className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
              type="text"
              placeholder="Street"
              required
            />
            <div className="flex gap-3">
              <input
                onChange={onChangeHandler}
                name="city"
                value={formData.city}
                className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
                type="text"
                placeholder="City"
                required
              />
              <input
                onChange={onChangeHandler}
                name="state"
                value={formData.state}
                className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
                type="text"
                placeholder="State"
                required
              />
            </div>
            <div className="flex gap-3">
              <input
                onChange={onChangeHandler}
                name="zipcode"
                value={formData.zipcode}
                className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
                type="number"
                placeholder="ZipCode"
                required
              />
              <input
                onChange={onChangeHandler}
                name="country"
                value={formData.country}
                className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
                type="text"
                placeholder="Country"
                required
              />
            </div>
            <input
              onChange={onChangeHandler}
              name="phone"
              value={formData.phone}
              className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
              type="number"
              placeholder="Phone"
              required
            />
          </div>

          <div className="mt-8">
            <div className="mt-8 min-w-80">
              <CartTotal />
            </div>
            <div className="mt-12">
              <Title text1="Payment" text2="Method" />
              <div className="grid gap-3 grid-cols-1 lg:grid-cols-4 sm:grid-cols-2">
                {["cod", "stripe", "khalti"].map((payMethod) => (
                  <div
                    key={payMethod}
                    onClick={() => setMethod(payMethod)}
                    className="flex items-center gap-3 border p-2 px-3 cursor-pointer"
                  >
                    <p
                      className={`min-w-3.5 h-3.5 border rounded-full ${
                        method === payMethod ? "bg-green-400 border-green-400" : ""
                      }`}
                    ></p>
                    {payMethod !== "cod" ? (
                      assets[payMethod] ? (
                        <img src={assets[payMethod]} className="h-5" alt={payMethod} />
                      ) : (
                        <p className="text-red-500 text-sm">Image not found</p>
                      )
                    ) : (
                      <p className="text-gray-500 text-sm font-medium uppercase">
                        Cash on delivery
                      </p>
                    )}
                  </div>
                ))}
              </div>

              <div className="w-full text-end mt-8">
                <button type="submit" className="btn-black">
                  Place Order
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};

export default PlaceOrder;
