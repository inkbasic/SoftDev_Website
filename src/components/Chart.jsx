import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

export function ChartAreaInteractive({ title, description, chartData, chartConfig }) {
    const [timeRange, setTimeRange] = React.useState("15d");

    // filter chartData ตาม timeRange
    // const filteredData = React.useMemo(() => {
    //     const referenceDate = new Date("2024-06-30");
    //     let daysToSubtract = 15;

    //     if (chartData.length > 15) {
    //         if (timeRange === "15d") daysToSubtract = 15;
    //         else if (timeRange === "7d") daysToSubtract = 7;
    //         else if (timeRange === "3d") daysToSubtract = 3;
    //     } else {
    //         daysToSubtract = chartData.length;
    //     }

    //     const startDate = new Date(referenceDate);
    //     startDate.setDate(startDate.getDate() - daysToSubtract);

    //     return chartData.filter((item) => new Date(item.date) >= startDate);
    // }, [chartData, timeRange]);

    const filteredData = React.useMemo(() => {
        if (!chartData.length) return [];
        const lastDate = new Date(chartData[chartData.length - 1].date);
        let days = timeRange === "7d" ? 7 : timeRange === "3d" ? 3 : 15;
        days = Math.min(days, chartData.length);
        const start = new Date(lastDate);
        start.setDate(lastDate.getDate() - (days - 1));
        return chartData.filter((d) => new Date(d.date) >= start);
    }, [chartData, timeRange]);

    return (
        <Card className="pt-0">
            <CardHeader className="flex items-center gap-2 py-5 space-y-0 sm:flex-row">
                <div className="grid flex-1 gap-1">
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                </div>
                <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger
                        className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex"
                        aria-label="Select a value"
                    >
                        <SelectValue placeholder="Last 3 months" />
                    </SelectTrigger>
                    <SelectContent className="border-gray-200 border-1 rounded-xl">
                        {chartData.length > 15 ? (
                            <SelectItem value="15d" className="rounded-lg">
                                15 วันที่ผ่านมา
                            </SelectItem>
                        ) : null}
                        {chartData.length > 7 ? (
                            <SelectItem value="7d" className="rounded-lg">
                                7 วันที่ผ่านมา
                            </SelectItem>
                        ) : null}
                        {chartData.length > 3 ? (
                            <SelectItem value="3d" className="rounded-lg">
                                3 วันที่ผ่านมา
                            </SelectItem>
                        ) : null}
                    </SelectContent>
                </Select>
            </CardHeader>

            <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
                    <AreaChart data={filteredData}>
                        <defs>
                            {/* {Object.keys(chartConfig).map((key) => (
                                <linearGradient key={key} id={`fill${key}`} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={chartConfig[key].color} stopOpacity={0.8} />
                                    <stop offset="95%" stopColor={chartConfig[key].color} stopOpacity={0.1} />
                                </linearGradient>
                            ))} */}
                            {Object.entries(chartConfig).map(([key, cfg]) => (
                                <linearGradient key={key} id={`fill-${key}`} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={cfg.color} stopOpacity={0.8} />
                                    <stop offset="95%" stopColor={cfg.color} stopOpacity={0.1} />
                                </linearGradient>
                            ))}
                        </defs>

                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            minTickGap={32}
                            tickFormatter={(value) => {
                                const date = new Date(value);
                                return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
                            }}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={
                                <ChartTooltipContent
                                    labelFormatter={(value) => {
                                        return new Date(value).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                        });
                                    }}
                                    indicator="dot"
                                />
                            }
                        />
                        {/* {Object.keys(chartConfig).map((key) => (
                            <Area
                                key={key}
                                dataKey={key}
                                type="natural"
                                fill={`url(#fill${key})`}
                                stroke={chartConfig[key].color}
                                stackId="a"
                            />
                        ))} */}
                        {Object.entries(chartConfig).map(([key, cfg]) => (
                            <Area
                                key={key}
                                dataKey={key}
                                type="natural"
                                fill={`url(#fill-${key})`}
                                stroke={cfg.color}
                                stackId="a"
                            />
                        ))}
                        <ChartLegend content={<ChartLegendContent />} />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
