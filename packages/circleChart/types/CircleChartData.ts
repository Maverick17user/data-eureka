export type CircleDataEntity = {
    name: string
    value: number | undefined 
}

export type CircleData = {
    name: string
    children: Array<CircleDataEntity>
}

type CircleChartData = { 
    name: string, 
    children: Array<CircleData> 
} | CircleData | []

export default CircleChartData