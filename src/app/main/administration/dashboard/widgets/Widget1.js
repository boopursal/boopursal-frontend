import React, { useEffect } from "react";
import { Card, Typography, CircularProgress, Icon, Box } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import * as Actions from "../store/actions";
import { LOCAL_CURRENCY } from "@fuse/Constants";
import clsx from "clsx";

function Widget1(props) {
  const dispatch = useDispatch();
  const widget1 = useSelector(({ dashboardAdmin }) => dashboardAdmin.widget1);
  const { currentRange } = props;

  useEffect(() => {
    if (!currentRange) return;
    dispatch(Actions.getWidget1(currentRange));
    return () => dispatch(Actions.cleanUpWidget1());
  }, [dispatch, currentRange]);

  const financial = (x) => parseFloat(x).toLocaleString("fr", { minimumFractionDigits: 2 });

  return (
    <div className="flex flex-col h-full bg-white p-24">
      <div className="flex items-center gap-16 mb-20">
        <div className="w-48 h-48 rounded-full bg-[#E0E7FF] flex items-center justify-center text-[#3c50e0]">
          <Icon className="text-24">payments</Icon>
        </div>
      </div>
      <div className="flex items-end justify-between mt-auto">
        <div>
          <Typography className="text-24 font-700 text-[#1c2434] leading-none mb-4">
            {widget1.data ? financial(widget1.data.value) : "0,00"} {LOCAL_CURRENCY}
          </Typography>
          <Typography className="text-14 font-500 text-[#64748b]">
            CA Abonnements
          </Typography>
        </div>

        <span className={clsx("text-14 font-500 flex items-center gap-4", widget1.data?.growth >= 0 ? "text-[#10b981]" : "text-[#ef4444]")}>
          {widget1.data?.growth || "0"}%
          <Icon className="text-16">{widget1.data?.growth >= 0 ? "arrow_upward" : "arrow_downward"}</Icon>
        </span>
      </div>
    </div>
  );
}

export default React.memo(Widget1);
