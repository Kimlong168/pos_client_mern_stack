const Loading = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div
        style={{ borderTopColor: "transparent" }}
        className="w-8 h-8 border-4 border-orange-500 rounded-full animate-spin"
      ></div>
      <p className="ml-2 text-gradient text-orange-500">Loading...</p>
    </div>
  );
};

export default Loading;
