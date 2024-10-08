import { TrendingUp } from "lucide-react";
import NumberCard from "../ui/NumberCard";
// import { Bar, BarChart, XAxis, YAxis } from "recharts";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import {
//   ChartContainer,
//   ChartTooltip,
//   ChartTooltipContent,
// } from "@/components/ui/chart";

export const description = "A mixed bar chart";
import PropTypes from "prop-types";

export default function TotalNumber({ data, date = "last 6 months" }) {
  // const chartData = data.map((item, index) => {
  //   return {
  //     name: item.name,
  //     amount: item.amount,
  //     fill: `hsl(var(--chart-${index + 1}))`,
  //   };
  // });

  // const chartConfig = data.reduce((acc, item) => {
  //   acc[item.name] = {
  //     label: item.name,
  //     color: "red",
  //   };
  //   return acc;
  // }, {});

  return (
    // <Card>
    //   <CardHeader>
    //     <CardTitle>Important Number</CardTitle>
    //     <CardDescription>Important number for {date}</CardDescription>
    //   </CardHeader>
    //   <CardContent>
    //     <ChartContainer config={chartConfig}>
    //       <BarChart
    //         accessibilityLayer
    //         data={chartData}
    //         layout="vertical"
    //         margin={{
    //           left: 0,
    //         }}
    //       >
    //         <YAxis
    //           dataKey="name"
    //           type="category"
    //           tickLine={true}
    //           tickMargin={5}
    //           axisLine={false}
    //           tickFormatter={(value) => chartConfig[value]?.label}
    //         />
    //         <XAxis dataKey="amount" type="number" />
    //         <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
    //         <Bar dataKey="amount" layout="vertical" radius={5} />
    //       </BarChart>
    //     </ChartContainer>
    //   </CardContent>
    //   <CardFooter className="flex-col items-start gap-2 text-sm">
    //     <div className="flex gap-2 font-medium leading-none">
    //       Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
    //     </div>
    //     <div className="leading-none text-muted-foreground">
    //       Showing total amount for {date}
    //     </div>
    //   </CardFooter>
    // </Card>

    <>
      <div className="flex flex-col md:flex-row gap-4 w-full ">
        <NumberCard
          number={data[0].amount}
          title={data[0].name}
          subtitle={`${data[0].name} for ${date}`}
          icon={<TrendingUp />}
        />

        <NumberCard
          number={data[1].amount}
          title={data[1].name}
          subtitle={`${data[1].name} for ${date}`}
          icon={<TrendingUp />}
        />

        <NumberCard
          number={data[2].amount}
          title={data[2].name}
          subtitle={`${data[2].name} for ${date}`}
          icon={<TrendingUp />}
        />

        <NumberCard
          number={data[3].amount}
          title={data[3].name}
          subtitle={`${data[3].name} for ${date}`}
          icon={<TrendingUp />}
        />
      </div>
    </>
  );
}

TotalNumber.propTypes = {
  data: PropTypes.array.isRequired,
  date: PropTypes.string,
};
