import React from 'react'
import XYAxis from '../components/XYAxis/XYAxis';
import Line from '../components/Line/Line';
import { scaleLinear, scaleBand } from 'd3-scale';
import { line, curveMonotoneX } from 'd3-shape';
import { extent } from 'd3-array';
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

  const xScale = scaleBand()
      .domain(data.map(d => d.name))
      .rangeRound([0, width]).padding(0.1)

    const yScale = scaleLinear()
      .domain(extent(data, d => d.value))
      .range([height, 0])
      .nice()

    const lineGenerator = line()
      .x(d => xScale(d.name))
      .y(d => yScale(d.value))
      .curve(curveMonotoneX)

  return (
    <div id="barChart__container">
      <svg
          className="barChart__svg"
          width={width}
          height={height}
        >
          <g>
            <XYAxis 
            
            />
            <Line 
            
            />
          </g>
        </svg>
    </div>
  )
}

export default BarChart