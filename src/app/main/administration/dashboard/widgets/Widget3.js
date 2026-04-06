import React, { useEffect } from "react";
import { Card, Typography, CircularProgress, Icon, Box } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import * as Actions from "../store/actions";
import { LOCAL_CURRENCY } from "@fuse/Constants";

function Widget3(props) {
  const dispatch = useDispatch();
  const widget3 = useSelector(({ dashboardAdmin }) => dashboardAdmin.widget3);
  const { currentRange } = props;

  useEffect(() => {
    if (!currentRange) return;
    dispatch(Actions.getWidget3(currentRange));
    return () => dispatch(Actions.cleanUpWidget3());
  }, [dispatch, currentRange]);

  const financial = (x) => parseFloat(x).toLocaleString("fr", { minimumFractionDigits: 2 });

  return (
    <div className="flex flex-col h-full bg-white p-24">
      <div className="flex items-center gap-16 mb-20">
        <div className="w-48 h-48 rounded-full bg-[#EFF6FF] flex items-center justify-center text-[#3B82F6]">
          <Icon className="text-24">bar_chart</Icon>
        </div>
      </div>
      <div className="flex items-end justify-between mt-auto">
        <div>
          <Typography className="text-24 font-700 text-[#1C2434] leading-none mb-4">
            {widget3.data ? financial(widget3.data.value) : "0,00"} {LOCAL_CURRENCY}
          </Typography>
          <Typography className="text-14 font-500 text-[#64748B]">
            CA Global
          </Typography>
        </div>

        <span className="text-14 font-500 flex items-center gap-4 text-[#10B981]">
          3.48%
          <Icon className="text-16">arrow_upward</Icon>
        </span>
      </div>
    </div>
  );
}

export default React.memo(Widget3);
