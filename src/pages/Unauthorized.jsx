import { Link } from "react-router-dom";
const Unauthenticated = () => {
  return (
    <>
      <div className="w-min-screen overflow-hidden">
        <div className="bg-errorPage flex items-center justify-center min-h-screen  bg-fixed bg-cover bg-bottom error-bg">
          <div className="container">
            <div className="row">
              <div className="col-sm-8 offset-sm-2 text-orange-600 text-center -mt-52">
                <div className="relative ">
                  <h1 className="relative text-9xl tracking-tighter-less text-shadow font-sans font-bold">
                    <span>4</span>
                    <span>0</span>
                    <span>1</span>
                  </h1>
                  <span className="absolute  top-0   -ml-12  text-orange-700 font-semibold">
                    Oops!
                  </span>
                </div>
                <h5 className="text-orange-700 font-semibold -mr-10 -mt-3">
                  Unauthorized
                </h5>
                <p className="text-gray-700 mt-2 mb-6 ">
                  We are sorry, but you are not authorized to access this page!
                </p>
                <Link
                  to="/"
                  className=" px-5 py-3 text-sm shadow-lg font-medium tracking-wider text-white border rounded-full hover:shadow-xl btn btn-sm bg-orange-600 hover:bg-white hover:border-orange-600 hover:text-orange-60 focus:outline-none transition duration-500 ease-in-out"
                >
                  Go to Home Page
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Unauthenticated;
