import React, { useEffect } from "react";
import { Typography, CircularProgress } from "@material-ui/core";
import { Line } from "react-chartjs-2";
import { useTheme } from "@material-ui/styles";
import * as Actions from "../store/actions";
import { useDispatch, useSelector } from "react-redux";

function Widget13(props) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const widget13 = useSelector(({ dashboardAdmin }) => dashboardAdmin.widget13);
  const { handleChangeTotal } = props;

  useEffect(() => {
    dispatch(Actions.getWidget13());
    return () => {
      dispatch(Actions.cleanUpWidget13());
    };
  }, [dispatch]);

  useEffect(() => {
    if (
      !widget13.data ||
      (!widget13.data.totalAcheteurs && !widget13.data.totalFournisseurs)
    ) {
      return;
    }
    handleChangeTotal(
      widget13.data.totalFournisseurs,
      widget13.data.totalAcheteurs
    );
  }, [widget13.data]);

  return (
    <div>
      {widget13.loading && (
        <div className="flex p-16 justify-center ">
          <CircularProgress />
        </div>
      )}
      {widget13.data && (
        <Typography className="relative h-200 sm:h-320 sm:pb-16">
          <Line
            data={{
              labels: widget13.data.years,
              datasets: (widget13.data.datasets || []).map((obj, index) => {
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

export default React.memo(Widget13);
