import { Pie, PieChart } from "recharts";
import PropTypes from "prop-types";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";

export const description = "A pie chart with a legend";

export default function TotalSaleByTime({ data, date = "last 5 months" }) {
  const chartData = data?.map((item, index) => {
    return {
      time: item.time,
      amount: item.amount,
      fill: `hsl(var(--chart-${index + 2}))`,
    };
  });

  const chartConfig = data?.reduce((acc, item) => {
    acc[item.time] = {
      label: item.time,
      color: "red",
    };
    return acc;
  }, {});

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Total Sale by Time</CardTitle>
        <CardDescription>
          Total sale amount by each time for {date}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[300px]"
        >
          <PieChart>
            <Pie data={chartData} dataKey="amount" />
            <ChartLegend
              content={<ChartLegendContent nameKey="time" />}
              className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

TotalSaleByTime.propTypes = {
  data: PropTypes.array.isRequired,
  date: PropTypes.string,
};
