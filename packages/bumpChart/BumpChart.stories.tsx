import React from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';
import BumpChart, { BumpChartProps } from './BumpChart';
import { bumpChartData } from './../generators/src/bumpChartData';

export default {
  title: 'Example/BumpChart',
  component: BumpChart,
} as Meta;

const COMMON_PROPS = {
  data: bumpChartData()
}

// @ts-ignore
const Template: Story<BumpChartProps> = (args) => <BumpChart {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  ...COMMON_PROPS,
};
