import React from 'react'
import RankChart from '../RankChart'
import '@testing-library/jest-dom'
import { render } from "@testing-library/react";
import { bumpChartData } from './../../generators/src/bumpChartData';

const renderChart = (w = 500, h = 500) => render(
    // @ts-ignore
    <RankChart
        width={w}
        height={h}
        data={bumpChartData()}
    />
);

describe('RankChart', () => {

    it('should render div container and svg well', () => {
        const { getByTestId } = renderChart()

        expect(getByTestId("container")).toBeInTheDocument();
        expect(getByTestId("svg")).toBeInTheDocument();
    });

})
