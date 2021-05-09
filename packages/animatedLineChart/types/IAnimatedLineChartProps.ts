import AnimatedLineChartData from './AnimatedLineChartData'

export type MARGINS = {
    top: number
    right: number
    bottom: number
    left: number
}

export default interface IAnimatedLineChartProps {
    width?: number
    height?: number
    data: AnimatedLineChartData | {}
    margin?: MARGINS
    curve?: boolean
    closedValue?: number
    pointsOnly?: boolean
    pointsText?: boolean
}