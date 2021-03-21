import React from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';
import RefChart, { RefChartProps } from './RefChart';
import { refChartTestData } from './../../generators/src/refChartTestData';

export default {
  title: 'Example/RefChart',
  component: RefChart,
} as Meta;

const COMMON_PROPS = {
  data: refChartTestData()
}

const Template: Story<RefChartProps> = (args) => <RefChart {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  ...COMMON_PROPS,
};
