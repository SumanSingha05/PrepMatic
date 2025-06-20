


const Navbar = () => {
    return (
        <nav className="flex justify-between items-center px-8 py-4 bg-[radial-gradient(circle,_#1e3a8a_0%,_#000_100%)] h-25">
              

            <h1 className="text-[30px] font-bold text-white">Our website</h1>
            <div className="space-x-6 text-[20px] flex items-center gap-4">
                <a href="#about" className="mx-auto text-white hover:text-indigo-600">About</a>
                <a href="/login" className=" block w-fit bg-black text-white px-4 py-2 rounded-lg hover:scale-105 hover:-translate-y-2 transition-all hover:shadow-lg hover:shadow-indigo-400/70  border-2 border-indigo-700 transition">Login</a>
            </div>
        </nav>
    );
};

export default Navbar;
