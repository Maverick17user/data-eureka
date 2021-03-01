import React from 'react'
import { axisLeft } from "d3-axis"

export type AxisLineProps = any

const AxisLine: React.FC<AxisLineProps> = ({
  // lineCords: { x1, x2, y1, y2 }
  lineScale,
  ticksAmount,
}) => {
  
  axisLeft(lineScale).ticks(ticksAmount)

  return (
    // <line 
    //   style={{
    //     fill: 'none', 
    //     strokeWidth: 1, 
    //     stroke: "#474747",
    //   }}
    //   x1={x1 ?? 0}
    //   x2={x2 ?? 0}
    //   y1={y1 ?? 0}
    //   y2={y2 ?? 0}
    // />
  )
}
