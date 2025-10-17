import { Box, Typography } from "@mui/material";
import React from "react";
import { AxisOptions, Chart, UserSerie } from "react-charts";
import { useImpaired } from "./impaired-table";

type MyDatum = { location: string; days: number };

export default function ImpairedBarChart() {
  const { getImpairedData, getData, getLoading, getError } = useImpaired({});

  const primaryAxis: AxisOptions<{
    location: string;
    days: number;
  }> = React.useMemo(
    (): AxisOptions<MyDatum> => ({
      getValue: (datum) => datum.location,
    }),
    []
  );

  const secondaryAxes: AxisOptions<{
    location: string;
    days: number;
  }>[] = React.useMemo(
    (): AxisOptions<MyDatum>[] => [
      {
        getValue: (datum) => datum.days,
        elementType: "bar",
      },
    ],
    [{}]
  );

  if (getData) {
    const data: UserSerie<{
      location: string;
      days: number;
    }>[] = React.useMemo(
      () =>
        getData
          .filter((impaired) => !impaired.resolved)
          .map((impaired) => ({
            label: impaired.serial,
            data: [
              {
                location: impaired.location_name,
                days:
                  Math.round(
                    (Number(
                      new Date().getTime() -
                        new Date(
                          new Date(impaired.impaired_date).toLocaleString() +
                            " UTC"
                        ).getTime()
                    ) /
                      (1000 * 3600 * 24)) *
                      10
                  ) / 10,
              },
            ],
          })),
      [getData]
    );
    
    data.push({
      label: "",
      data: [
        {
          location: "",
          days: 0.0,
        },
      ],
    });

    if (getLoading) {
      return <p>Chart Loading...</p>;
    }

    if (getData.filter((impaired) => !impaired.resolved).length > 0) {
      return (
        <Box sx={{ 
          height: 250,  // Reduced from 300
          display: 'flex',
          flexDirection: 'column',
          '& .MuiTypography-root': {  // Target the Typography component
            mb: 1,  // Reduced margin bottom
            fontSize: '0.875rem',  // Slightly smaller font
            fontWeight: 500,  // Medium weight
          }
        }}>
          <Typography data-testid="impaired-bar-chart-title">
            Days Impaired
          </Typography>
          <Box sx={{ flex: 1, minHeight: 0 }}>  
            <Chart
              options={{
                data,
                primaryAxis,
                secondaryAxes,
                interactionMode: "closest",
                showVoronoi: false,
              }}
            />
          </Box>
        </Box>
      );
    }
  }

  return null;
}