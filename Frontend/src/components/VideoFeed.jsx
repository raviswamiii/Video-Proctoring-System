import React from "react";

export const VideoFeed = () => {
  return (
    <div className="w-full bg-gradient-to-br from-indigo-100 via-white to-indigo-200 h-screen flex flex-col justify-center items-center gap-3">
      <div className="bg-black h-[70%] w-[70%] rounded-xl relative">
        <p className="text-sm text-gray-800 font-semibold absolute bottom-3 left-3 bg-gray-400 rounded-sm px-2">
          Ravi Swami(You)
        </p>
      </div>
      <div className="flex gap-3">
        <button className="bg-green-500 hover:bg-green-600 cursor-pointer text-white px-10 py-3 text-xl font-semibold rounded-xl">
          Start
        </button>
        <button className="bg-red-500 hover:bg-red-600 cursor-pointer text-white px-10 py-3 text-xl font-semibold rounded-xl">
          Stop
        </button>
      </div>
    </div>
  );
};
