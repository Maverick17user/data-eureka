import React from 'react'
import { scaleLinear, scaleBand } from 'd3-scale';
import { line, area, curveMonotoneX } from 'd3-shape';
import { extent } from 'd3-array';
import { max, min } from 'd3-array'
import { isEmpty } from 'lodash';
import getChartStatus, { ChartStatus } from './helpers/getChartStatus';
import AxisLine, { AxisOrientation } from '../components/AxisLine/AxisLine';

export type BarChartProps = any

/**
 * Bar chart component
 */
const BarChart: React.FC<BarChartProps> = ({
  data = [],
  width = 400,
  height = 300,
  // TODO: Chart theme or theme configuration
  ...props
}) => {

  if (!isEmpty(data)) {

    // const xMinValue = min(data, (d) => d.xValue);
    // const xMaxValue = max(data, (d) => d.xValue);

    const yMinValue = min(data.map(d => d.yValue));
    const yMaxValue = max(data.map(d => d.yValue));

    const xScale = scaleBand()
      .domain(data.map(d => d.xValue))
      .range([0, width])
      // .padding(0.1)

    const yScale = scaleLinear()
      .domain([yMinValue, yMaxValue])
      .range([height, 0])
    // .nice()

    const getX = scaleBand()
      .domain(data.map(d => d.xValue)) 
      .range([0, width]);

    const getY = scaleLinear()
      .domain([yMinValue, yMaxValue])
      // .domain(data.map(d => d.yValue))
      .range([height, 0]);

    const lineGenerator = line()
      .x(d => xScale(d.xValue) + getX.bandwidth() / 2)
      .y(d => yScale(d.yValue))
      .curve(curveMonotoneX)(data)

    const areaPathGenerator = area()
      .x(d => getX(d.xValue) + getX.bandwidth() / 2)
      .y0(d => getY(d.yValue))
      .y1(() => getY(0))
      .curve(curveMonotoneX)(data); // TODO: Option for gradient style

    const firstYValue: number = data[0].yValue
    const lastYValue: number = data[data.length - 1].yValue
    const chartStaus: ChartStatus = getChartStatus(firstYValue, lastYValue)

    const chartColorStyle = chartStaus === ChartStatus.Negative
      ? "#eb3434"
      : "#34eb8f"

    const margins = {
      top: 20,
      right: 20,
      bottom: 20,
      left: 20,
    };

    return (
      <div id="barChart__container">
        <svg
          className="barChart__svg"
          width={width}
          height={height + 25}
        >
          <AxisLine orientation={AxisOrientation.X} getX={getX} getY={getY} />
          <AxisLine orientation={AxisOrientation.Y} getY={getY} />
          <path
            d={areaPathGenerator}
            opacity={0.2}
            fill={chartColorStyle}
          />
          {/* <g> */}
            <path
              d={lineGenerator}
              className='line'
              style={{
                fill: 'none',
                strokeWidth: 2,
                stroke: chartColorStyle,
              }}
            />
          {/* </g> */}
        </svg>
      </div>
    )
  }

  return <div>Bruh</div>
}

export default BarChart