import React, { useEffect, useRef, useState } from "react";
import { Typography, Icon, Box } from "@material-ui/core";
import moment from "moment";
import "moment/locale/fr";

function WidgetNow() {
  const [time, setTime] = useState(moment());
  const intervalRef = useRef();

  useEffect(() => {
    intervalRef.current = setInterval(() => setTime(moment()), 1000);
    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <div className="flex flex-col h-full bg-white p-24">
      <div className="flex items-center gap-16 mb-20">
        <div className="w-48 h-48 rounded-full bg-[#F1F5F9] flex items-center justify-center text-[#64748B]">
          <Icon className="text-24">schedule</Icon>
        </div>
      </div>
      <div className="flex items-end justify-between mt-auto">
        <div>
          <Typography className="text-24 font-700 text-[#1C2434] leading-none mb-4">
            {time.format("HH:mm:ss")}
          </Typography>
          <Typography className="text-14 font-500 text-[#64748B] uppercase">
            {time.format("dddd")}
          </Typography>
        </div>

        <span className="text-12 font-600 text-[#64748B]">
          {time.format("D MMMM YYYY")}
        </span>
      </div>
    </div>
  );
}

export default React.memo(WidgetNow);
