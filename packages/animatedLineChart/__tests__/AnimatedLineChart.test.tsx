import React from 'react'
import AnimatedLineChart, { 
    activeOpacity, 
    activeOutOpacity, 
    activeOutStrokeWidth, 
    activeStrokeWidth 
} from '../src/AnimatedLineChart'
import '@testing-library/jest-dom'
import { fireEvent, render, waitFor } from "@testing-library/react";
import { generateData } from '../../../generators/animatedLineChartTestData';

const renderCircleChart = (w = 500, h = 500) => render(
    // @ts-ignore
    <AnimatedLineChart
        width={w}
        height={h}
        data={generateData()}
    />
);

describe('AnimatedLineChart', () => {

    it('should render div container and svg well, expects 3 charts to be rendered', () => {
        // @ts-ignore
        const { getAllByTestId } = renderCircleChart()

        waitFor(() => {
            expect(getAllByTestId("container").length).toBe(3);
            // @ts-ignore
            getAllByTestId("container").forEach(element => {
                expect(element).toBeInTheDocument();
            });
    
            expect(getAllByTestId("svg").length).toBe(3);
            // @ts-ignore
            getAllByTestId("svg").forEach(element => {
                expect(element).toBeInTheDocument();
            });
    
            expect(getAllByTestId("svg").length).toBe(getAllByTestId("container").length);
        })
    });

    it('should have viewBox attr setted', () => {
        const width = 500
        const height = 500
        const { getAllByTestId } = renderCircleChart(width, height)
        const supposeViewBoxValue = `0, 0, ${width}, ${height}`

        waitFor(() => {
            // @ts-ignore
            getAllByTestId("svg").forEach(element => {
                expect(element).toHaveAttribute("viewBox", supposeViewBoxValue);
            });
        })

    });

    it('should change styles on chart interaction', () => {
        const { getAllByTestId } = renderCircleChart()

        waitFor(() => {
            const selectedPath = getAllByTestId("path")[0]
            
            expect(selectedPath).toBeInTheDocument()
    
            fireEvent.mouseOver(selectedPath);
            waitFor(() => {
                expect(selectedPath).toHaveAttribute("stroke-width", activeStrokeWidth)
                expect(selectedPath).toHaveAttribute("opacity", activeOpacity)
    
                fireEvent.mouseOut(selectedPath);
                waitFor(() => {
                    expect(selectedPath).toHaveAttribute("stroke-width", activeOutStrokeWidth)
                    expect(selectedPath).toHaveAttribute("opacity", activeOutOpacity)
                })
            })
        })
    })
})