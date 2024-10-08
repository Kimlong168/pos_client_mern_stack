import { assets } from "@/assets/assets";
import { AuthContext } from "@/contexts/AuthContext";
import { useContext, useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { Link, useLocation, useNavigate } from "react-router-dom";
import isSameDate from "@/utils/isSameDate";
import { MdOutlineArrowBackIos, MdOutlineCheckCircle } from "react-icons/md";
import {
  useCheckInAttendance,
  useCheckOutAttendance,
} from "@/hooks/attendance/useAttendance";
import { notify } from "@/utils/toastify";
import { getFormattedTimeWithAMPM } from "@/utils/getFormattedDate";
import ConfirmModal from "@/components/ui/ConfirmModal";
const WORK_START_TIME = new Date().setHours(9, 0, 0); // 9:00 AM
const WORK_END_TIME = new Date().setHours(17, 0, 0); // 5:00 PM

const StaffProfile = () => {
  const { user } = useContext(AuthContext);
  const checkIn = useCheckInAttendance();
  const checkOut = useCheckOutAttendance();
  const navigate = useNavigate();
  const location = useLocation();
  const getQueryParam = (param) => {
    const searchParams = new URLSearchParams(location.search);
    return searchParams.get(param);
  };
  const attValue = getQueryParam("att");
  const attendances = JSON.parse(localStorage.getItem("attendances"));
  const [showModal, setShowModal] = useState(false);
  const [scannerResult, setScannerResult] = useState(attValue || null);

  const isCheckIn = attendances
    ? attendances.find(
        (att) =>
          att.employee === user._id && isSameDate(att.time_in, new Date())
      )
    : null;

  useEffect(() => {
    // prevent from displaying the scanner multiple times
    if (document.getElementById("reader")?.innerHTML !== "") return;

    const scanner = new Html5QrcodeScanner("reader", {
      qrbox: {
        width: 250,
        height: 250,
      },
      fps: 10,
    });

    scanner.render(success, error);

    async function success(result) {
      scanner.clear();
      if (result.includes("http")) {
        const url = new URL(result);
        const searchParams = new URLSearchParams(url.search);
        setScannerResult(searchParams.get("att"));
      } else {
        setScannerResult(result);
      }
    }

    function error() {
      console.warn("error");
      // notify("Error", "error");
    }
  }, []);

  // handle check in
  const handleCheckIn = async (event) => {
    event.preventDefault();

    let latitude = 0;
    let longitude = 0;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          latitude = position.coords.latitude;
          longitude = position.coords.longitude;
          const currentTime = new Date();

          let checkInStatus = "";
          let lateDuration = 0;

          if (new Date(currentTime).getTime() <= WORK_START_TIME) {
            checkInStatus = "On Time";
          } else {
            checkInStatus = "Late";
            const timeDifference =
              new Date(currentTime).getTime() - WORK_START_TIME;
            const lateDurationInMn = Math.abs(timeDifference / 60000);

            // Convert minutes to hours, minutes, and seconds
            const hours = Math.floor(lateDurationInMn / 60);
            const minutes = Math.floor(lateDurationInMn % 60);
            const seconds = Math.floor((lateDurationInMn * 60) % 60);

            // Format as h:mm:ss
            lateDuration = `${hours}h ${minutes}m ${seconds}s`;
            notify(`You are late for ${lateDuration}`, "info");
          }

          const isSuccess = await checkIn.mutateAsync({
            qr_code: scannerResult,
            employee: user._id,
            time_in: currentTime,
            check_in_status: checkInStatus,
            latitude: latitude,
            longitude: longitude,
            checkInLateDuration: lateDuration,
          });

          if (isSuccess.status === "success") {
            notify("Check in successfully", "success");
            setScannerResult(null);
            // save each record as an array but make sure the employee is not the same
            if (attendances) {
              const todayAttendances = attendances.filter((att) =>
                isSameDate(att.time_in, new Date())
              );

              localStorage.setItem(
                "attendances",
                JSON.stringify([...todayAttendances, isSuccess.data])
              );
            } else {
              localStorage.setItem(
                "attendances",
                JSON.stringify([isSuccess.data])
              );
            }

            navigate("/user/profile");
          }

          if (isSuccess.status === "error") {
            notify(isSuccess.error.message, "info");
            setScannerResult(null);
          }
        },
        (err) => {
          notify(`ERROR(${err.code}): ${err.message}`, "error");
          setScannerResult(null);
        },
        {
          enableHighAccuracy: true, // Forces the use of GPS or a more accurate method
          timeout: 10000, // Maximum time allowed to wait for a position (in milliseconds)
          maximumAge: 0, // Don't accept a cached location
        }
      );
    } else {
      notify("Geolocation is not supported by this browser.", "error");
    }
  };

  // handle check out
  const handleCheckOut = async (event) => {
    event.preventDefault();
    setShowModal(false);
    let latitude = 0;
    let longitude = 0;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          latitude = position.coords.latitude;
          longitude = position.coords.longitude;
          const currentTime = new Date();

          let checkOutStatus = "";
          let earlyDuration = 0;

          // Assuming WORK_END_TIME is defined and represents the end of the workday
          if (new Date(currentTime).getTime() >= WORK_END_TIME) {
            checkOutStatus = "Checked Out";
          } else {
            const timeDifference =
              new Date(currentTime).getTime() - WORK_END_TIME;
            const earlyDurationInMn = Math.abs(timeDifference / 60000);

            // Convert minutes to hours, minutes, and seconds
            const hours = Math.floor(earlyDurationInMn / 60);
            const minutes = Math.floor(earlyDurationInMn % 60);
            const seconds = Math.floor((earlyDurationInMn * 60) % 60);

            // Format as h:mm:ss
            earlyDuration = `${hours}h ${minutes}m ${seconds}s`;

            checkOutStatus = "Early Check-out";
            notify(`You checked out early by ${earlyDuration}`, "info");
          }

          const isSuccess = await checkOut.mutateAsync({
            qr_code: isCheckIn.qr_code,
            employee: user._id,
            time_out: currentTime,
            check_out_status: checkOutStatus,
            latitude: latitude,
            longitude: longitude,
            checkOutEarlyDuration: earlyDuration,
          });

          if (isSuccess.status === "success") {
            notify("Check out successfully", "success");
            setScannerResult(null);
            // save each record as an array but make sure the employee is not the same
            if (attendances) {
              const todayAttendances = attendances.filter((att) =>
                isSameDate(att.time_in, new Date())
              );

              const updatedAttendances = todayAttendances.map((att) => {
                if (att.employee === user._id) {
                  return { ...att, ...isSuccess.data };
                }
                return att;
              });

              localStorage.setItem(
                "attendances",
                JSON.stringify(updatedAttendances)
              );
            } else {
              localStorage.setItem(
                "attendances",
                JSON.stringify([isSuccess.data])
              );
            }

            navigate("/user/profile");
          }

          if (isSuccess.status === "error") {
            notify(isSuccess.error.message, "info");
            setScannerResult(null);
          }
        },
        (err) => {
          notify(`ERROR(${err.code}): ${err.message}`, "error");
          setScannerResult(null);
        },
        {
          enableHighAccuracy: true, // Forces the use of GPS or a more accurate method
          timeout: 10000, // Maximum time allowed to wait for a position (in milliseconds)
          maximumAge: 0, // Don't accept a cached location
        }
      );
    } else {
      notify("Geolocation is not supported by this browser.", "error");
    }
  };

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
          <Link to="/">
            <button className="mt-4 flex items-center gap-2 text-white w-fit px-2 py-2 bg-red-500 hover:bg-orange-600 border border-gray-300 rounded-xl top-0 left-4 absolute">
              <MdOutlineArrowBackIos />
            </button>
          </Link>
          {isCheckIn ? (
            <div>
              <div className="font-semibold mb-2">
                Today, You have checked in{isCheckIn.time_out && "/checked out"}{" "}
                already ✅
              </div>

              <table>
                <tr>
                  <td className="pr-12">Time In:</td>
                  <td className="pr-12 truncate">
                    {getFormattedTimeWithAMPM(isCheckIn.time_in)} (
                    {isCheckIn.check_in_status}
                    {isCheckIn.check_in_status == "Late" &&
                      " " + isCheckIn.checkInLateDuration}
                    )
                  </td>
                </tr>
                <tr>
                  <td className="pr-12 truncate">Time Out:</td>
                  <td className="pr-12">
                    {isCheckIn.time_out ? (
                      getFormattedTimeWithAMPM(isCheckIn.time_out) +
                      ` (${isCheckIn.check_out_status}${
                        isCheckIn.check_out_status === "Early Check-out"
                          ? " " + isCheckIn.checkOutEarlyDuration
                          : ""
                      })`
                    ) : (
                      <button
                        disabled={checkOut.isLoading}
                        onClick={(e) => {
                          e.preventDefault();
                          setShowModal(true);
                        }}
                        className={`text-blue-400 ${
                          !checkOut.isLoading && "underline"
                        } cursor-pointer hover:text-blue-600`}
                      >
                        {checkOut.isLoading
                          ? "Checking Out..."
                          : "Check Out Now?"}
                      </button>
                    )}
                  </td>
                </tr>
              </table>
            </div>
          ) : scannerResult ? (
            <div>
              <button
                disabled={checkIn.isLoading}
                className="mt-3 text-white w-full px-3 py-3 bg-green-500 hover:bg-green-600 border border-gray-300 rounded-md flex items-center justify-center gap-2"
                onClick={handleCheckIn}
              >
                {checkIn.isLoading ? "Checking In..." : "Check In Now"}{" "}
                <MdOutlineCheckCircle />
              </button>
            </div>
          ) : (
            <div>
              <h3 className="text-center font-semibold mb-1">
                Scan Qrcode to Record Attendance
              </h3>
              <div id="reader" className="w-full max-h-[350px]"></div>
            </div>
          )}
        </form>
      </div>

      <ConfirmModal
        show={showModal}
        setShow={setShowModal}
        title="Check Out"
        message="Are you sure you want to check out now?"
        onConfirm={handleCheckOut}
      />
    </div>
  );
};

export default StaffProfile;
