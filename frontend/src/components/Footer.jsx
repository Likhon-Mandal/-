import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-footer text-orange-100 py-4 mt-auto">
      <div className="container mx-auto px-4 text-center opacity-60 text-xs">
        &copy; {new Date().getFullYear()} বাড়ৈ বংশের ইতিবৃত্ত. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
