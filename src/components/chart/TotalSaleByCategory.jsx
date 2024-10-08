import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

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
export default function TotalSaleByCategory({ data, date = "last 6 months" }) {
  const chartData = data.map((item, index) => {
    return {
      category: item?.category?.name,
      amount: item.amount,
      fill: `hsl(var(--chart-${index + 1}))`,
    };
  });

  const chartConfig = data.reduce((acc, item) => {
    acc[item?.category?.name] = {
      label: item?.category?.name,
      color: "red",
    };
    return acc;
  }, {});

  return (
    <Card>
      <CardHeader>
        <CardTitle>Total Sale by Category</CardTitle>
        <CardDescription>
          Total sale amount by each category for {date}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) =>
                chartConfig[value] ? chartConfig[value].label : "Unknown"
              }
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Bar dataKey="amount" strokeWidth={2} radius={8} activeIndex={2} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          <span className="text-muted-foreground">
            Most Sale category:{" "}
            {data?.length > 0 &&
              data.sort((a, b) => b.amount - a.amount)[0]?.category?.name}
          </span>

          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total sales of {data?.length} categorys
        </div>
      </CardFooter>
    </Card>
  );
}

TotalSaleByCategory.propTypes = {
  data: PropTypes.array.isRequired,
  date: PropTypes.string,
};
