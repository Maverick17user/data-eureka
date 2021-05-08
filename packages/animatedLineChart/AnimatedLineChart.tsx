import React from 'react'
import * as d3 from 'd3'
import xAxisCreator from './functions/axisCreators/xAxisCreator';
import yAxisCreator from './functions/axisCreators/yAxisCreator';

// path {
//   cursor: pointer;
// }

// /* path:hover {
//   stroke-width: 3.5;
// } */

// path.unActive {
//   stroke-width: 3.5;
// }

// path#active {
//   opacity: 0.2;
//   stroke-width: 2.5;
// }
import useSvgMount from '../../core/hooks/useSvgMount';

export interface AnimatedLineChartProps { }

const marginF =  { top: 20, right: 30, bottom: 30, left: 40 }

// https://github.com/vasturiano/react-globe.gl

// nice stuff: https://observablehq.com/@analyzer2004/timespiral, https://observablehq.com/@mbostock/hertzsprung-russell-diagram
// https://observablehq.com/@tezzutezzu/world-history-timeline, https://observablehq.com/@d3/zoomable-circle-packing

function handleMouseOver(e) { 
  // Unactive
  d3.selectAll("path").style("opacity", "0.2")

  // Active
  d3.select(this)
    .style("stroke-width", "3")
    .style("opacity", "1")
    console.log(e.target.querySelector('circle'));
    
}

function handleMouseOut() {
  d3.selectAll("path")
    .style("stroke-width", "2.5")
    .style("opacity", "1")
}

// ex: https://observablehq.com/@d3/connected-scatterplot
function AnimatedLineChart({
  data = {},
  width = 720,
  height = 720,
  margin = marginF,
  curve = false,
  closedValue,
  pointsOnly = false,
  pointsText = true,
}) {

  // @ts-ignore
  const { charts, xTitle, yTitle } = data

  if (charts.length > 0) {
    function halo(text) {
      text.select(function () { return this.parentNode.insertBefore(this.cloneNode(true), this); })
        .attr("fill", "none")
        .attr("stroke", "white")
        .attr("stroke-width", 4)
        .attr("stroke-linejoin", "round");
    }
  
    const length = (path) => {
      return d3.create("svg:path").attr("d", path).node().getTotalLength();
    }
  
    const xList = 
      charts.map(chartData => d3.scaleLinear()
        .domain(d3.extent(chartData, d => d.x))
        .nice()
        .range([margin.left, width - margin.right])
      )
  
    const yList =
      charts.map(chartData => d3.scaleLinear()
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
    
    const svg = d3.create("svg").attr("viewBox", [0, 0, width, height]);
    
    svg.append("g").call(xAxis);
    svg.append("g").call(yAxis);
    
    const linesList = charts.map((_chartData, i) => {
      const line = d3.line()
        .x(d => xList[i](d.x))
        .y(d => yList[i](d.y))

      curve && line.curve(d3.curveCatmullRom)
      (closedValue || closedValue === 0) && line.curve(d3.curveCatmullRomClosed.alpha(closedValue))

      return line
    })

    charts.map((chartData, i) => {
      const l = length(linesList[i](chartData));
      const f = []

      const path = !pointsOnly && svg.append("path")
        .datum(chartData)
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("stroke-width", 2.5)
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-dasharray", `0,${l}`)
        .attr("d", linesList[i])

      !pointsOnly && path
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
        .delay((_d, index) => length(linesList[i](chartData.slice(0, index + 1))) / l * (5000 - 125))
        .attr("opacity", 1);

      !pointsOnly && path
        .on("mouseover", handleMouseOver)
        .on("mouseout", handleMouseOut)

      return svg
    })

    const svgRefsList = useSvgMount(svg)
  
    return (
      <div>
        {svgRefsList.map((svgRef, i) => <>
          <div key={i} style={{ width, height }} ref={svgRef} />
        </>)}
      </div>
    )
  } 

  return "haha!"
}

export default AnimatedLineChart
