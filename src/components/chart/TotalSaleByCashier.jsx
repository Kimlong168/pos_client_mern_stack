import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Rectangle, XAxis } from "recharts";

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

import PropTypes from "prop-types";

export default function TotalSaleByCashier({ data, date = "last 6 months" }) {
  //   useEffect(() => {
  //     if (saleData) {
  //       const sortedData = saleData.sort((a, b) => {
  //         return b.amount - a.amount;
  //       });

  //       setData(sortedData);
  //     }
  //   }, [saleData]);

  const chartData = data.map((item, index) => {
    return {
      cashier: item.user.name,
      amount: item.amount,
      fill: `hsl(var(--chart-${index + 1}))`,
    };
  });

  const chartConfig = data.reduce((acc, item) => {
    acc[item.user.name] = {
      label: item.user.name,
      color: "red",
    };
    return acc;
  }, {});

  return (
    <Card>
      <CardHeader>
        <CardTitle>Total Sale by Cashier</CardTitle>
        <CardDescription>
          Total sale amount by each cashier for {date}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="cashier"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) =>
                chartConfig[value] ? chartConfig[value].label : "Unknown"
              }
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Bar
              dataKey="amount"
              strokeWidth={2}
              radius={8}
              activeIndex={2}
              activeBar={({ ...props }) => {
                return (
                  <Rectangle
                    {...props}
                    fillOpacity={0.8}
                    stroke=""
                    strokeDasharray={2}
                    strokeDashoffset={4}
                  />
                );
              }}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          <span className="text-muted-foreground">
            Most Sale Cashier: {data?.length > 0 && data[0].user.name}
          </span>

          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total sales of {data?.length} cashiers
        </div>
      </CardFooter>
    </Card>
  );
}

TotalSaleByCashier.propTypes = {
  data: PropTypes.array.isRequired,
  date: PropTypes.string,
};
