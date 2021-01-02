import React from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';
import BarChart, { BarChartProps } from './BarChart';
import { generateBarTestData } from '../../generators/src/barChartTestData';

export default {
  title: 'Example/BarChart',
  component: BarChart,
  // argTypes: {
  //   backgroundColor: { control: 'color' },
  // },
} as Meta;

const COMMON_PROPS = {
  data: generateBarTestData()
}

const Template: Story<BarChartProps> = (args) => <BarChart {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  ...COMMON_PROPS,
};
