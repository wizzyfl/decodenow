import React from "react";

export const Footer = () => {
  return (
    <footer className="bg-black/30 backdrop-blur-lg border-t border-purple-400/20 mt-12 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-400">
        <p className="font-semibold">Powered by Grand Purp</p>
        <p className="text-xs mt-4">
          This tool is for informational purposes only and does not constitute
          medical or legal advice.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
