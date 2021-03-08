import {random} from 'lodash'

export const generateBarTestData = () => {
  const data = []

  for (let i = 0; i <= 5; i++) {
    data.push({ 
      xValue: i,
      yValue: random(0, 50),
    })
  }

  return data
}

// console.log('📕: ');
// console.log('📙: ');
// console.log('📗: ');
// console.log('📘: ');
// console.log('📓: ');
// console.log('📔: ');