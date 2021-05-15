import React from 'react'
import * as d3 from 'd3'
import useSvgMount from '../../../core/hooks/useSvgMount'
import ICircleChartProps from '../types/ICircleChartProps'
import CircleChartData from '../types/CircleChartData'
import { HierarchyNode } from 'd3';

export const SELECTED_BORDER_COLOR = "#000"

function CircleChart({
	data = [],
	width = 932,
	height = 932,
}: ICircleChartProps) {

	const pack = (data: CircleChartData) => d3.pack()
		.size([width, height])
		.padding(3)
		(d3.hierarchy(data)
			.sum((d: any): number => d.value)
			.sort((
				a: HierarchyNode<CircleChartData>, 
				b: HierarchyNode<CircleChartData>): number => b.value! - a.value!))

	const color = d3.scaleLinear()
		.domain([0, 5])
		// @ts-ignore
		.range(["hsl(152,80%,80%)", "hsl(228,30%,40%)"])
		// @ts-ignore
		.interpolate(d3.interpolateHcl)

	const root = pack(data);
	let focus = root;
	let view: d3.ZoomView | any;

	const svg = d3.create("svg")
		.attr("data-testid", "svg")
		.attr("viewBox", `-${width / 2} -${height / 2} ${width} ${height}`)
		.style("display", "block")
		.style("margin", "0 -14px")
		.style("background", color(0))
		.style("cursor", "pointer")
		.on("click", (event) => zoom(event, root));

	const node = svg.append("g")
		.selectAll("circle")
		.data(root.descendants().slice(1))
		.join("circle")
		.attr("data-testid", "circle")
		.attr("fill", d => d.children ? color(d.depth) : "white")
		.attr("pointer-events", d => !d.children ? "none" : null)
		.on("mouseover", function () { 
			d3.select(this).attr("stroke", SELECTED_BORDER_COLOR); 
		})
		.on("mouseout", function () { 
			d3.select(this).attr("stroke", null); 
		})
		.on("click", (event, d) => focus !== d && (zoom(event, d), event.stopPropagation()));

	const label = svg.append("g")
		.style("font", "10px sans-serif")
		.attr("data-testid", "gWrapper")
		.attr("pointer-events", "none")
		.attr("text-anchor", "middle")
		.selectAll("text")
		.data(root.descendants())
		.join("text")
		.style("fill-opacity", d => d.parent === root ? 1 : 0)
		.style("display", d => d.parent === root ? "inline" : "none")
		.text((d: any) => d.data.name);

	zoomTo([root.x, root.y, root.r * 2]);

	function zoomTo(v: number[]) {
		const k = width / v[2];

		view = v;

		label.attr("transform", d => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`);
		node.attr("transform", d => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`);
		node.attr("r", d => d.r * k);
	}

	function zoom(event: any, d: d3.HierarchyCircularNode<unknown>) {
		focus = d;

		const transition = svg.transition()
			.duration(event.altKey ? 7500 : 750)
			.tween("zoom", () => {
				const i: d3.ZoomInterpolator = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2]);
				return (t: number) => zoomTo(i(t));
			});

		label
			.filter(function (d) { 
				const self = this as HTMLElement
				return d.parent === focus || self.style.display === "inline"; 
			})
			// @ts-ignore
			.transition(transition)
			.style("fill-opacity", d => d.parent === focus ? 1 : 0)
			.on("start", function (d) { 
				const self = this as HTMLElement
				if (d.parent === focus) self.style.display = "inline"; 
			})
			.on("end", function (d) { 
				const self = this as HTMLElement
				if (d.parent !== focus) self.style.display = "none"; 
			});
	}

	const svgRef: any = useSvgMount(svg)

	return <div style={{ width, height }} ref={svgRef} data-testid="container" />
}

export default CircleChart
