import { useEffect, useState } from "react";
import { FaArrowUp } from "react-icons/fa";
import { scrollToTopSmooth } from "../../utils/scrollToTop";
const GoToTop = () => {
  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (window.pageYOffset > 300) {
        setShowScroll(true);
      } else {
        setShowScroll(false);
      }
    });
  }, []);

  // // this function is used to scroll to the top of the page
  // const scrollTop = () => {
  //   window.scrollTo({ top: 0, behavior: "auto" });
  // };

  return (
    <div>
      {showScroll && (
        <div
          onClick={scrollToTopSmooth}
          className="fixed  right-5 bottom-10 rounded-full hover:bg-green-600/50 bg-orange-500 w-[40px] h-[40px] grid place-items-center cursor-pointer"
        >
          <FaArrowUp color="white" />
        </div>
      )}
    </div>
  );
};

export default GoToTop;
