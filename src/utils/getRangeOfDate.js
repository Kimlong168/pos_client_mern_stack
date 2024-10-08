const getRangeOfDate = (date) => {
  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  switch (date) {
    case "today":
      return {
        start: formatDate(new Date().setHours(0, 0, 0, 0)),
        end: formatDate(new Date().setHours(23, 59, 59, 999)),
      };
    case "yesterday":
      return {
        start: formatDate(new Date().setHours(0, 0, 0, 0) - 86400000),
        end: formatDate(new Date().setHours(23, 59, 59, 999) - 86400000),
      };
    case "week":
      return {
        start: formatDate(new Date().setHours(0, 0, 0, 0) - 86400000 * 6),
        end: formatDate(new Date().setHours(23, 59, 59, 999)),
      };

    case "last_week":
      return {
        start: formatDate(new Date().setHours(0, 0, 0, 0) - 86400000 * 13),
        end: formatDate(new Date().setHours(23, 59, 59, 999) - 86400000 * 7),
      };
    case "month":
      return {
        start: formatDate(
          new Date(new Date().getFullYear(), new Date().getMonth(), 1).setHours(
            0,
            0,
            0,
            0
          )
        ),
        end: formatDate(
          new Date(
            new Date().getFullYear(),
            new Date().getMonth() + 1,
            0
          ).setHours(23, 59, 59, 999)
        ),
      };
    case "last_month":
      return {
        start: formatDate(
          new Date(
            new Date().getFullYear(),
            new Date().getMonth() - 1,
            1
          ).setHours(0, 0, 0, 0)
        ),
        end: formatDate(
          new Date(new Date().getFullYear(), new Date().getMonth(), 0).setHours(
            23,
            59,
            59,
            999
          )
        ),
      };
    case "last 6 month":
      return {
        start: formatDate(
          new Date(
            new Date().getFullYear(),
            new Date().getMonth() - 6,
            1
          ).setHours(0, 0, 0, 0)
        ),
        end: formatDate(new Date().setHours(23, 59, 59, 999)),
      };
    case "year":
      return {
        start: formatDate(
          new Date(new Date().getFullYear(), 0, 1).setHours(0, 0, 0, 0)
        ),
        end: formatDate(
          new Date(new Date().getFullYear(), 11, 31).setHours(23, 59, 59, 999)
        ),
      };
    default:
      return {
        start: formatDate(new Date().setHours(0, 0, 0, 0)),
        end: formatDate(new Date().setHours(23, 59, 59, 999)),
      };
  }
};

export default getRangeOfDate;
