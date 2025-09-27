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
    const [timeRange, setTimeRange] = React.useState("90d");

    // filter chartData ตาม timeRange
    const filteredData = React.useMemo(() => {
        const referenceDate = new Date("2024-06-30");
        let daysToSubtract = 90;
        if (timeRange === "30d") daysToSubtract = 30;
        else if (timeRange === "7d") daysToSubtract = 7;

        const startDate = new Date(referenceDate);
        startDate.setDate(startDate.getDate() - daysToSubtract);

        return chartData.filter((item) => new Date(item.date) >= startDate);
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
                    <SelectContent className="rounded-xl">
                        <SelectItem value="90d" className="rounded-lg">
                            3 เดือนที่ผ่านมา
                        </SelectItem>
                        <SelectItem value="30d" className="rounded-lg">
                            30 วันที่ผ่านมา
                        </SelectItem>
                        <SelectItem value="7d" className="rounded-lg">
                            7 วันที่ผ่านมา
                        </SelectItem>
                    </SelectContent>
                </Select>
            </CardHeader>

            <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
                    <AreaChart data={filteredData}>
                        <defs>
                            {Object.keys(chartConfig).map((key) => (
                                <linearGradient key={key} id={`fill${key}`} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={chartConfig[key].color} stopOpacity={0.8} />
                                    <stop offset="95%" stopColor={chartConfig[key].color} stopOpacity={0.1} />
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
                        {Object.keys(chartConfig).map((key) => (
                            <Area
                                key={key}
                                dataKey={key}
                                type="natural"
                                fill={`url(#fill${key})`}
                                stroke={chartConfig[key].color}
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
