import React from 'react'
import IRefChartProps from '../types/IRefChartProps';
import useSvgMount from '../../../core/hooks/useSvgMount';
import { hierarchy, tree } from 'd3-hierarchy';
import { create } from 'd3-selection';
import { linkHorizontal } from 'd3-shape';

export function RefChart({
	data = [],
	width = 950,
	height = 300,
}: IRefChartProps) {

	const treeBuilder = (data: any) => {
		const root: any = hierarchy(data);
		root.dx = 10;
		root.dy = width / (root.height + 1);
		return tree().nodeSize([root.dx, root.dy])(root);
	}

	const root = treeBuilder(data);

	let x0 = Infinity;
	let x1 = -x0;
	root.each(d => {
		if (d.x > x1) x1 = d.x;
		if (d.x < x0) x0 = d.x;
	});

	const svg = create("svg")
		// @ts-ignore
		.attr("viewBox", [0, 0, width, x1 - x0 + root.dx * 2])
		.attr("data-testid", "svg")

	const g = svg.append("g")
		.attr("font-family", "sans-serif")
		.attr("font-size", 10)
		// @ts-ignore
		.attr("transform", `translate(${root.dy / 3},${root.dx - x0})`);

	g.append("g")
		.attr("data-testid", "g")
		.attr("fill", "none")
		.attr("stroke", "#555")
		.attr("stroke-opacity", 0.4)
		.attr("stroke-width", 1.5)
		.selectAll("path")
		.data(root.links())
		.join("path")
		// @ts-ignore
		.attr("d", linkHorizontal()
			// @ts-ignore
			.x(d => d.y)
			// @ts-ignore
			.y(d => d.x));

	const node = g.append("g")
		.attr("stroke-linejoin", "round")
		.attr("stroke-width", 3)
		.selectAll("g")
		.data(root.descendants())
		.join("g")
		.attr("transform", d => `translate(${d.y},${d.x})`);

	node.append("circle")
		.attr("data-testid", "reference_point")
		.attr("fill", d => d.children ? "#555" : "#999")
		.attr("r", 2.5);

	node.append("text")
		.attr("data-testid", "reference_point_text")
		.attr("dy", "0.31em")
		.attr("x", d => d.children ? -6 : 6)
		.attr("text-anchor", d => d.children ? "end" : "start")
		.text((d: any) => d.data.name)

	const svgRef: any = useSvgMount(svg)

	return <div style={{ width, height }} ref={svgRef} data-testid="container" />;
}
