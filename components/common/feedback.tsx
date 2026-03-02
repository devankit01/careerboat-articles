"use client";

import { useState } from "react";
import toast from "react-hot-toast";

export default function Feedback() {
    const [message, setMessage] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [errors, setErrors] = useState<{
        name?: string;
        email?: string;
        message?: string;
    }>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validateEmail = (value: string) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value) return "Email is required";
        if (!regex.test(value)) return "Please enter a valid email address";
        return "";
    };
    const handleSubmit = async () => {
        const newErrors: any = {};
        if (!name.trim()) {
            newErrors.name = "Name is required";
        }
        const emailError = validateEmail(email);
        if (emailError) {
            newErrors.email = emailError;
        }
        if (!message.trim()) {
            newErrors.message = "Message is required";
        }
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});
        setIsSubmitting(true);
        setIsSubmitting(true);
        try {
            const res = await fetch("/api/feedback/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    email,
                    subject: "articles",
                    message,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                // console.log("Backend error:", data);
                toast.error("Error Something went wrong" )
                return;
            }

            toast.success("Feedback sent");

        } catch (err) {
            console.error("Error Something went wrong", err);
            toast.error("Error Something went wrong");
        }
        finally {
            setMessage("");
            setEmail("")
            setName("")
            setIsSubmitting(false);
        }
    };

    const handleReset = () => {
        setMessage("");
        setEmail("")
        setName("")
        setErrors({})
    }

    return (
        <>
            <div className="  rounded-xl  shadow-sm w-full bg-[#4F47E5]">
                <h3 className="font-semibold text-lg p-2 text-white rounded-t-xl ">Feedback</h3>
                <div className=' p-4 bg-white rounded-b-xl m-0 border border-gray-300'>
                    <div className="relative">
                        <label className="block text-sm font-semibold text-black mb-1 [font-family:Figtree]" style={{  fontWeight: 400 }}>Name*</label>
                        <input type='text'
                            className={`w-full border font-normal rounded-lg p-2 text-sm mb-2 [font-family:Figtree] placeholder:[font-family:Figtree] ${errors.name ? "border-red-500" : ""}`}
                            style={{
                                height: '40px',
                                padding: '10px 12px',
                                borderColor: errors.name ? undefined : 'rgba(229, 231, 235, 1)',
                                borderWidth: '1px'
                            }}
                            placeholder="Enter your name"
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value)
                                if (errors.name) {
                                    setErrors((prev) => ({
                                        ...prev,
                                        name: e.target.value ? "" : "Name is required",
                                    }));
                                }
                            }
                            }
                        />
                        {errors.name && <p className="text-red-500 text-xs mt-1 [font-family:Figtree]">{errors.name}</p>}
                        <label className="block text-sm text-black font-semibold mb-1 [font-family:Figtree]" style={{ fontWeight: 400 }}>Email*</label>
                        <input type='email'
                            className={`w-full border  rounded-lg p-2 text-sm mb-2 placeholder:[font-family:Figtree] ${errors.email ? "border-red-500" : "border-black"}`}
                            style={{
                                // height: '40px',
                                padding: '10px 12px',
                                borderColor: errors.email ? undefined : 'rgba(229, 231, 235, 1)',
                                borderWidth: '1px'
                            }}
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                if (errors.email) setErrors((prev) => ({
                                    ...prev,
                                    email: validateEmail(e.target.value),
                                }));
                            }}
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1 [font-family:Figtree]">{errors.email}</p>}

                        <label className="block text-sm text-black font-semibold mb-1 [font-family:Figtree]" style={{ fontWeight: 400 }}>Message*</label>
                        <textarea
                            rows={3}
                            className={`w-full border rounded-lg p-2 text-sm resize-none ${errors.message ? "border-red-500" : ""
                                }`}
                            style={{
                                padding: '10px 12px',
                                borderColor: errors.message ? undefined : 'rgba(229, 231, 235, 1)',
                                borderWidth: '1px'
                            }}
                            placeholder="Type your message..."
                            value={message}
                            onChange={(e) => {
                                setMessage(e.target.value);

                                if (errors.message) {
                                    setErrors((prev) => ({
                                        ...prev,
                                        message: e.target.value ? "" : "Message is required",
                                    }));
                                }
                            }}
                        />
                        {errors.message && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.message}
                            </p>
                        )}
                    </div>
                    <div className="mt-4 flex justify-start gap-2">
                        <button className="bg-white text-[#4F47E5]  border border-[#4F47E5] px-4 py-2 text-sm font-bold hover:bg-gray-50 rounded-lg hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all duration-150 ease-in-out"
                            onClick={handleReset}
                        >
                            Cancel
                        </button>
                        <button
                            disabled={isSubmitting}
                            onClick={handleSubmit}
                            className={`bg-[#4F47E5] text-white border border-gray-200 px-4 py-2  text-sm font-bold rounded-lg hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all duration-150 ease-in-out ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                            {isSubmitting ? "Submitting..." : "Submit"}
                        </button>
                    </div>
                </div>
            </div>

        </>
    )
}