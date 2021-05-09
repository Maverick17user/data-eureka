export type XY = {
    x: number;
    y: number;
  }

export type Point = {
    orient?: string,
    name: string | number,
    x: number,
    y: number
}

export type ChartData = Array<Point>

type AnimatedLineChartData = {
    xTitle: string
    yTitle: string
    charts: Array<ChartData>
}

export default AnimatedLineChartData