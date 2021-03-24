import React from 'react'
import * as d3 from 'd3'
import useSvgMount from '../../../core/hooks/useSvgMount';

export interface AnimatedLineChartProps { }

const marginF =  { top: 20, right: 30, bottom: 30, left: 40 }

// https://github.com/vasturiano/react-globe.gl

// nice stuff: https://observablehq.com/@analyzer2004/timespiral, https://observablehq.com/@mbostock/hertzsprung-russell-diagram
// https://observablehq.com/@tezzutezzu/world-history-timeline, https://observablehq.com/@d3/zoomable-circle-packing

// ex: https://observablehq.com/@d3/connected-scatterplot
function AnimatedLineChart({
  width = 720,
  height = 720,
  margin = marginF,
  data = {},
}) {

  // @ts-ignore
  const { items, xTitle, yTitle } = data

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

  const x = d3.scaleLinear()
    .domain(d3.extent(items, d => d.x)).nice()
    .range([margin.left, width - margin.right])

  const y = d3.scaleLinear()
    .domain(d3.extent(items, d => d.y)).nice()
    .range([height - margin.bottom, margin.top])

  const xAxis = g => g
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x).ticks(width / 80))
    .call(g => g.select(".domain").remove())
    .call(g => g.selectAll(".tick line").clone()
      .attr("y2", -height)
      .attr("stroke-opacity", 0.1))
    .call(g => g.append("text")
      .attr("x", width - 4)
      .attr("y", -4)
      .attr("font-weight", "bold")
      .attr("text-anchor", "end")
      .attr("fill", "black")
      .text(xTitle)
      .call(halo))

  const yAxis = g => g
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y).ticks(null, "$.2f"))
    .call(g => g.select(".domain").remove())
    .call(g => g.selectAll(".tick line").clone()
      .attr("x2", width)
      .attr("stroke-opacity", 0.1))
    .call(g => g.select(".tick:last-of-type text").clone()
      .attr("x", 4)
      .attr("text-anchor", "start")
      .attr("font-weight", "bold")
      .attr("fill", "black")
      .text(yTitle)
      .call(halo))

  const line = d3.line()
    .curve(d3.curveCatmullRom)
    .x(d => x(d.x))
    .y(d => y(d.y))

  const svg = d3.create("svg")
    .attr("viewBox", [0, 0, width, height]);

  const l = length(line(items));

  svg.append("g").call(xAxis);
  svg.append("g").call(yAxis);

  svg.append("path")
    .datum(items)
    .attr("fill", "none")
    .attr("stroke", "black")
    .attr("stroke-width", 2.5)
    .attr("stroke-linejoin", "round")
    .attr("stroke-linecap", "round")
    .attr("stroke-dasharray", `0,${l}`)
    .attr("d", line)
    .transition()
    .duration(5000)
    .ease(d3.easeLinear)
    .attr("stroke-dasharray", `${l},${l}`);

  svg.append("g")
    .attr("fill", "white")
    .attr("stroke", "black")
    .attr("stroke-width", 2)
    .selectAll("circle")
    .data(data)
    .join("circle")
    .attr("cx", d => x(d.x))
    .attr("cy", d => y(d.y))
    .attr("r", 3);

  const label = svg.append("g")
    .attr("font-family", "sans-serif")
    .attr("font-size", 10)
    .selectAll("g")
    .data(items)
    .join("g")
    .attr("transform", d => `translate(${x(d.x)},${y(d.y)})`)
    .attr("opacity", 0);

  label.append("text")
    .text(d => d.name)
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

  label.transition()
    .delay((d, i) => length(line(items.slice(0, i + 1))) / l * (5000 - 125))
    .attr("opacity", 1);

  const svgRef = useSvgMount(svg)

  return <div ref={svgRef} />;
}

export default AnimatedLineChart
