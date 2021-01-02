import {random} from 'lodash'

export const generateBarTestData = () => {
  const data = []

  for (let i = 0; i <= 50; i++) {
    data.push({ 
      xValue: i,
      yValue: random(0, 500),
    })
  }

  return { data }
}
  