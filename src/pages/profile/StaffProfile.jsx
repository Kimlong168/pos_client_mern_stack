import { assets } from "@/assets/assets";
import { AuthContext } from "@/contexts/AuthContext";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { MdOutlineArrowBackIos } from "react-icons/md";

const StaffProfile = () => {
  const { user } = useContext(AuthContext);

  return (
    <div
      className={`flex justify-center items-center relative h-screen bg-black/70`}
    >
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md relative m-2">
        <h2 className="text-2xl font-bold mb-4 text-center">Profile</h2>
        <div>
          <img
            className="w-[100px] h-[100px] rounded-full border-2 border-orange-500 p-[1px] mx-auto"
            src={user.profile_picture || assets.default_profile}
            alt=""
          />
        </div>

        {/* User Info Form */}
        <form className="space-y-4">
          <div>
            <label className="block text-gray-700">Name</label>
            <input
              value={user.name}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-gray-700">Email</label>
            <input
              value={user.email}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              readOnly
            />
          </div>
          <div>
            <label className="block text-gray-700">Role</label>
            <input
              value={user.role}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              readOnly
            />
          </div>

          <div className="flex gap-2 w-full">
            <Link to="/user/attendance" className="w-full">
              <button className="w-full text-white bg-green-600 hover:bg-green-700 px-3 py-2 border border-gray-300 rounded-md">
                Check Attendance
              </button>
            </Link>

            <Link to="/user/leaveRequest" className="w-full">
              <button className="w-full text-white bg-blue-600 hover:bg-blue-700  px-3 py-2 border border-gray-300 rounded-md">
                Request Leave
              </button>
            </Link>
          </div>
        </form>

        <Link to="/">
          <button className="mt-4 flex items-center gap-2 text-white w-fit px-2 py-2 bg-red-500 hover:bg-orange-600 border border-white rounded-xl top-0 left-4 fixed">
            <MdOutlineArrowBackIos />
          </button>
        </Link>
      </div>
    </div>
  );
};

export default StaffProfile;
