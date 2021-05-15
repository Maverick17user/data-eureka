import React from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';
import CircleChart from './src/CircleChart';
import { circleChart } from '../../generators/circleChart';
import ICircleChartProps from './types/ICircleChartProps';

export default {
  title: 'Example/CircleChart',
  component: CircleChart,
} as Meta;

const COMMON_PROPS = {
  data: circleChart()
}

const Template: Story<ICircleChartProps> = (args) => <CircleChart {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  ...COMMON_PROPS,
};
