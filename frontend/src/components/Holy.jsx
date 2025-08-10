import React from "react";

const HoliBanner = () => {
  return (
    <div className="flex justify-center items-center  bg-gray-200">
      <div className="w-full max-w-3xl bg-white border-2 border-gray-300 shadow-lg rounded-md">
        {/* Rainbow Line */}
        <div className="h-1 bg-gradient-to-r from-orange-500 via-white to-green-500"></div>

        {/* Holi Banner */}
        <div className="m-4 p-4 border border-gray-300 bg-gradient-to-b from-yellow-100 to-red-100 relative overflow-hidden rounded-md">
          {/* Banner Header */}
          <div className="bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 text-white p-3 text-center rounded-md">
            <h2 className="text-2xl font-bold tracking-wide drop-shadow-md">Happy Holi!</h2>
          </div>
          
          <div className="flex justify-center items-center">

            <p className="text-lg font-bold text-gray-800 my-3">Festival of Colors</p>
            </div>
        




          {/* Banner Content */}
          <div className="relative text-center p-5">
            {/* Color Splashes */}
            <div className="absolute w-24 h-24 bg-orange-500 opacity-30 rounded-full top-10 left-10 mix-blend-multiply"></div>
            <div className="absolute w-20 h-20 bg-green-600 opacity-30 rounded-full top-20 right-10 mix-blend-multiply"></div>
            <div className="absolute w-16 h-16 bg-pink-500 opacity-30 rounded-full bottom-20 left-16 mix-blend-multiply"></div>
            <div className="absolute w-20 h-20 bg-blue-600 opacity-30 rounded-full bottom-24 right-14 mix-blend-multiply"></div>

            {/* Flowers */}
            {Array(4)
              .fill(null)
              .map((_, index) => (
                <div
                  key={index}
                  className={`absolute w-8 h-8 top-${[8, 10, 40, 48][index]} left-${[8, 80, 16, 64][index]} rotate-$[15, -10, 30, -20][index]`}
                >
                  <div className="absolute w-3 h-3 bg-orange-500 rounded-full top-0 left-2"></div>
                  <div className="absolute w-3 h-3 bg-green-600 rounded-full top-2 right-0"></div>
                  <div className="absolute w-3 h-3 bg-blue-600 rounded-full bottom-0 left-2"></div>
                  <div className="absolute w-3 h-3 bg-pink-500 rounded-full top-2 left-0"></div>
                  <div className="absolute w-3 h-3 bg-yellow-400 rounded-full top-2 left-2"></div>
                </div>
              ))}

            {/* <p className="text-lg font-bold text-gray-800 my-3">Festival of Colors</p> */}

            <img
              src="/images/holy.jpg"
              alt="Holi Festival of Colors"
              className="w-10/12 mx-auto rounded-md"
            />

            <p className="text-lg font-bold text-gray-800 my-3">Let's celebrate the victory of colors!</p>
          </div>
        </div>

        {/* Footer */}
        {/* <div className="bg-gray-100 text-gray-600 text-center text-sm py-2 border-t border-gray-300">
          © 2025 FriendsBook College Community
        </div> */}
      </div>
    </div>
  );
};

export default HoliBanner;
