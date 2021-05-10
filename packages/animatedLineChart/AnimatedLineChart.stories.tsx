import React from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';
import AnimatedLineChart from './AnimatedLineChart';
import { generateData } from '../generators/src/animatedLineChartTestData';
import IAnimatedLineChartProps from './types/IAnimatedLineChartProps';

export default {
  title: 'Example/AnimatedLineChart',
  component: AnimatedLineChart,
} as Meta;

const COMMON_PROPS = {
  data: generateData()
}

// @ts-ignore
const Template: Story<IAnimatedLineChartProps> = (args) => <AnimatedLineChart {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  ...COMMON_PROPS,
};
