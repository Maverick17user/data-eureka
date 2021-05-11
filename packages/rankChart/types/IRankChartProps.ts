import { RankEntity, DrawingStyles, MARGINS_SET } from "./RankChartData";
 

export default interface IRankChartProps {
    data: Array<RankEntity>
    width?: 1120 | number
    height?: 540| number
    bumpRadius?: 13 | number
    padding?: 25 | number
    margin?: MARGINS_SET
    valueTitle?: "Value" | string
    drawingStyle: DrawingStyles
}