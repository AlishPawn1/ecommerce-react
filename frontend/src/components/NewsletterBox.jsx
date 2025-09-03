import React, { useState } from "react";
import { toast } from "react-toastify";
import { backendUrl } from "../App";

const handleSubscribe = async (email) => {
  const res = await fetch(`${backendUrl}/api/subscribe`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  const data = await res.json();
  if (!data.success && data.error === "Invalid email address")
    throw new Error(data.error);
  if (!data.success && data.error) throw new Error(data.error);
  if (
    data.message &&
    data.message.toLowerCase().includes("already subscribed")
  ) {
    throw new Error("already-subscribed");
  }
};

const NewsletterBox = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setStatus(null);
    setErrorMsg("");

    if (!/^[^@]+@[^@]+\.[^@]+$/.test(email)) {
      setStatus("error");
      setErrorMsg("Please enter a valid email address.");
      toast.error("Please enter a valid email address.");
      return;
    }

    setStatus("loading");
    try {
      await handleSubscribe(email);
      setStatus("success");
      setEmail("");
      toast.success("Thank you for subscribing!");
    } catch (err) {
      if (err.message === "already-subscribed") {
        setStatus("success");
        setEmail("");
        setErrorMsg("");
        toast.info("This email is already subscribed.");
        return;
      }
      setStatus("error");
      setErrorMsg(err.message || "Subscription failed. Please try again.");
      toast.error(err.message || "Subscription failed. Please try again.");
    }
  };

  return (
    <section className="newsletter-section my-10 pt-10">
      <div className="container mx-auto text-center px-4">
        <h2 className="text-2xl font-medium text-gray-800">
          Subscribe now & get 20% off
        </h2>
        <p className="text-gray-400 mt-3">
          Stay updated with our latest offers
        </p>

        <form
          onSubmit={onSubmitHandler}
          className="w-full sm:w-1/2 flex items-center gap-3 mx-auto my-6 border pl-3 rounded"
        >
          <input
            type="email"
            placeholder="Enter your email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full sm:flex-1 outline-none py-2 px-3 "
            aria-label="Email address"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="bg-black text-white text-xs px-10 py-3 uppercase cursor-pointer rounded-r hover:bg-gray-800 transition"
            aria-disabled={status === "loading"}
          >
            {status === "loading" ? "Subscribing..." : "Subscribe"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default NewsletterBox;
