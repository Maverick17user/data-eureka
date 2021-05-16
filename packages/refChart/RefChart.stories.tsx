import React from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';
import {RefChart} from './src/RefChart';
import { refChartTestData } from '../../generators/refChartTestData';
import IRefChartProps from './types/IRefChartProps';

export default {
  title: 'Example/RefChart',
  component: RefChart,
} as Meta;

const COMMON_PROPS = {
  data: refChartTestData()
}

const Template: Story<IRefChartProps> = (args) => <RefChart {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  ...COMMON_PROPS,
};
