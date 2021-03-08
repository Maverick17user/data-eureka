import React, { useState } from 'react'
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
  const INITIAL_INTERVAL_STATE_VALUE = {
    startValue: null,
    endValue: null,
  }

  const [activeIndex, setActiveIndex] = useState(null);
  const [valueInterval, setValueInterval] = useState(INITIAL_INTERVAL_STATE_VALUE);

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
      .range([height, 0]);

    const lineGenerator = line()
      .x(d => getX(d.xValue) + getX.bandwidth() / 2)
      .y(d => getY(d.yValue))
      .curve(curveMonotoneX)(data)

    const areaPathGenerator = area()
      .x(d => getX(d.xValue) + getX.bandwidth() / 2)
      .y0(d => getY(d.yValue))
      .y1(() => getY(yMinValue))
      .curve(curveMonotoneX)(data); // TODO: Option for gradient style
    
    const holdAreaPathGenerator = area()
      .x(v => getX(v) + getX.bandwidth() / 2)
      .y0(v => getY(v))
      .y1(() => getY(yMinValue))
      .curve(curveMonotoneX)([Object.values(valueInterval)]); // TODO: Option for gradient style

    const firstYValue: number = data[0].yValue
    const lastYValue: number = data[data.length - 1].yValue
    const chartStaus: ChartStatus = getChartStatus(firstYValue, lastYValue)
    const isMouseHold = valueInterval.startValue && valueInterval.endValue && valueInterval.startValue !== valueInterval.endValue

    const chartColorStyle = chartStaus === ChartStatus.Negative
      ? "#eb3434"
      : "#34eb8f"

    // const margins = {
    //   top: 20,
    //   right: 20,
    //   bottom: 20,
    //   left: 20,
    // };

    const getDataIndex = (e) => {
      const x = e.nativeEvent.offsetX;
      const index = Math.floor(x / getX.step());
      return index;
    }

    const isLeftMouseBtn = (e) => {
      return e.nativeEvent.which === 1
    }

    const handleMouseMove = (e) => {
      const index = getDataIndex(e)
      setActiveIndex(index);

      // If mouse holdes
      const holdDownValue = data[index]?.yValue;
      if (isLeftMouseBtn(e) && valueInterval.startValue && index !== valueInterval.endValue) {
        setValueInterval(prev => ({...prev, endValue: holdDownValue}))
      }
    };

    const handleMouseLeave = () => {
      setActiveIndex(null);
    };

    const handleStartOfValueInterval = (e) => {
      if (isLeftMouseBtn(e)) {
        const index = getDataIndex(e)
        const holdDownValue = data[index]?.yValue;
        setValueInterval(prev => Number.isInteger(prev.startValue) 
            ? {...prev, endValue: holdDownValue}
            : {...prev, startValue: holdDownValue}
        )
      }
    }

    React.useEffect(() => {
      console.log(valueInterval);
    }, [valueInterval])

    const handleEndtOfValueInterval = (e) => {
      isLeftMouseBtn(e) && setValueInterval(INITIAL_INTERVAL_STATE_VALUE)
    }

    return (
      <div id="barChart__container">
        <svg
          className="barChart__svg"
          width={width}
          height={height + 25}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onPointerUp={handleEndtOfValueInterval}
          onPointerDown={handleStartOfValueInterval}
        >
          <AxisLine orientation={AxisOrientation.X} getX={getX} getY={getY} />
          <AxisLine orientation={AxisOrientation.Y} getY={getY} />
          <path
            d={isMouseHold ? holdAreaPathGenerator : areaPathGenerator}
            opacity={0.1}
            fill={chartColorStyle}
          />
          <path
            d={lineGenerator}
            className='line'
            style={{
              fill: 'none',
              strokeWidth: 2,
              stroke: chartColorStyle,
            }}
          />
          {/* TODO: Id generation */}
          {data.map((item, index) => (
            <g
              key={index}
            >
              <circle
                cx={getX(item.xValue) + getX.bandwidth() / 2}
                cy={getY(item.yValue)}
                r={index === activeIndex ? 6 : 4}
                fill={chartColorStyle}
                strokeWidth={index === activeIndex ? 2 : 0}
                stroke="#fff"
                style={{ transition: `ease-out .2s`, cursor: `pointer` }}
              />
              {index === activeIndex && (
                <text
                  fill="#666"
                  x={getX(item.xValue) + getX.bandwidth() / 2}
                  y={getY(item.yValue) - 10}
                  textAnchor="middle"
                  style={{ transition: `ease-in .2s` }}
                >
                  {item.yValue}
                </text>
              )}
            </g>
          ))}
        </svg>
      </div>
    )
  }

  return <div>Bruh</div>
}

export default BarChart