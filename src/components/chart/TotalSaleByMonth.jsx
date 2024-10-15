
import { CartesianGrid, LabelList, Line, LineChart, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
export default function TotalSaleByMonth({ data: saleData }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    if (saleData) {
      const monthOrder = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];

      const sortedData = saleData.sort((a, b) => {
        return monthOrder.indexOf(a.date) - monthOrder.indexOf(b.date);
      });

      setData(sortedData);
    }
  }, [saleData]);

  const chartData = data.map((item) => {
    return {
      month: item.date,
      saleAmount: item.amount,
    };
  });

  const chartConfig = {
    saleAmount: {
      label: "amount($)",
      color: "hsl(var(--chart-1))",
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Total Sale by Month</CardTitle>
        <CardDescription>
          {data[0]?.date} - {data[data.length - 1]?.date}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 20,
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Line
              dataKey="saleAmount"
              type="natural"
              stroke="orange"
              strokeWidth={2}
              dot={{
                fill: "red",
              }}
              activeDot={{
                r: 6,
              }}
            >
              <LabelList
                position="top"
                offset={12}
                className="font-bold"
                fontSize={12}
              />
            </Line>
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        {/* <div className="flex gap-2 font-medium leading-none">
          Trending up by{" "}
          {(
            data[data.length - 1]?.amount - data[data.length - 2]?.amount
          ).toFixed(2)}
          $ this month <TrendingUp className="h-4 w-4" />
        </div> */}
        <div className="leading-none text-muted-foreground">
          Showing total sales for the last {data?.length} months
        </div>
      </CardFooter>
    </Card>
  );
}

TotalSaleByMonth.propTypes = {
  data: PropTypes.object,
};
