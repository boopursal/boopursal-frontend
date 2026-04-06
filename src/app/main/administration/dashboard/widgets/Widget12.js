import React, { useEffect } from "react";
import { Typography, CircularProgress } from "@material-ui/core";
import { Line } from "react-chartjs-2";
import { useTheme } from "@material-ui/styles";
import { MONTHS } from "@fuse/Constants";
import * as Actions from "../store/actions";
import { useDispatch, useSelector } from "react-redux";

function Widget12(props) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const widget12 = useSelector(({ dashboardAdmin }) => dashboardAdmin.widget12);
  const { currentRange, handleChangeTotal } = props;

  useEffect(() => {
    if (!currentRange) {
      return;
    }
    dispatch(Actions.getWidget12(currentRange));

    return () => {
      dispatch(Actions.cleanUpWidget12());
    };
  }, [dispatch, currentRange]);

  useEffect(() => {
    if (
      !widget12.data ||
      (!widget12.data.totalAcheteurs && !widget12.data.totalFournisseurs)
    ) {
      return;
    }
    handleChangeTotal(
      widget12.data.totalFournisseurs,
      widget12.data.totalAcheteurs
    );
  }, [widget12.data]);

  return (
    <div>
      {widget12.loading && (
        <div className="flex p-16 justify-center ">
          <CircularProgress />
        </div>
      )}
      {widget12.data && (
        <Typography className="relative h-200 sm:h-320 sm:pb-16">
          <Line
            data={{
              labels: MONTHS,
              datasets: (widget12.data.datasets || []).map((obj, index) => {
                const palette =
                  theme.palette[index === 0 ? "secondary" : "primary"];
                return {
                  ...obj,
                  borderColor: palette.main,
                  pointBackgroundColor: palette.dark,
                  pointHoverBackgroundColor: palette.main,
                  pointBorderColor: palette.contrastText,
                  pointHoverBorderColor: palette.contrastText,
                };
              }),
            }}
            options={{
              spanGaps: false,
              legend: {
                display: false,
              },
              maintainAspectRatio: false,
              tooltips: {
                position: "nearest",
                mode: "index",
                intersect: false,
              },
              layout: {
                padding: {
                  left: 24,
                  right: 32,
                },
              },
              elements: {
                point: {
                  radius: 4,
                  borderWidth: 2,
                  hoverRadius: 4,
                  hoverBorderWidth: 2,
                },
              },
              scales: {
                xAxes: [
                  {
                    gridLines: {
                      display: false,
                    },
                    ticks: {
                      fontColor: "rgba(0,0,0,0.54)",
                    },
                  },
                ],
                yAxes: [
                  {
                    gridLines: {
                      tickMarkLength: 16,
                    },
                    ticks: {
                      stepSize: 1000,
                    },
                  },
                ],
              },
              plugins: {
                filler: {
                  propagate: false,
                },
              },
            }}
          />
        </Typography>
      )}
    </div>
  );
}

export default React.memo(Widget12);
