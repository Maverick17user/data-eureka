import React from 'react'
import { refChartTestData } from '../../../generators/refChartTestData'
import { render } from '@testing-library/react'
import RefChart from '../src/RefChart'
import '@testing-library/jest-dom'

const renderCircleChart = (w = 500, h = 500) => render(
    <RefChart
        width={w}
        height={h}
        data={refChartTestData()}
    />
)

describe('RefChart', () => {
    it('should render div container and svg well', () => {
        const { getByTestId } = renderCircleChart()

        expect(getByTestId("container")).toBeInTheDocument()
        expect(getByTestId("svg")).toBeInTheDocument()
    });

    it('g should be styled', () => {
        const { getByTestId } = renderCircleChart()

        expect(getByTestId("g")).toHaveAttribute("fill", "none")
        expect(getByTestId("g")).toHaveAttribute("stroke", "#555")
        expect(getByTestId("g")).toHaveAttribute("stroke-opacity", "0.4")
        expect(getByTestId("g")).toHaveAttribute("stroke-width", "1.5")
    })

    it('should render 69 reference entities, according test data-set', () => {
        const { getAllByTestId } = renderCircleChart()

        expect(getAllByTestId("reference_point").length).toBe(69);
    }) 

    it('the amount of points and text labels must be equal', () => {
        const { getAllByTestId } = renderCircleChart()
        
        const reference_points_amount = getAllByTestId("reference_point").length
        const reference_point_texts_amount = getAllByTestId("reference_point_text").length

        expect(reference_points_amount).toBe(reference_point_texts_amount);
    })
})