import React, { useState } from 'react'
import { Typewriter } from 'react-simple-typewriter'


const handleDone = () => {};
const handleType = () => {};

const HeroSection = () => {
    
    return (
        <section className="relative flex flex-col justify-center items-center text-center py-20 px-6 h-150 bg-[radial-gradient(circle,_#1e3a8a_0%,_#000_100%)] backdrop-blur-sm overflow-hidden">
            <div className="relative z-10 w-full">
                

                <h2 className="text-4xl md:text-5xl font-bold mb-15 text-gray-400">
                    Turn Your Notes Into Smart MCQ Tests in Seconds
                </h2>
                <div className="mb-10">
                <span className = "text-purple-400 font-bold text-4xl">
                 <Typewriter
                    words={['Upload PDF', 'Give test', 'Enjoy!']}
                    loop={5}
                    cursor
                    cursorStyle='_'
                    typeSpeed={70}
                    deleteSpeed={50}
                    delaySpeed={1000}
                    onLoopDone={handleDone}
                    onType={handleType}
          />
                </span>
                </div>
                
                <a
                  href="/login"
                  className="block mx-auto w-fit bg-#001f3f text-white px-6 py-3 mt-15 rounded-lg border-2 border-indigo-600 text-lg  duration-300 transform hover:scale-105 hover:-translate-y-2 transition-all hover:shadow-lg hover:shadow-indigo-400/70 ">
                    Get Started
                </a>
                
            </div>
        </section>
    );
};

export default HeroSection;
