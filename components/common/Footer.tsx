"use client";

import React from "react";
import Link from "next/link";
import { FaRegCopyright } from "react-icons/fa";
import { FaInstagram, FaLinkedinIn } from "react-icons/fa6";

const Footer = () => {
  const timeStamp = process.env.NEXT_PUBLIC_APP_TIMESTAMP;
  const version = process.env.NEXT_PUBLIC_APP_VERSION;

  return (
    <footer className="relative bg-[#e2e8f0] pt-8 pb-6">
      <div className="md:mx-10 px-3">
        <div className="flex flex-wrap text-left lg:text-left">
          <div className="w-full lg:w-[50%] px-4">
            <h4 className="md:text-2xl text-lg text-[#006b6a] font-bold text-primary">
              Careerboat.ai
            </h4>
            <h5 className="text-base my-2 text-black">
              Transforming how you build, track, and grow your career.{" "}
              <br className="md:block hidden" />
              Powered by AI.
            </h5>
            <div className="my-6 lg:mb-0 flex">
              <Link
                href="https://www.linkedin.com/company/careerboat-ai/"
                target="_blank"
                className="bg-white text-lightBlue-400 shadow-lg font-normal h-8 w-8 flex items-center justify-center rounded-full outline-none focus:outline-none mr-3"
              >
                <FaLinkedinIn className="text-[#0A66C2] w-5 h-5" />
              </Link>

              <Link
                href="https://www.instagram.com/careerboat.ai?igsh=MWsyZHl5a2djMTIwbQ=="
                target="_blank"
                className="bg-white text-pink-400 shadow-lg font-normal h-8 w-8 flex items-center justify-center rounded-full outline-none focus:outline-none mr-2"
              >
                <FaInstagram className="text-[#E1306C] w-5 h-5" />
              </Link>
            </div>
          </div>

          <div className="w-full lg:w-[50%] px-4 lg:pt-3">
            <div className="flex flex-wrap items-top lg:mb-6">
              <div className="w-[50%] lg:px-4 ml-auto">
                <span className="block uppercase text-blueGray-500 text-sm font-semibold mb-2">
                  Useful Links
                </span>
                <ul className="list-unstyled">
                  <li>
                    <Link
                      href="#"
                      className="text-blueGray-600 hover:text-blueGray-800 font-normal block pb-2 text-sm"
                    >
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="https://articles.careerboat.ai"
                      className="text-blueGray-600 hover:text-blueGray-800 font-normal block pb-2 text-sm"
                    >
                      Blogs
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="https://careerboat.ai/"
                      className="text-blueGray-600 hover:text-blueGray-800 font-normal block pb-2 text-sm"
                    >
                      Explore
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="w-[50%] lg:px-4">
                <span className="block uppercase text-blueGray-500 text-sm font-semibold mb-2">
                  Other Resources
                </span>
                <ul className="list-unstyled">
                  <li>
                    <Link
                      href="#"
                      className="text-blueGray-600 hover:text-blueGray-800 font-normal block pb-2 text-sm"
                    >
                      Terms &amp; Conditions
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="text-blueGray-600 hover:text-blueGray-800 font-normal block pb-2 text-sm"
                    >
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="https://careerboat.ai/"
                      className="text-blueGray-600 hover:text-blueGray-800 font-normal block pb-2 text-sm"
                    >
                      Contact Us
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <hr className="my-2 lg:my-6 border-[#e2e8f0]" />
        <div className="flex flex-wrap items-center md:justify-between justify-center">
          <div className="text-sm text-black mx-auto text-center justify-center font-normal py-1 flex gap-1 items-center">
            <FaRegCopyright className="w-3 h-3" />
            2025 Copyright Careerboat.ai All rights reserved.
          </div>
        </div>
        <span className=" text-gray-500 text-[8px] md:text-[10px] float-end ">
          {version} {timeStamp}
        </span>
      </div>
    </footer>
  );
};

export default Footer;
