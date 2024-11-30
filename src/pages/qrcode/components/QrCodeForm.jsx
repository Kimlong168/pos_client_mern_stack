import { useState, useEffect } from "react";
import { notify } from "../../../utils/toastify";
import PropTypes from "prop-types";
import RedStar from "../../../components/ui/RedStar";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
const LocationMarker = ({ setPosition, setData }) => {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]); // Update position with the clicked latitude and longitude
      setData((prevData) => ({
        ...prevData,
        lat: lat,
        lng: lng,
      }));
    },
  });
  return null;
};

const ChangeMapView = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center);
  }, [center, map]);
  return null;
};

const QrCodeForm = ({ onSubmitFn, isSubmitting, initialData = {} }) => {
  const [data, setData] = useState({
    location: initialData.location || "",
    lat: initialData.lat || "",
    lng: initialData.lng || "",
    radius: initialData.radius || "",
  });
  const [position, setPosition] = useState(
    initialData.lat
      ? [initialData.lat, initialData.lng]
      : [12.753945580251552, 104.92383340997381]
  ); // Default coordinates
  const [searchTerm, setSearchTerm] = useState(""); // For search input

  const handleSearch = async (e) => {
    e.preventDefault();
    // const url = `https://nominatim.openstreetmap.org/search?q=${searchTerm}&format=json&limit=1`;
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
      searchTerm + "*"
    )}, Cambodia&format=json&limit=5`;

    try {
      const response = await axios.get(url);
      if (response.data.length > 0) {
        const { lat, lon } = response.data[0]; // Get lat and lon from the first result
        setPosition([parseFloat(lat), parseFloat(lon)]); // Update the map position
        setData((prevData) => ({
          ...prevData,
          lat: parseFloat(lat),
          lng: parseFloat(lon),
        })); // Update the form data
      } else {
        console.log("No results found for the location.");
        notify("No results found for the location.", "error");
      }
    } catch (error) {
      console.error("Error fetching location data:", error);
    }
  };

  // get current location
  const getCurrentPosition = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setPosition([position.coords.latitude, position.coords.longitude]);
          setData((prevData) => ({
            ...prevData,
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }));

          // Stop watching after successful check-out
          // navigator.geolocation.clearWatch(watchId);
        },
        (err) => {
          notify(`ERROR(${err.code}): ${err.message}`, "error");
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

  const handleOnChange = (e) => {
    const { name, value } = e.target;

    setData((prevData) => ({
      ...prevData,
      [name]: value, // Handle file input and text input
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!data.location || !data.lat || !data.lng || !data.radius) {
      notify("Please fill all the fields!", "error");
      return;
    }
    onSubmitFn(data);
  };

  return (
    <div className="w-full flex flex-col  border border-white/50 rounded-3xl gap-3">
      {/* data title input */}

      <div className="flex flex-col gap-2">
        <label className="font-medium text-sm">
          Location <RedStar />
        </label>
        <input
          type="text"
          name="location"
          value={data.location}
          onChange={handleOnChange}
          className="border p-2 rounded focus:outline-orange-500"
        />
      </div>

      <div className="flex items-center gap-3">
        <div className="flex flex-col gap-2 w-full">
          <label className="font-medium text-sm">
            Lat <RedStar />
          </label>
          <input
            type="text"
            name="lat"
            value={data.lat}
            onChange={handleOnChange}
            className="border p-2 rounded focus:outline-orange-500"
          />
        </div>{" "}
        <div className="flex flex-col gap-2 w-full">
          <label className="font-medium text-sm">
            Lng <RedStar />
          </label>
          <input
            type="text"
            name="lng"
            value={data.lng}
            onChange={handleOnChange}
            className="border p-2 rounded focus:outline-orange-500"
          />
        </div>{" "}
        <div className="flex flex-col gap-2 w-full">
          <label className="font-medium text-sm">
            Radius <RedStar />
          </label>
          <input
            type="text"
            name="radius"
            value={data.radius}
            onChange={handleOnChange}
            className="border p-2 rounded focus:outline-orange-500"
          />
        </div>
      </div>

      <div>
        <div>
          <h3>
            Click on the map to get latitude and longitude or{" "}
            <button
              className=" cursor-pointer bg-red-500 p-3 text-white rounded"
              onClick={getCurrentPosition}
            >
              get your current location
            </button>
            :
          </h3>
          <form onSubmit={handleSearch}>
            <input
              className="border p-2 rounded focus:outline-orange-500 my-2"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search location"
            />
            <button
              type="submit"
              className="border p-2 rounded bg-green-500 hover:bg-green-600 text-white my-2"
            >
              Search
            </button>
          </form>
          <MapContainer
            center={position}
            zoom={12}
            style={{ height: "400px", width: "100%" }}
            scrollWheelZoom={true}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={position} />
            <LocationMarker setPosition={setPosition} setData={setData} />
            <ChangeMapView center={position} />
          </MapContainer>
        </div>
      </div>

      {/*create data button */}
      <button
        className="bg-orange-500 hover:bg-orange-600 text-white font-bold p-2 mt-2 rounded"
        onClick={handleSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Submitting..." : "Submit"}
      </button>
    </div>
  );
};

QrCodeForm.propTypes = {
  onSubmitFn: PropTypes.func,
  isSubmitting: PropTypes.bool,
  initialData: PropTypes.object,
};

LocationMarker.propTypes = {
  setPosition: PropTypes.func,
  setData: PropTypes.func,
};

ChangeMapView.propTypes = {
  center: PropTypes.array,
};
export default QrCodeForm;
