import React from 'react'
import * as d3 from 'd3'
import xAxisCreator from '../functions/axisCreators/xAxisCreator';
import yAxisCreator from '../functions/axisCreators/yAxisCreator';
import useSvgMount from '../../../core/hooks/useSvgMount';
import IAnimatedLineChartProps from '../types/IAnimatedLineChartProps';
import { Point } from '../types/AnimatedLineChartData';

export const marginF =  { top: 20, right: 30, bottom: 30, left: 40 }
export const activeStrokeWidth = "3"
export const activeOpacity = "1"
export const activeOutStrokeWidth = "2.5"
export const activeOutOpacity = "1"

export function handleMouseOver() { 
  // Unactive
  d3.selectAll("path").style("opacity", "0.2")

  // Active
  // @ts-ignore
  d3.select(this)
    .style("stroke-width", activeStrokeWidth)
    .style("opacity", activeOpacity)    
}

export function handleMouseOut() {
  d3.selectAll("path")
    .style("stroke-width", activeOutStrokeWidth)
    .style("opacity", activeOutOpacity)
}

export function AnimatedLineChart({
  data = {},
  width = 720,
  height = 720,
  margin = marginF,
  curve = false,
  closedValue,
  pointsOnly = false,
  pointsText = true,
}: IAnimatedLineChartProps) {

  // @ts-ignore
  const { charts, xTitle, yTitle } = data

  if (charts.length > 0) {
    // @ts-ignore
    function halo(text: any) {
      // @ts-ignore
      text.select(function () { return this.parentNode.insertBefore(this.cloneNode(true), this); })
        .attr("fill", "none")
        .attr("stroke", "white")
        .attr("stroke-width", 4)
        .attr("stroke-linejoin", "round");
    }
  
    const length = (path: number) => {
      try {
        // @ts-ignore
        return d3?.create("svg:path")?.attr("d", path)?.node()?.getTotalLength() ?? 0;
      } catch {
        return 0
      }
    }
  
    const xList = charts.map((chartData: Point) => d3.scaleLinear()
      // @ts-ignore
      .domain(d3.extent(chartData, d => d.x))
      .nice()
      .range([margin.left, width - margin.right])
    )
  
    const yList = charts.map((chartData: Iterable<Point> | Point[]) => d3.scaleLinear()
      // @ts-ignore
      .domain(d3.extent(chartData, d => d.y))
      .nice()
      .range([height - margin.bottom, margin.top])
    )

    const xScaleData = {width, height, marginBottom: margin.bottom}
    const yScaleData = {width, marginLeft: margin.left}
    const xPointData =  {x: xList[0], xTitle, halo}
    const yPointeData = {y: yList[0], yTitle, halo}

    const xAxis = xAxisCreator(xScaleData, xPointData)
    const yAxis = yAxisCreator(yScaleData, yPointeData)
    const svg = d3.create("svg")
      // @ts-ignore
      .attr("viewBox", [0, 0, width, height])
      .attr("data-testid", "svg")
    
    svg.append("g").call(xAxis);
    svg.append("g").call(yAxis);
    
    const linesList = charts.map((_chartData: Iterable<Point> | Point[], i: number) => {
      const line = d3.line()
      // @ts-ignore
        .x(d => xList[i](d.x))
      // @ts-ignore
        .y(d => yList[i](d.y))

      curve && line.curve(d3.curveCatmullRom)
      // @ts-ignore
      (closedValue || closedValue === 0) && line.curve(d3.curveCatmullRomClosed.alpha(closedValue))

      return line
    })

    charts.map((chartData: Iterable<Point> | Point[], i: number) => {
      const l = length(linesList[i](chartData));

      const path = !pointsOnly && svg.append("path")
        .datum(chartData)
        .attr("data-testid", "path")
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("stroke-width", 2.5)
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-dasharray", `0,${l}`)
        .attr("d", linesList[i])

      !pointsOnly && path
        // @ts-ignore
        .transition()
        .duration(5000)
        .ease(d3.easeLinear)
        .attr("stroke-dasharray", `${l},${l}`)
    
      svg.append("g")
        .attr("fill", "white")
        .attr("stroke", "black")
        .attr("stroke-width", 2)
        .selectAll("circle")
        .data(chartData)
        .join("circle")
        .attr("cx", d => xList[i](d.x))
        .attr("cy", d => yList[i](d.y))
        .attr("r", 3);
    
      const label = svg.append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .selectAll("g")
        .data(chartData)
        .join("g")
        .attr("transform", d => `translate(${xList[i](d.x)},${yList[i](d.y)})`)
        .attr("opacity", 0);
    
      pointsText && label.append("text")
        .text(d => {
          return d.name
        })
        .each(function (d) {
          const t = d3.select(this);
          switch (d.orient) {
            case "top": t.attr("text-anchor", "middle").attr("dy", "-0.7em"); break;
            case "right": t.attr("dx", "0.5em").attr("dy", "0.32em").attr("text-anchor", "start"); break;
            case "bottom": t.attr("text-anchor", "middle").attr("dy", "1.4em"); break;
            case "left": t.attr("dx", "-0.5em").attr("dy", "0.32em").attr("text-anchor", "end"); break;
          }
        })
        .call(halo);
    
      pointsText && label.transition()
      // @ts-ignore
        .delay((_d, index) => length(linesList[i](chartData.slice(0, index + 1))) / l * (5000 - 125))
        .attr("opacity", 1);

      !pointsOnly && path
      // @ts-ignore
        .on("mouseover", handleMouseOver)
        .on("mouseout", handleMouseOut)

      return svg
    })

    const svgRefsList = useSvgMount(svg, "ARRAY")
  
    return (
      <div>
        {svgRefsList.map((svgRef: any, i: number) => <>
          <div key={i} style={{ width, height }} ref={svgRef} data-testid="container" />
        </>)}
      </div>
    )
  } 

  return ""
}
