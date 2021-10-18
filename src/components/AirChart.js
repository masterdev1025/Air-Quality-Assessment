import React from "react";
import { add, format, differenceInCalendarDays } from "date-fns";
import CustomTooltip from "./CustomToolTip";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

function AirChart(props) {
  const dateFormatter = (date) => {
    return format(new Date(date), "dd/MMM");
  };
  const getTicks = (startDate, endDate, num) => {
    const diffDays = differenceInCalendarDays(endDate, startDate);

    let current = startDate,
      velocity = Math.round(diffDays / (num - 1));

    const ticks = [startDate.getTime()];

    for (let i = 1; i < num - 1; i++) {
      ticks.push(add(current, { days: i * velocity }).getTime());
    }

    ticks.push(endDate.getTime());
    return ticks;
  };
  const domain = [(dataMin) => dataMin, () => props.endDate.getTime()];
  const ticks = getTicks(props.startDate, props.endDate, 10);
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ScatterChart
        width={400}
        height={400}
        margin={{
          top: 20,
          right: 20,
          bottom: 20,
          left: 20
        }}
      >
        <CartesianGrid />
        <XAxis
          dataKey="hour"
          hasTick
          scale="time"
          tickFormatter={dateFormatter}
          type="number"
          domain={domain}
          ticks={ticks}
        />
        <YAxis type="number" dataKey="value" name="Value" unit="µg/m³" />
        <Tooltip content={<CustomTooltip />} />
        <Scatter name="A" data={props.airData} fill={props.airColor1} />
        <Scatter name="B" data={props.airData1} fill={props.airColor2} />
      </ScatterChart>
    </ResponsiveContainer>
  );
}
export default AirChart;
