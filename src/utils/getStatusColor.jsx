const getStatusColor = (status) => {
  if (status === "pending") {
    return (
      <span className="p-3 py-2  h-full text-center rounded bg-orange-500/20 text-orange-500 border-orange-600 border text-xs">
        Pending
      </span>
    );
  } else if (status === "delivered") {
    return (
      <span className="p-3 py-2  h-full text-center rounded bg-pink-500/20 text-pink-500 border-pink-600 border text-xs">
        Delivered
      </span>
    );
  } else if (status === "processing") {
    return (
      <span className="p-3 py-2  h-full text-center rounded bg-blue-500/20 text-blue-500 border-blue-600 border text-xs">
        Processing
      </span>
    );
  } else if (status === "completed") {
    return (
      <span className="p-3 py-2  h-full text-center rounded bg-green-500/20 text-green-500 border-green-600 border text-xs">
        Completed
      </span>
    );
  } else if (status === "cancelled") {
    return (
      <span className="p-3 py-2  h-full text-center rounded bg-red-500/20 text-red-500 border-red-600 border text-xs">
        Cancelled
      </span>
    );
  } else {
    return (
      <span className="p-3 py-2  h-full text-center rounded bg-gray-500/20 text-gray-500 border-gray-600 border text-xs">
        Unknown
      </span>
    );
  }
};

export default getStatusColor;
