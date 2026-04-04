'use client';

import { FormEvent, useState } from 'react';
import { showErrorToast, showSuccessToast, showInfoToast } from './helpers/toast';
import Link from 'next/link';

type LeadModalProps = {
  buttonLabel: string;
  className?: string;
};

export default function LeadModal({ buttonLabel, className }: LeadModalProps) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [firstNameError, setFirstNameError] = useState(false);

  const baseurl = process.env.NEXT_PUBLIC_NODE_URL || 'http://localhost:5000';

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setEmailError(false);
    setFirstNameError(false);

    let hasError = false;
    if (!email) {
      setEmailError(true);
      hasError = true;
    }
    if (!firstName) {
      setFirstNameError(true);
      hasError = true;
    }

    if (hasError) {
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
      showSuccessToast("Success", "Subscribed Successfully");
      setEmail("");
      setFirstName("");
      setLastName("");
    } catch (error: any) {
      console.error("Subscription Error:", error);
      if (error?.message === "This email is already subscribed.") {
        showInfoToast("Info", "This email is already subscribed.");
      } else {
        showErrorToast("Error", "Error");
      }
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <button
        className={className ?? 'rounded-lg bg-ember px-5 py-3 font-semibold text-white shadow-[0_10px_24px_rgba(79,70,229,0.22)] hover:bg-[#4338ca]'}
        onClick={() => setOpen(true)}
      >
        {buttonLabel}
      </button>

      {open && (
        <div className="fixed inset-0 z-80 ">
          <button
            aria-label="Close modal"
            className="absolute inset-0 bg-black/55"
            onClick={() => setOpen(false)}
          />
          <div className="relative mx-auto mt-[14vh] w-[min(540px,92vw)] rounded-2xl border border-line bg-white p-6 shadow-2xl">
            <button className="absolute right-4 top-3 text-2xl text-clay" onClick={() => setOpen(false)}>
              ×
            </button>
            <h3 className="text-2xl font-bold">Get the Free Career Checklist</h3>
            <p className="mt-2 text-clay">Share your details and we will send the checklist to your email.</p>
            <form
              onSubmit={onSubmit}
              className="w-full flex flex-col sm:flex-row gap-2 flex-wrap p-2 md:p-4 ">
              <div className=" ">
                <div className="w-full text-left ">
                  <label className="text-sm font-bold pb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setEmailError(false);
                    }}
                    placeholder="example@email.com"
                    className={`border w-full ${emailError ? 'border-red-500' : 'border-gray-400'} rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black`}
                  />
                </div>
                <div className="flex gap-2 w-full pt-6 pb-3 text-left">
                  <div>
                    <label className="text-sm font-bold">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => {
                        setFirstName(e.target.value);
                        setFirstNameError(false);
                      }}
                      placeholder="First Name"
                      className={`border border-gray-400 rounded-md w-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black ${firstNameError ? 'border-red-500' : 'border-gray-400'}`}
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
                      className="border border-gray-400 rounded-md w-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                </div>
                <div className="text-xs text-gray-700 text-center w-full py-4 gap-2 items-center flex"><input className="accent-indigo-600" type="checkbox" /><span>By Subscribing you agree to our <Link href="https://careerboat.ai/privacy-policy" className="text-xs text-indigo-600 underline" target='blank'>Privacy Policy</Link></span></div>
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
      )}
    </>
  );
}
