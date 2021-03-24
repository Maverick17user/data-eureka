import React from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';
import CircleChart, { CircleChartProps } from './CircleChart';
import { circleChart } from './../generators/src/circleChart';

export default {
  title: 'Example/CircleChart',
  component: CircleChart,
} as Meta;

const COMMON_PROPS = {
  data: circleChart()
}

const Template: Story<CircleChartProps> = (args) => <CircleChart {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  ...COMMON_PROPS,
};
