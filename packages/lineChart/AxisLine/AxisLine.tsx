import React from 'react'
import { axisLeft, axisBottom } from "d3-axis"
import { select } from "d3-selection"

export enum AxisOrientation {
  X = "x",
  Y = "y",
}

export interface AxisLineProps {
  orientation: AxisOrientation,
  // getX?: (v: number) => void,
  // getY?: (v: number) => void, // TODO: At least one get is req.
  getX?: any,
  getY?: any, // TODO: At least one get is req.
}

const AxisLine: React.FC<AxisLineProps> = ({
  orientation,
  getX,
  getY,
}) => {

  const getAxis = ref => {
    if (orientation === AxisOrientation.X) {
      const xAxis = axisBottom(getX)
      select(ref).call(xAxis);
    } else {
      const yAxis = axisLeft(getY).tickSize(0)
      // .tickSize(-400)
      // .tickPadding(0);
      select(ref).call(yAxis);
    }
  };

  // orientation === AxisOrientation.X && console.log(getY(0));

  // Move the X axis to the svg's bottom side
  const transformAxis = orientation === AxisOrientation.X 
    ? `translate(0, ${getY(0)})`
    : `translate(30px, 0)`

  return (
    <g
      ref={getAxis}
      transform={transformAxis}
      style={{
        fill: 'none',
        strokeWidth: 1,
        stroke: "#474747",
        transform: transformAxis,
      }}
    />
  )
}

export default AxisLine
