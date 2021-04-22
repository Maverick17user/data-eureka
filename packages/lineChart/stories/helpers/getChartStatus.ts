export enum ChartStatus {
  Negative = 0, 
  Positive = 1,
}

const getChartStatus = (
  firstValue: number, 
  lastValue: number,
) : ChartStatus => {
  return firstValue > lastValue ? 0 : 1
}

export default getChartStatus;
