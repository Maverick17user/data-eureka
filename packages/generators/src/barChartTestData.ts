import {random} from 'lodash'

export const generateBarTestData = () => {
  const data = []

  for (let i = 0; i <= 100; i++) {
    data.push({ 
      xValue: i,
      yValue: random(0, 250),
    })
  }

  return data
}
  