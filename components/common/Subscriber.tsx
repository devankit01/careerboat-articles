"use client";

import { useState } from "react";
import toast from "react-hot-toast";

export default function Subscriber() {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoading, setLoading] = useState(false);

  const baseurl =process.env.NEXT_PUBLIC_NODE_URL ||'http://localhost:5000';

  const handleSubscriber = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !firstName) {
      toast.error("Email & First Name are required went wrong");
      return;
    }
    const apiPayload = {
      email,
      firstName,
      lastName,
    };
    try {
      setLoading(true);
      const res = await fetch(`${baseurl}/api/article/subscribe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiPayload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.message || "Subscription failed");
      }
      toast.success("Subscribed successfully");
      setEmail("");
      setFirstName("");
      setLastName("");
    } catch (error) {
      console.error("Subscription Error:", error);
      toast.error(`${error}`);

    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="p-2 md:p-10">
      <div className="w-full p-4 md:px-10  flex flex-col md:flex-row items-start md:items-center justify-between gap-2 border border-gray-400 rounded-lg">

        {/* Left Content */}
        <div className="w-full md:w-[35%]">
          <h2 className="text-2xl font-semibold text-gray-900">
            Subscribe to get more updates.
          </h2>
          <p className="text-sm text-gray-500 mt-1">
           Stay ahead in your career. Get exclusive job tips, resume hacks, and interview strategies
          </p>
        </div>
        <div className="w-full md:w-[25%] hidden md:block ">
          <img src="/blog.jpg"  className="w-full object-cover"/>
        </div>
        {/* Right Form */}
        <form
          onSubmit={handleSubscriber}
          className="w-full md:w-[40%] flex flex-col sm:flex-row gap-3 flex-wrap  md:p-8 rounded-lg">
          <div className=" shadow-lg border border-gray-300 p-6 rounded-lg md:py-10">
            <div className="w-full ">
              <label className="text-sm font-bold">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                className="border w-full border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4F47E5]"
              />
            </div>
            <div className="flex gap-2 w-full pt-6 pb-3">
              <div>
                <label className="text-sm font-bold">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First Name"
                  className="border border-gray-300 rounded-md w-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4F47E5]"
                />
              </div>
              <div>
                <label className="text-sm font-bold">
                  Last Name
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last Name"
                  className="border border-gray-300 rounded-md w-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4F47E5]"
                />
              </div>
            </div>
            <div className="text-sm text-gray-700 text-center w-full py-4">By Subscribing you agree to our Privacy Policy</div>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-[#4F47E5] w-full text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-[#4F47E5] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all duration-150 ease-in-out"
            >
              {isLoading ? "Subscribing..." : "Subscribe"}
            </button>
          </div>
        </form>

      </div>
    </div>

  )

}
