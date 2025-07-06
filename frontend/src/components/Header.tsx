import React from "react";
import { ModeToggle } from "components/ModeToggle";

export const Header = () => {
  return (
    <header className="bg-black/30 backdrop-blur-lg border-b border-purple-400/20 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0">
            <h1 className="text-3xl font-bold tracking-tighter text-white">
              Grand Purp
            </h1>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <a
              href="#"
              className="font-semibold text-gray-300 hover:text-white transition-colors"
            >
              COA Decoder
            </a>
            <a
              href="#"
              className="font-semibold text-gray-300 hover:text-white transition-colors"
            >
              Blog
            </a>
            <a
              href="#"
              className="font-semibold text-gray-300 hover:text-white transition-colors"
            >
              About
            </a>
          </nav>
          <div className="flex items-center">
            <ModeToggle />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
