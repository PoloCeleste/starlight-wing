import React, { useState } from "react";
import { Link } from "gatsby";
import AuthButtons from "../shared/AuthButtons";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav
      className={`w-full bg-gray-800 transition-all duration-300 ${
        isOpen ? "h-auto" : "h-18"
      }  min-w-[358px]`}
    >
      <div className="container mx-auto px-6 sm:px-8 lg:px-10">
        <div className="h-18 flex items-center justify-between">
          <Link to="/" className="text-white text-xl font-bold">
            별빛나래
          </Link>

          <div className="hidden lg:flex items-center justify-between flex-1 ml-8">
            <div className="flex gap-4 xl:gap-6">
              <Link to="/" className="text-white hover:text-gray-300">
                Home
              </Link>
              <Link to="/board" className="text-white hover:text-gray-300">
                Board
              </Link>
              <Link to="/calendar" className="text-white hover:text-gray-300">
                Calendar
              </Link>
              <Link
                to="/constellation"
                className="text-white hover:text-gray-300"
              >
                Constellation
              </Link>
              <Link to="/mypage" className="text-white hover:text-gray-300">
                MyPage
              </Link>
            </div>
            <AuthButtons />
          </div>

          <div className="flex items-center gap-2 sm:gap-4 lg:hidden">
            <AuthButtons />
            <button
              className="relative w-6 h-6 ml-4"
              onClick={() => setIsOpen(!isOpen)}
            >
              <span
                className={`absolute h-0.5 bg-white transition-all duration-300 ${
                  isOpen ? "w-0" : "w-6"
                }`}
              />
              <span
                className={`absolute h-0.5 w-6 bg-white transition-all duration-300 ${
                  isOpen ? "rotate-45 translate-y-0" : "-translate-y-1"
                }`}
              />
              <span
                className={`absolute h-0.5 w-6 bg-white transition-all duration-300 ${
                  isOpen ? "-rotate-45 translate-y-0" : "translate-y-1"
                }`}
              />
            </button>
          </div>
        </div>

        <div
          className={`
            transform transition-all duration-300 ease-in-out origin-top
            ${
              isOpen
                ? "translate-y-0 opacity-100 max-h-96 py-4"
                : "max-h-0 opacity-0 -translate-y-4 overflow-hidden py-0"
            }
            lg:hidden flex flex-col px-4
          `}
        >
          <div className="flex flex-col gap-4">
            <Link to="/" className="text-white hover:text-gray-300">
              Home
            </Link>
            <Link to="/board" className="text-white hover:text-gray-300">
              Board
            </Link>
            <Link to="/calendar" className="text-white hover:text-gray-300">
              Calendar
            </Link>
            <Link
              to="/constellation"
              className="text-white hover:text-gray-300"
            >
              Constellation
            </Link>
            <Link to="/mypage" className="text-white hover:text-gray-300">
              MyPage
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;