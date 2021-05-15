import * as d3 from 'd3'

const xAxisCreator = (
  // @ts-ignore
  { width, height, marginBottom },
  // @ts-ignore
  { x, xTitle, halo }
  // @ts-ignore
) => (g) => {
  return g.attr("transform", `translate(0,${height - marginBottom})`)
    .call(d3.axisBottom(x).ticks(width / 80))
    .call((g: any) => g.select(".domain").remove())
    .call((g: any) => g.selectAll(".tick line").clone()
      .attr("y2", -height)
      .attr("stroke-opacity", 0.1))
    .call((g: any) => g.append("text")
      .attr("x", width - 4)
      .attr("y", -4)
      .attr("font-weight", "bold")
      .attr("text-anchor", "end")
      .attr("fill", "black")
      .text(xTitle)
      .call(halo)) 
}

export default xAxisCreator