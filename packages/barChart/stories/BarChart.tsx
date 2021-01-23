import React from 'react'
import XYAxis from '../components/XYAxis/XYAxis';
import Line from '../components/Line/Line';
import { scaleLinear, scaleBand } from 'd3-scale';
import { line, curveMonotoneX } from 'd3-shape';
import { extent } from 'd3-array';
import { max, min } from 'd3-array'
import { isEmpty } from 'lodash';


export type BarChartProps = any

/**
 * Bar chart component
 */
const BarChart: React.FC<BarChartProps> = ({
  data = [],
  width = 400,
  height = 300,
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

    return (
      <div id="barChart__container">
        <svg
          className="barChart__svg"
          width={width}
          height={height}
        >
          <g>
            {/* <XYAxis
  
            />
            <Line
  
            /> */}
            {/* {data.map((item, i) => ( */}
              <path
                // key={`item-${i}`}
                d={lineGenerator(data)}
                className='line'
                style={{ fill: 'none', strokeWidth: 2, stroke: "green" }}
              />
            {/* ))} */}
          </g>
        </svg>
      </div>
    )
  }

  return <div>kok</div>
}

export default BarChart