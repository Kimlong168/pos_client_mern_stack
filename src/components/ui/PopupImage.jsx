import PropTypes from "prop-types";
import { useState } from "react";
import { AiOutlineFullscreenExit } from "react-icons/ai";

const PopupImage = ({ image }) => {
  const [showImage, setShowImage] = useState(false);
  return (
    <>
      {showImage ? (
        <div className="relative">
          <div className="fixed inset-0  bg-black/70 z-[1000] flex justify-center items-center p-4">
            <div
              onClick={() => setShowImage(false)}
              className="relative max-w-[500px] max-h-[600px] min-h-[200px] min-w-[200px] overflow-hidden border-2 border-gray-700 rounded-xl"
            >
              {/* image */}
              <img
                className="object-fill w-full h-full bg-white p-2"
                src={image}
                alt={image}
                onError={(e) =>
                  (e.target.src = "https://via.placeholder.com/150")
                }
              />
              {/* icon */}
              <div className="absolute top-0 right-0 cursor-pointer bg-red-500 rounded-bl-lg p-1.5  text-white font-bold">
                <AiOutlineFullscreenExit />
              </div>
            </div>
          </div>
          <img
            src={image}
            className="w-full h-full cursor-pointer rounded max-h-[100px] max-w-[100px]"
          />
        </div>
      ) : (
        <img
          src={image}
          onClick={() => setShowImage(true)}
          className="w-full h-full cursor-pointer rounded max-h-[100px] max-w-[100px]"
        />
      )}
    </>
  );
};
PopupImage.propTypes = {
  image: PropTypes.string.isRequired,
};
export default PopupImage;
