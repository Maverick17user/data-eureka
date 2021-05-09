import IRefChartData from './RefChartData'

export default interface IRefChartProps {
    width?: 500 | number
    height?: 500 | number
    data: IRefChartData
}