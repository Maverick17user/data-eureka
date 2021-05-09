import React from 'react'
import CircleChart, { SELECTED_BORDER_COLOR } from '../CircleChart'
import { circleChart as getCircleChartData } from './../../generators/src/circleChart';
import '@testing-library/jest-dom'
import { fireEvent, render, waitFor } from "@testing-library/react";

const renderCircleChart = (w = 500, h = 500) => render(
    <CircleChart
        width={w}
        height={h}
        // @ts-ignore
        data={getCircleChartData()}
    />
);

describe('CircleChart', () => {

    it('should render div container and svg well', () => {
        const { getByTestId } = renderCircleChart()
        waitFor(() => {
            expect(getByTestId("container")).toBeInTheDocument();
            expect(getByTestId("svg")).toBeInTheDocument();
        })
    });

    it('should have viewBox attr setted', () => {
        const width = 500
        const height = 500
        
        const { getByTestId } = renderCircleChart(width, height)
        waitFor(() => {
            const supposeViewBoxValue = `-${width / 2} -${height / 2} ${width} ${height}`
            expect(getByTestId("svg")).toHaveAttribute("viewBox", supposeViewBoxValue);
        })
    });

    it('svg should be styled', () => {
        const { getByTestId } = renderCircleChart()

        waitFor(() => {
            expect(getByTestId("svg")).toHaveStyle({
                display: "block",
                margin: "0 -14px",
                cursor: "pointer",
            })
        })
    })

    it('circles should be rendered well', () => {
        const { getAllByTestId } = renderCircleChart()
        waitFor(() => {
            expect(getAllByTestId("circle").length).toBe(251);
        })
    })
    
    it('g wrapper (for circles) should be rendered well', () => {
        const { getByTestId } = renderCircleChart()

        waitFor(() => {
            expect(getByTestId("gWrapper")).toBeInTheDocument();
        })
    })

    it('should change styles on chart interaction', () => {
        const { getAllByTestId } = renderCircleChart()

        waitFor(() => {
            const circle = getAllByTestId("circle")[0]
            expect(circle).toBeInTheDocument()
    
            fireEvent.mouseOver(circle);
            waitFor(() => {
                expect(circle).toHaveStyle({stroke: SELECTED_BORDER_COLOR})
    
                fireEvent.mouseOut(circle);
                waitFor(() => {
                    expect(circle).toHaveStyle({stroke: null})
                })
            })
        })
    }) 

    it('should play animation on circle selectiong', () => {
        const { getAllByTestId, getByTestId } = renderCircleChart()

        waitFor(() => {
            const circle = getAllByTestId("circle")[0]
            expect(circle).toBeInTheDocument()
    
            fireEvent.click(circle);
            waitFor(() => {
                fireEvent.animationStart(getByTestId("gWrapper"));
                waitFor(() => {
                    expect(getByTestId("gWrapper")).toHaveStyle({display: "inline"});
                })

                fireEvent.animationEnd(getByTestId("gWrapper"));
                waitFor(() => {
                    expect(getByTestId("gWrapper")).toHaveStyle({display: "none"});
                })
            })
        })
    })
});