import ExportToExcel from "@/components/table/ExportToExcel";
import ExportToPDF from "@/components/table/ExportToPDF";
import ConfirmModal from "@/components/ui/ConfirmModal";
import Loading from "@/components/ui/Loading";
import { AuthContext } from "@/contexts/AuthContext";
import {
  useAttendancesByEmployeeId,
  useCheckInAttendance,
  useCheckOutAttendance,
} from "@/hooks/attendance/useAttendance";
import {
  getFormattedDate,
  getFormattedTimeWithAMPM,
} from "@/utils/getFormattedDate";
import isSameDate from "@/utils/isSameDate";
import { notify } from "@/utils/toastify";
import { Html5QrcodeScanner } from "html5-qrcode";
import { useContext, useEffect, useState } from "react";
import { IoIosArrowDropdown, IoIosArrowDropup } from "react-icons/io";
import { MdOutlineArrowBackIos, MdOutlineCheckCircle } from "react-icons/md";
import { Link, useLocation, useNavigate } from "react-router-dom";
const WORK_START_TIME = new Date().setHours(9, 0, 0); // 9:00 AM
const WORK_END_TIME = new Date().setHours(17, 0, 0); // 5:00 P
// const IPINFO_API_KEY = import.meta.env.VITE_APP_IPINFO_API_KEY;
const CheckInCheckOut = () => {
  const { user } = useContext(AuthContext);
  const {
    data: attendances,
    isLoading,
    refetch,
  } = useAttendancesByEmployeeId(user._id);
  const checkIn = useCheckInAttendance();
  const checkOut = useCheckOutAttendance();
  const navigate = useNavigate();
  const location = useLocation();
  const getQueryParam = (param) => {
    const searchParams = new URLSearchParams(location.search);
    return searchParams.get(param);
  };

  const attValue = getQueryParam("att");
  // const attendances = JSON.parse(localStorage.getItem("attendances"));
  const [showModal, setShowModal] = useState(false);
  const [scannerResult, setScannerResult] = useState(attValue || null);
  const [isCheckIn, setIsCheckIn] = useState(null);
  // const [currentTime, setCurrentTime] = useState(new Date());
  // const isCheckIn = attendances
  //   ? attendances.find((att) => isSameDate(att.time_in, new Date()))
  //   : null;

  const [attendancesHistory, setAttendancesHistory] = useState([]);
  const [expandIndex, setExpandIndex] = useState(0);

  useEffect(() => {
    if (attendances) {
      setAttendancesHistory(attendances);
      const isCheckedInToday = attendances
        ? attendances.find((att) => isSameDate(att.time_in, new Date()))
        : null;

      setIsCheckIn(isCheckedInToday);
    }
  }, [attendances]);

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
  }, [attendances]);

  // handle checkin using ipinfo api
  // const handleCheckIn = async (event) => {
  //   event.preventDefault();

  //   // Default latitude and longitude
  //   let latitude = 0;
  //   let longitude = 0;

  //   try {
  //     // Fetch location based on IP using ipInfo API
  //     const ipInfoUrl = `https://ipinfo.io/json?token=${IPINFO_API_KEY}`;
  //     const response = await fetch(ipInfoUrl);
  //     const data = await response.json();

  //     // Parse the location details
  //     const location = data.loc ? data.loc.split(",") : [];
  //     latitude = parseFloat(location[0]);
  //     longitude = parseFloat(location[1]);

  //     // Check if latitude and longitude are valid
  //     if (!latitude || !longitude) {
  //       throw new Error("Could not fetch valid location");
  //     }

  //     console.log("latitude", latitude);
  //     console.log("longitude", longitude);

  //     const currentTime = new Date();
  //     let checkInStatus = "";
  //     let lateDuration = 0;

  //     if (new Date(currentTime).getTime() <= WORK_START_TIME) {
  //       checkInStatus = "On Time";
  //     } else {
  //       checkInStatus = "Late";
  //       const timeDifference =
  //         new Date(currentTime).getTime() - WORK_START_TIME;
  //       const lateDurationInMn = Math.abs(timeDifference / 60000);

  //       // Convert minutes to hours, minutes, and seconds
  //       const hours = Math.floor(lateDurationInMn / 60);
  //       const minutes = Math.floor(lateDurationInMn % 60);
  //       const seconds = Math.floor((lateDurationInMn * 60) % 60);

  //       // Format as h:mm:ss
  //       lateDuration = `${hours}h ${minutes}m ${seconds}s`;
  //       notify(`You are late for ${lateDuration}`, "info");
  //     }

  //     const isSuccess = await checkIn.mutateAsync({
  //       qr_code: scannerResult,
  //       employee: user._id,
  //       time_in: currentTime,
  //       check_in_status: checkInStatus,
  //       latitude: latitude,
  //       longitude: longitude,
  //       checkInLateDuration: lateDuration,
  //     });

  //     if (isSuccess.status === "success") {
  //       refetch();
  //       notify("Check in successfully", "success");
  //       setScannerResult(null);
  //       navigate("/user/attendance");
  //     } else {
  //       notify(isSuccess.error.message, "info");
  //       setScannerResult(null);
  //     }
  //   } catch (err) {
  //     notify(`Error: ${err.message}`, "error");
  //     setScannerResult(null);
  //   }
  // };
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
            refetch();
            notify("Check in successfully", "success");
            setScannerResult(null);

            navigate("/user/attendance");
          } else {
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
          timeout: 30000, // Maximum time allowed to wait for a position (in milliseconds)
          maximumAge: 0, // Don't accept a cached location
        }
      );
    } else {
      notify("Geolocation is not supported by this browser.", "error");
    }
  };

  // handle check out using ipinfo api
  // const handleCheckOut = async (event) => {
  //   event.preventDefault();
  //   setShowModal(false);

  //   let latitude = 0;
  //   let longitude = 0;

  //   try {
  //     // Fetch location based on IP using ipInfo API
  //     const ipInfoUrl = `https://ipinfo.io/json?token=${IPINFO_API_KEY}`;
  //     const response = await fetch(ipInfoUrl);
  //     const data = await response.json();

  //     // Parse the location details
  //     const location = data.loc ? data.loc.split(",") : [];
  //     latitude = parseFloat(location[0]);
  //     longitude = parseFloat(location[1]);

  //     // Check if latitude and longitude are valid
  //     if (!latitude || !longitude) {
  //       throw new Error("Could not fetch valid location");
  //     }

  //     const currentTime = new Date();
  //     let checkOutStatus = "";
  //     let earlyDuration = 0;

  //     // Assuming WORK_END_TIME is defined and represents the end of the workday
  //     if (new Date(currentTime).getTime() >= WORK_END_TIME) {
  //       checkOutStatus = "Checked Out";
  //     } else {
  //       const timeDifference = new Date(currentTime).getTime() - WORK_END_TIME;
  //       const earlyDurationInMn = Math.abs(timeDifference / 60000);

  //       // Convert minutes to hours, minutes, and seconds
  //       const hours = Math.floor(earlyDurationInMn / 60);
  //       const minutes = Math.floor(earlyDurationInMn % 60);
  //       const seconds = Math.floor((earlyDurationInMn * 60) % 60);

  //       // Format as h:mm:ss
  //       earlyDuration = `${hours}h ${minutes}m ${seconds}s`;

  //       checkOutStatus = "Early Check-out";
  //       notify(`You checked out early by ${earlyDuration}`, "info");
  //     }

  //     // isCheckIn.qr_code: is the whole qr_code object, we want _id only.
  //     console.log("qr-code id", isCheckIn.qr_code?._id);

  //     const isSuccess = await checkOut.mutateAsync({
  //       qr_code: isCheckIn.qr_code?._id,
  //       employee: user._id,
  //       time_out: currentTime,
  //       check_out_status: checkOutStatus,
  //       latitude: latitude,
  //       longitude: longitude,
  //       checkOutEarlyDuration: earlyDuration,
  //     });

  //     if (isSuccess.status === "success") {
  //       refetch();
  //       notify("Check out successfully", "success");
  //       setScannerResult(null);
  //       // Save each record as an array but ensure the employee is not the same
  //       if (attendances) {
  //         const todayAttendances = attendances.filter((att) =>
  //           isSameDate(att.time_in, new Date())
  //         );

  //         const updatedAttendances = todayAttendances.map((att) => {
  //           if (att.employee === user._id) {
  //             return { ...att, ...isSuccess.data };
  //           }
  //           return att;
  //         });

  //         localStorage.setItem(
  //           "attendances",
  //           JSON.stringify(updatedAttendances)
  //         );
  //       } else {
  //         localStorage.setItem("attendances", JSON.stringify([isSuccess.data]));
  //       }

  //       navigate("/user/attendance");
  //     }

  //     if (isSuccess.status === "error") {
  //       notify(isSuccess.error.message, "info");
  //       setScannerResult(null);
  //     }
  //   } catch (err) {
  //     notify(`Error: ${err.message}`, "error");
  //     setScannerResult(null);
  //   }
  // };

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
            const timeDifference = new Date(currentTime).getTime() - WORK_END_TIME;
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
  
          // isCheckIn.qr_code: is the whole qr_code object, we want _id only.
          console.log("qr-code id", isCheckIn.qr_code?._id);
  
          const isSuccess = await checkOut.mutateAsync({
            qr_code: isCheckIn.qr_code?._id,
            employee: user._id,
            time_out: currentTime,
            check_out_status: checkOutStatus,
            latitude: latitude,
            longitude: longitude,
            checkOutEarlyDuration: earlyDuration,
          });
  
          if (isSuccess.status === "success") {
            refetch();
            notify("Check out successfully", "success");
            setScannerResult(null);
            // Save each record as an array but ensure the employee is not the same
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
              localStorage.setItem("attendances", JSON.stringify([isSuccess.data]));
            }
  
            navigate("/user/attendance");
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
  

  const dataToExport = attendancesHistory?.map((att, index) => {
    return {
      No: index + 1,
      ID: att._id,
      Employee: att.employee?.name,
      "Time In":
        getFormattedTimeWithAMPM(att.time_in) +
        " (" +
        att.check_in_status +
        ")",
      "Late Time": att.checkInLateDuration,
      "Time Out":
        getFormattedTimeWithAMPM(att.time_out) +
        " (" +
        att.check_out_status +
        ")",
      "Early Time": att.checkOutEarlyDuration,
      Date: getFormattedDate(att.date),
      Location: att.qr_code?.location,
    };
  });

  if (isLoading) return <Loading />;

  return (
    <div>
      <div
        className={`flex justify-center items-center relative h-screen bg-black/70`}
      >
        <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md relative m-2">
          {/* Check In and check out */}
          <div className="space-y-4">
            {isCheckIn ? (
              <div>
                <div className="font-bold text-2xl mb-2">
                  Today, Checked in
                  {isCheckIn.time_out && "/out"} already ✅
                </div>

                <table>
                  <tr>
                    <td className="pr-12">Check In:</td>
                    <td className="pr-12 truncate">
                      {getFormattedTimeWithAMPM(isCheckIn.time_in)} (
                      {isCheckIn.check_in_status}
                      {isCheckIn.check_in_status == "Late" &&
                        " " + isCheckIn.checkInLateDuration}
                      )
                    </td>
                  </tr>
                  <tr>
                    <td className="pr-12 truncate">Check Out:</td>
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
                <h3 className="text-center font-semibold mb-1">
                  You are about to check in
                </h3>
                <div className="flex justify-center items-center">
                  Current Time: {new Date().toLocaleTimeString()}
                </div>

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
                <h3 className="text-2xl font-bold mb-1">Check Attendance</h3>
                <small>Scan QR Code at your office to check attendance</small>
                <div id="reader" className="w-full max-h-[350px]"></div>
              </div>
            )}
          </div>

          {/* listing all att requests */}
          <div className="mt-5">
            <h3 className="text-xl font-semibold w-full">
              Attendances History{" "}
              {attendancesHistory?.length > 0 &&
                `(${attendancesHistory.length})`}
            </h3>
            {isLoading ? (
              <small className="mt-2.5 block">
                Fetching attendance requests...
              </small>
            ) : (
              <div>
                {attendancesHistory.length > 0 ? (
                  <>
                    <ul className="mt-4 space-y-2">
                      {attendancesHistory.map((att, index) => (
                        <li
                          key={index}
                          className={`flex justify-between items-center p-2 border ${
                            isSameDate(att.date, new Date())
                              ? "border-green-700"
                              : "border-gray-200"
                          } rounded-md relative`}
                        >
                          <div
                            className="top-1.5 right-1.5 absolute cursor-pointer"
                            onClick={() => {
                              expandIndex === index
                                ? setExpandIndex(null)
                                : setExpandIndex(index);
                            }}
                          >
                            {expandIndex === index ? (
                              <IoIosArrowDropup size={22} />
                            ) : (
                              <IoIosArrowDropdown size={22} />
                            )}
                          </div>
                          <div>
                            <div>
                              <strong className="min-w-[150px] inline-block">
                                Date:
                              </strong>
                              {getFormattedDate(att.date)}
                            </div>
                            <div>
                              <strong className="min-w-[150px] inline-block">
                                Check In:
                              </strong>
                              <span>
                                {getFormattedTimeWithAMPM(att.time_in)} (
                                {att.check_in_status})
                              </span>
                            </div>

                            <div>
                              <strong className="min-w-[150px] inline-block">
                                Check Out:
                              </strong>
                              <span>
                                {att.time_out
                                  ? getFormattedTimeWithAMPM(att.time_out) +
                                    ` (${att.check_out_status}${
                                      att.check_out_status === "Early Check-out"
                                        ? " " + att.checkOutEarlyDuration
                                        : ""
                                    })`
                                  : "Not yet checked out"}
                              </span>
                            </div>

                            {expandIndex === index && (
                              <>
                                <div>
                                  <strong className="min-w-[150px] inline-block">
                                    Late Duration:
                                  </strong>
                                  {att.checkInLateDuration}
                                </div>
                                <div>
                                  <strong className="min-w-[150px] inline-block">
                                    Early Duration:
                                  </strong>
                                  {att.checkOutEarlyDuration}
                                </div>
                                <div>
                                  <strong className="min-w-[150px] inline-block">
                                    Location:
                                  </strong>
                                  {att.qr_code?.location}
                                </div>
                              </>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                    {attendancesHistory?.length > 0 && (
                      <div className="mt-3 space-y-2">
                        <div>Export to:</div>
                        <div className="flex gap-1 w-fit justify-end">
                          <ExportToExcel
                            data={dataToExport}
                            fileName={`${
                              user.name
                            }_attendances_history${new Date().toLocaleDateString()}`}
                          />
                          <ExportToPDF
                            data={dataToExport}
                            fileName={`${
                              user.name
                            }_attendances_history_${new Date().toLocaleDateString()}`}
                          />
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <small className="mt-2.5 block">
                    No attendance requests found
                  </small>
                )}
              </div>
            )}
          </div>
        </div>

        <Link to="/user/profile">
          <button className="mt-4 flex items-center gap-2 text-white w-fit px-2 py-2 bg-red-500 hover:bg-orange-600 border border-white rounded-xl top-0 left-4 fixed">
            <MdOutlineArrowBackIos />
          </button>
        </Link>
        <ConfirmModal
          show={showModal}
          setShow={setShowModal}
          title="Check Out"
          message="Are you sure you want to check out now?"
          onConfirm={handleCheckOut}
        />
      </div>
    </div>
  );
};

export default CheckInCheckOut;
