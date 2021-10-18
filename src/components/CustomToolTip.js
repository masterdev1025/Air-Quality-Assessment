import React from "react";
import { format } from "date-fns";

const style = {
  padding: 6,
  backgroundColor: "#fff",
  border: "1px solid #ccc"
};

const CustomTooltip = (props) => {
  const { active, payload } = props;
  if (active) {
    const currData = payload && payload.length ? payload[0].payload : null;
    return (
      <div className="area-chart-tooltip" style={style}>
        <p>
          {currData ? format(new Date(currData.hour), "yyyy-MM-dd") : " -- "}
        </p>
        <p>
          {"Average : "}
          <em>{currData ? currData.value : " -- "}</em>
        </p>
      </div>
    );
  }

  return null;
};

export default CustomTooltip;
