import { useContext, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { notify } from "../../utils/toastify";
import { IoMdEyeOff, IoMdEye } from "react-icons/io";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { assets } from "@/assets/assets";
const Login = () => {
  const { login } = useContext(AuthContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
    isCheck: false,
  });
  const navigate = useNavigate();

  const location = useLocation();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!credentials.email || !credentials.password) {
      return notify("Please fill all the fields!", "error");
    }

    if (!credentials.isCheck) {
      return notify("Please accept the terms and conditions!", "error");
    }

    setIsSubmitting(true);
    const result = await login(credentials);

    if (result) {
      notify("Login successful");

      const getQueryParam = (param) => {
        const searchParams = new URLSearchParams(location.search);
        return searchParams.get(param);
      };
      const attValue = getQueryParam("att");

      if (attValue) {
        navigate(`/user/profile?att=${attValue}`);
      } else {
        navigate("/");
      }
    } else {
      setIsSubmitting(false);
      notify("Login fail!", "error");
    }
  };

  const handleOnChange = (e) => {
    if (e.target.name === "isCheck") {
      setCredentials({ ...credentials, [e.target.name]: e.target.checked });
      return;
    }
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <div className="relative bg-black/70 h-screen grid place-content-center">
      <div className="flex justify-center items-center p-4">
        <div className="bg-white w-[370px] py-6 px-7 rounded-lg">
          <div>
            <img
              width={100}
              className="mx-auto mb-4"
              src={assets.logo}
              alt="logo"
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="font-bold text-xl">Login</span>
          </div>

          <form onSubmit={handleLogin}>
            <div className="flex flex-col gap-6 mt-8">
              <input
                onChange={handleOnChange}
                name="email"
                className="border p-2 rounded  focus:outline-orange-500"
                type="text"
                placeholder="Your email"
              />
              <div className="relative">
                <input
                  name="password"
                  onChange={handleOnChange}
                  className="border p-2 pr-8 rounded focus:outline-orange-500 w-full"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                />

                <div className="absolute right-3 top-[50%] -translate-y-[50%]">
                  <span
                    className="cursor-pointer"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? (
                      <IoMdEye className="text-gray-600" />
                    ) : (
                      <IoMdEyeOff className="text-gray-600" />
                    )}
                  </span>
                </div>
              </div>
            </div>
            <button
              disabled={isSubmitting}
              className="mt-7 bg-orange-600 text-white text-center w-full py-1.5 rounded"
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </button>

            <div className="mt-2 flex items-center gap-2">
              <input onChange={handleOnChange} type="checkbox" name="isCheck" />
              <span className="text-xs text-gray-500">
                By continuing, you agree to accept our Privacy Policy & Terms of
                Service.
              </span>
            </div>
          </form>

          <div>
            <Link to="/forget-password">
              {" "}
              <p className="mt-4 text-xs text-gray-500 hover:text-orange-600 cursor-pointer">
                Forget password? {/* <Link to="/sign-up"> */} {/* </Link> */}
              </p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
