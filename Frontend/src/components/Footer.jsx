import React from 'react';

const Footer = () => {
    return (
        <footer
            className="relative py-12 px-6 bg-[radial-gradient(circle,_#0A0A2A_0%,_#000000_100%)] text-center text-gray-300 overflow-hidden" // Directly matching Hero Section's background
        >
            {/* Subtle background gradient overlay for depth */}
            <div className="absolute inset-0 opacity-20 z-0">
                <div className="absolute -top-1/4 -left-1/4 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob-slowest"></div>
                <div className="absolute -bottom-1/4 -right-1/4 w-64 h-64 bg-fuchsia-600 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob-slowest animation-delay-3000"></div>
            </div>

            <div className="relative z-10 max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center space-y-8 md:space-y-0">
                {/* Brand Name/Logo */}
                <div className="flex flex-col items-center md:items-start">
                    <h4
                        className="text-4xl font-extrabold tracking-tight mb-2
                       bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-fuchsia-400"
                    >
                        Your Brand
                    </h4>
                    <p className="text-sm text-gray-400 max-w-xs md:text-left">
                        Empowering your learning journey with intelligent, AI-powered study tools.
                    </p>
                </div>

                {/* Navigation/Important Links */}
                <div className="flex flex-col items-center md:items-start space-y-3">
                    <h5 className="text-xl font-semibold text-white mb-2">Quick Links</h5>
                    <a href="#about" className="text-gray-400 hover:text-fuchsia-400 transition-colors duration-300">About Us</a>
                    <a href="/privacy" className="text-gray-400 hover:text-fuchsia-400 transition-colors duration-300">Privacy Policy</a>
                    <a href="/terms" className="text-gray-400 hover:text-fuchsia-400 transition-colors duration-300">Terms of Service</a>
                </div>

                {/* Social Media/Contact (Placeholder) */}
                <div className="flex flex-col items-center md:items-start space-y-3">
                    <h5 className="text-xl font-semibold text-white mb-2">Connect</h5>
                    <div className="flex space-x-4">
                        {/* Replace with actual social media icons/links */}
                        <a href="#" className="text-gray-400 hover:text-fuchsia-400 transition-colors duration-300">
                            <i className="fab fa-twitter text-2xl"></i> {/* Example: Font Awesome icon */}
                        </a>
                        <a href="#" className="text-gray-400 hover:text-fuchsia-400 transition-colors duration-300">
                            <i className="fab fa-linkedin-in text-2xl"></i>
                        </a>
                        <a href="#" className="text-gray-400 hover:text-fuchsia-400 transition-colors duration-300">
                            <i className="fab fa-github text-2xl"></i>
                        </a>
                    </div>
                    <p className="text-sm text-gray-400 mt-4">
                        <a href="mailto:contact@yourbrand.com" className="hover:text-fuchsia-400 transition-colors duration-300">
                            contact@yourbrand.com
                        </a>
                    </p>
                </div>
            </div>

            {/* Copyright */}
            <div className="mt-12 pt-8 border-t border-gray-800">
                <p className="text-gray-500 text-sm">
                    &copy; {new Date().getFullYear()} **[Your Brand]**. All rights reserved.
                </p>
            </div>
        </footer>
    );
};

export default Footer;