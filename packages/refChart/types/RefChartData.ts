export type RefChartEntity = {
    name: string | number
    value: number
}

export type RefChartChilrens = Array<RefChartEntity>

export type RefChartWholeEnity = {
    name: string | number
    childern: RefChartChilrens
}

export type RefChartData = {
    name: string
    children: Array<RefChartWholeEnity>
} | []

export default RefChartData