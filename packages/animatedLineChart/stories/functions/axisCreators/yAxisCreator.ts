import * as d3 from 'd3'

const yAxisCreator = (
  { width, marginLeft },
  { y, yTitle, halo }
) => (g) => {
  return g.attr("transform", `translate(${marginLeft},0)`)
    .call(d3.axisLeft(y).ticks(null, "$.2f"))
    .call(g => g.select(".domain").remove())
    .call(g => g.selectAll(".tick line").clone()
      .attr("x2", width)
      .attr("stroke-opacity", 0.1))
    .call(g => g.select(".tick:last-of-type text").clone()
      .attr("x", 4)
      .attr("font-weight", "bold")
      .attr("text-anchor", "start")
      .attr("fill", "black")
      .text(yTitle)
      .call(halo))
}

export default yAxisCreator