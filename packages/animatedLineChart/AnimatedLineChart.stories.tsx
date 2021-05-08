import React from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';
import AnimatedLineChart, { AnimatedLineChartProps } from './AnimatedLineChart';
import { generateData } from '../generators/src/animatedLineChartTestData';

export default {
  title: 'Example/AnimatedLineChart',
  component: AnimatedLineChart,
} as Meta;

const COMMON_PROPS = {
  data: generateData()
}

const Template: Story<AnimatedLineChartProps> = (args) => <AnimatedLineChart {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  ...COMMON_PROPS,
};
