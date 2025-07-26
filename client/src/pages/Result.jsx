import React, { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

const Result = () => {
  const { resultImage, image } = useContext(AppContext);
  const navigate = useNavigate();

  // Helper to format base64 string
  const getFormattedResult = (data) => {
    if (!data) return "";
    if (data.startsWith("data:image")) return data;
    return `data:image/png;base64,${data}`;
  };

  return (
    <div className="mx-4 my-3 lg:mx-44 mt-14 min-h-[70vh]">
      <div className="bg-white rounded-lg px-8 py-6 drop-shadow-sm">
        <div className="flex flex-col sm:grid grid-cols-2 gap-8">
          {/* Original Image */}
          <div>
            <p className="font-semibold text-gray-600 mb-2">Original</p>
            <img
              className="rounded-md border max-h-[400px] object-contain"
              src={image ? URL.createObjectURL(image) : ""}
              alt="Original"
            />
          </div>

          {/* Background Removed */}
          <div className="flex flex-col">
            <p className="font-semibold text-gray-600 mb-2">Background Removed</p>
            <div className="rounded-md border border-gray-300 h-full relative bg-layer overflow-hidden flex items-center justify-center">
              {resultImage ? (
                <img
                  className="rounded-md border max-h-[400px] object-contain"
                  src={getFormattedResult(resultImage)}
                  alt="Result"
                  onError={() => console.error("Failed to load processed image")}
                />
              ) : image ? (
                <div className="border-4 border-violet-600 rounded-full h-12 w-12 border-t-transparent animate-spin"></div>
              ) : null}
            </div>
          </div>
        </div>

        {/* Buttons */}
        {resultImage && (
          <div className="flex justify-center sm:justify-end items-center flex-wrap gap-4 mt-6">
            <button
              className="px-8 py-2.5 text-violet-600 text-sm border border-violet-600 rounded-full hover:scale-105 transition-all duration-500"
              onClick={() => navigate("/")} // Replace with a reset function if needed
            >
              Try another image
            </button>
            <a
              className="px-8 py-2.5 text-white text-sm bg-gradient-to-r from-violet-600 to-fuchsia-500 rounded-full hover:scale-105 transition-all duration-500"
              href={getFormattedResult(resultImage)}
              download="bg_removed.png"
            >
              Download image
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default Result;
