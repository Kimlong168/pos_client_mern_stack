import CardGroup from "../components/ui/CardGroup";
import { useSaleReport } from "@/hooks/report/useReport";
import Loading from "@/components/ui/Loading";

import TotalSaleByMonth from "../components/chart/TotalSaleByMonth";
import TotalSaleByCashier from "@/components/chart/TotalSaleByCashier";
import TotalSaleByProduct from "@/components/chart/TotalSaleByProduct";
import TotalSaleByCategory from "@/components/chart/TotalSaleByCategory";
import TotalSaleByTime from "@/components/chart/TotalSaleByTime";
import TotalRevenue from "@/components/chart/TotalRevenue";
import TotalNumber from "@/components/chart/TotalNumber";
const Dashboard = () => {
  const { data, isLoading, isError } = useSaleReport();

  if (isLoading || !data) {
    return <Loading />;
  } else if (isError) {
    return <div>Error...</div>;
  }

  return (
    <>
      <p className="text-xl font-semibold mb-2">Dashboard</p>
      <CardGroup itemNumber={0} />
      <p className="text-xl font-semibold mt-4 mb-2">Statistic</p>
      <div className="w-full mt-4">
        <TotalRevenue data={data?.total_revenue?.toFixed(2)} />
      </div>

      <div className="w-full mt-4">
        <TotalNumber
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
          <TotalSaleByMonth data={data.total_sales_by_month} />
        </div>
        <div className="w-full">
          <TotalSaleByCashier data={data.total_sales_by_user} />
        </div>
      </div>
      <div className="flex flex-col lg:flex-row gap-4 mt-4">
        <div className="w-full">
          <TotalSaleByProduct data={data.total_sales_by_product?.slice(0, 7)} />
        </div>
        <div className="w-full">
          <TotalSaleByCategory data={data.total_sales_by_category} />
        </div>
      </div>
      <div className="w-full mt-4">
        <TotalSaleByTime data={data.total_sales_by_time} />
      </div>
    </>
  );
};

export default Dashboard;
