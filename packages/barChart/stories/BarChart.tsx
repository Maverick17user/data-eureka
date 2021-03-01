import React from 'react'
import XYAxis from '../components/XYAxis/XYAxis';
import Line from '../components/AxisLine/AxisLine';
import { scaleLinear, scaleBand } from 'd3-scale';
import { line, curveMonotoneX } from 'd3-shape';
import { extent } from 'd3-array';
import { max, min } from 'd3-array'
import { isEmpty } from 'lodash';
import getChartStatus, { ChartStatus } from './helpers/getChartStatus';


export type BarChartProps = any

/**
 * Bar chart component
 */
const BarChart: React.FC<BarChartProps> = ({
  data = [],
  width = 400,
  height = 300,
  // TODO: Custom loader
  // TODO: Chart theme or theme configuration
  ...props
}) => {

  if (!isEmpty(data)) {

    // const xMinValue = min(data, (d) => d.xValue);
    // const xMaxValue = max(data, (d) => d.xValue);
  
    const yMinValue = min(data.map(d => d.yValue));
    const yMaxValue = max(data.map(d => d.yValue));
  
    const xScale = scaleBand()
      .range([0, width])
      .domain(data.map(d => d.xValue))
      .padding(0.1)
  
    const yScale = scaleLinear()
      .range([height, 0])
      .domain([yMinValue, yMaxValue])
    // .nice()

    const lineGenerator = line()
      .x(d => xScale(d.xValue))
      .y(d => yScale(d.yValue))
    // .curve(curveMonotoneX)

    const firstYValue: number = data[0].yValue
    const lastYValue: number = data[data.length - 1].yValue
    const chartStaus: ChartStatus = getChartStatus(firstYValue, lastYValue)

    return (
      <div id="barChart__container">
        <svg
          className="barChart__svg"
          width={width}
          height={height}
        >
          <g>
            <AxisLine 
              lineScale={xScale}
              ticksAmount={100}
            />
            <AxisLine 
              lineScale={yScale}
              ticksAmount={250}
            />
            <path
              d={lineGenerator(data)}
              className='line'
              style={{ 
                fill: 'none', 
                strokeWidth: 2, 
                stroke: chartStaus === ChartStatus.Negative
                  ? "#eb3434"
                  : "#34eb8f"
              }}
            />
          </g>
        </svg>
      </div>
    )
  }

  return <div>Bruh</div>
}

export default BarChart