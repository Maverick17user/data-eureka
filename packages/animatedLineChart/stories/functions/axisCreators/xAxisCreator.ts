import * as d3 from 'd3'

const xAxisCreator = (
  { width, height, marginBottom },
  { x, xTitle, halo }
) => (g) => {
  return g.attr("transform", `translate(0,${height - marginBottom})`)
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
}

export default xAxisCreator