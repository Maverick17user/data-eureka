import React from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';
import RankChart from './RankChart';
import { bumpChartData } from '../generators/src/bumpChartData';
import IRankChartProps from './types/IRankChartProps';

export default {
  title: 'Example/RankChart',
  component: RankChart,
} as Meta;

const COMMON_PROPS = {
  data: bumpChartData()
}

// @ts-ignore
const Template: Story<IRankChartProps> = (args) => <RankChart {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  ...COMMON_PROPS,
};
