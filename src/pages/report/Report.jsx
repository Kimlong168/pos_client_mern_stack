import TotalNumber from "@/components/chart/TotalNumber";
import TotalRevenue from "@/components/chart/TotalRevenue";
import TotalSaleByCashier from "@/components/chart/TotalSaleByCashier";
import TotalSaleByCategory from "@/components/chart/TotalSaleByCategory";
import TotalSaleByMonth from "@/components/chart/TotalSaleByMonth";
import TotalSaleByProduct from "@/components/chart/TotalSaleByProduct";
import TotalSaleByTime from "@/components/chart/TotalSaleByTime";
import Loading from "@/components/ui/Loading";
import { useSaleReport } from "@/hooks/report/useReport";
import { useEffect, useRef, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PiDownloadBold } from "react-icons/pi";
import html2canvas from "html2canvas";
import getRangeOfDate from "@/utils/getRangeOfDate";
const Report = () => {
  const [date, setDate] = useState("today");
  const { data, isLoading, isError, refetch } = useSaleReport(date);

  useEffect(() => {
    refetch();
  }, [date, refetch]);

  const captureRef = useRef();

  const handleCapture = () => {
    const element = captureRef.current; // Get the element to capture

    html2canvas(element).then((canvas) => {
      // Convert canvas to an image
      const imgData = canvas.toDataURL("image/png");

      // Create a link element to trigger download
      const link = document.createElement("a");
      link.href = imgData;
      if (date === "today" || date === "yesterday") {
        link.download = `Report Graph - ${getRangeOfDate(date).start}`;
      } else {
        link.download = `Report Graph - ${getRangeOfDate(date).start} - ${
          getRangeOfDate(date).end
        }`;
      }

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link); // Clean up the DOM after download
    });
  };

  const handleDateChange = (value) => {
    setDate(value);
  };

  const getTitle = (date) => {
    switch (date) {
      case "today":
        return "Today";
      case "yesterday":
        return "Yesterday";
      case "week":
        return "this Week";
      case "last_week":
        return "the Last Week";
      case "month":
        return "This Month";
      case "last_month":
        return "the Last Month";
      case "last 6 month":
        return "the Last 6 Months";
      case "year":
        return "This Year";
      default:
        return "Today";
    }
  };

  if (isLoading && !data) {
    return <Loading />;
  } else if (isError) {
    return <div>Error...</div>;
  }
  return (
    <div>
      <div className="flex flex-col md:flex-row gap-3 md:justify-between md:items-center mb-4">
        <div className="flex items-center">
          <label className="mr-2">Select Date:</label>

          <Select onValueChange={handleDateChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Today" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="yesterday">Yesterday</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="last_week">Last Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="last_month">Last Month</SelectItem>
                <SelectItem value="last 6 month">Last 6 months</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div>
          <button
            onClick={handleCapture}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md p-2 flex gap-2 items-center"
          >
            Download <PiDownloadBold />
          </button>
        </div>
      </div>
      <div ref={captureRef}>
        <div>
          <h3 className="text-xl">
            Date : {getRangeOfDate(date).start}{" "}
            {date === "today" || date === "yesterday"
              ? ""
              : ` - ${getRangeOfDate(date).end}`}
          </h3>
        </div>
        <div className="w-full mt-4">
          <TotalRevenue
            date={getTitle(date)}
            data={data?.total_revenue?.toFixed(2)}
          />
        </div>

        <div className="w-full mt-4">
          <TotalNumber
            date={getTitle(date)}
            data={[
              // { name: "Total Reveneu", amount: data.total_revenue.toFixed(2) },
              { name: "Total Order", amount: data.total_orders },
              { name: "Total Success Order", amount: data.total_sales },
              { name: "Total Product Sold", amount: data.total_products_sold },
              { name: "Average Order Value", amount: data.average_order_value },
            ]}
          />
        </div>

        <div className="flex flex-col lg:flex-row gap-4 mt-4">
          <div className="w-full">
            <TotalSaleByMonth
              date={getTitle(date)}
              data={data.total_sales_by_month}
            />
          </div>
          <div className="w-full">
            <TotalSaleByCashier
              date={getTitle(date)}
              data={data.total_sales_by_user}
            />
          </div>
        </div>
        <div className="flex flex-col lg:flex-row gap-4 mt-4">
          <div className="w-full">
            <TotalSaleByProduct
              date={getTitle(date)}
              data={data.total_sales_by_product.slice(0, 7)}
            />
          </div>
          <div className="w-full">
            <TotalSaleByCategory
              date={getTitle(date)}
              data={data.total_sales_by_category}
            />
          </div>
        </div>
        <div className="w-full mt-4">
          <TotalSaleByTime
            date={getTitle(date)}
            data={data.total_sales_by_time}
          />
        </div>
      </div>
    </div>
  );
};

export default Report;
