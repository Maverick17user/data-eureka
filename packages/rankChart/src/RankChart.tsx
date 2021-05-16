import React from 'react'
import { Axis, axisBottom, axisLeft, axisRight } from 'd3-axis';
import { format } from 'd3-format';
import { scaleOrdinal, scalePoint } from 'd3-scale';
import { schemeTableau10 } from 'd3-scale-chromatic';
import { create } from 'd3-selection';
import { line } from 'd3-shape';
import useSvgMount from '../../../core/hooks/useSvgMount'
import IRankChartProps from '../types/IRankChartProps';
import { RankEntity, SvgNodeType, SvgNodeType2 } from '../types/RankChartData';

const getRanking = (
    criteriaNames: (string | number)[], 
    nameGroup: string[], 
    chartData: any[]
) => {
    const len = criteriaNames.length - 1;
    
    const ranking = chartData.map((d, i) => ({ nameGroup: nameGroup[i], first: d[0].rank, last: d[len].rank }));
    return ranking;
}

const getChartData = (
    nameGroup: string[], 
    criteriaNames: (string | number)[], 
    data: RankEntity[]
) => {
    const ti = new Map(nameGroup.map((nameGroup, i) => [nameGroup, i]));
    const qi = new Map(criteriaNames.map((criteriaName, i) => [criteriaName, i]));

    const matrix = Array.from(ti, () => new Array(criteriaNames.length).fill(null));
    for (const { nameGroup, criteriaName, value } of data) {
        // @ts-ignore
        matrix[ti.get(nameGroup)][qi.get(criteriaName)] = { rank: 0, value: +value, next: null };
    }

    matrix.forEach((d) => {
        for (let i = 0; i < d.length - 1; i++) {
            d[i].next = d[i + 1];
        }
    });

    criteriaNames.forEach((_d, i) => {
        let array: any[] = [];
        matrix.forEach((d) => array.push(d[i]));
        array.sort((a, b) => b.value - a.value);
        array.forEach((d, j) => d.rank = j);
    });

    return matrix;
}

export const MARGINS = { left: 105, right: 105, top: 20, bottom: 50 }

export function RankChart({
    data,
    width = 1120,
    height = 541, 
    bumpRadius = 13,
    padding = 25,
    margin = MARGINS,
    valueTitle = "Value",
    drawingStyle
}: IRankChartProps) {

    const nameGroup = Array.from(new Set(data.flatMap(d => [d.nameGroup])))
    const criteriaNames = Array.from(new Set(data.flatMap(d => [d.criteriaName])))
    const chartData = getChartData(nameGroup, criteriaNames, data)
    const ranking = getRanking(criteriaNames, nameGroup, chartData)

    const left = ranking.sort((a, b) => a.first - b.first).map((d) => d.nameGroup);
    const right = ranking.sort((a, b) => a.last - b.last).map((d) => d.nameGroup);

    const seq = (start: number, length: number) => {
        // @ts-ignore
        return Array.apply(null, { length }).map((_d, i) => i + start);
    }

    const color = scaleOrdinal(schemeTableau10)
    // @ts-ignore
        .domain(seq(0, ranking.length))

    const toCurrency = (num: number) => format("$,.2f")(num)

    const y = scalePoint()
        .range([margin.top, height - margin.bottom - padding]);

    const ax = scalePoint()
    // @ts-ignore
        .domain(criteriaNames)
        .range([margin.left + padding, width - margin.right - padding]);

    const by = scalePoint()
    // @ts-ignore
        .domain(seq(0, ranking.length))
        .range([margin.top, height - margin.bottom - padding])

    const bx = scalePoint()
    // @ts-ignore
        .domain(seq(0, criteriaNames.length))
        .range([0, width - margin.left - margin.right - padding * 2])

    const strokeWidth = scaleOrdinal()
        .domain(["default", "transit", "compact"])
        .range([5, bumpRadius * 2 + 2, 2]);

    const getText = (d: any, i: number) => `${d.nameGroup} - ${criteriaNames[i]}\nRank: ${d.value.rank + 1}\n${valueTitle}: ${toCurrency(d.value.value)}`
    const title = (g: SvgNodeType) => g.append("title").text(getText)

    const drawAxis = (
        g: SvgNodeType, 
        x: number, 
        y: number, 
        axis: Axis<string>, 
        domain: boolean
    ) => {
        g.attr("transform", `translate(${x},${y})`)
            .call(axis)
            .selectAll(".tick text")
            .attr("font-size", "12px");

        if (!domain) g.select(".domain").remove();
    }

    const compact = drawingStyle === "compact";
    const svg = create("svg")
        .attr("data-testid", "container")
        .attr("cursor", "default")
        // @ts-ignore
        .attr("viewBox", [0, 0, width, height]);

    svg.append("g")
        .attr("transform", `translate(${margin.left + padding},0)`)
        .selectAll("path")
        .data(seq(0, criteriaNames.length))
        .join("path")
        .attr("stroke", "#ccc")
        .attr("stroke-width", 2)
        .attr("stroke-dasharray", "5,5")
        // @ts-ignore
        .attr("d", d => line()([[bx(d), 0], [bx(d), height - margin.bottom]]));

    const series = svg.selectAll(".series")
        // @ts-ignore
        .data(chartData)
        .join("g")
        .attr("class", "series")
        .attr("opacity", 1)
        .attr("fill", d => color(d[0].rank))
        .attr("stroke", d => color(d[0].rank))
        .attr("transform", `translate(${margin.left + padding},0)`)
        .attr("cursor", "pointer")
        .on("mouseover", highlight)
        .on("mouseout", restore);

    series.selectAll("path")
        .data(d => d)
        .join("path")
        // @ts-ignore
        .attr("stroke-width", strokeWidth(drawingStyle))
        // @ts-ignore
        .attr("d", (d, i) => {
            if (d.next) {
                // @ts-ignore
                return line()([[bx(i), by(d.rank)], [bx(i + 1), by(d.next.rank)]]);
            }
        });

    const bumps = series.selectAll("g")
        .data((d, i) => d.map(v => ({ nameGroup: nameGroup[i], value: v, first: d[0].rank })))
        .join("g")
        // @ts-ignore
        .attr("transform", (d, i) => `translate(${bx(i)},${by(d.value.rank)})`)
        // @ts-ignore
        .call(title);

    bumps.append("circle").attr("r", compact ? 5 : bumpRadius);
    bumps.append("text")
        .attr("dy", compact ? "-0.75em" : "0.35em")
        // @ts-ignore
        .attr("fill", compact ? null : "white")
        .attr("stroke", "none")
        .attr("text-anchor", "middle")
        .style("font-weight", "bold")
        .style("font-size", "14px")
        .text(d => d.value.rank + 1);

    // @ts-ignore
    svg.append("g").call(g => drawAxis(g, 0, height - margin.top - margin.bottom + padding, axisBottom(ax), true));
    // @ts-ignore
    const leftY = svg.append("g").call(g => drawAxis(g, margin.left, 0, axisLeft(y.domain(left))));
    // @ts-ignore
    const rightY = svg.append("g").call(g => drawAxis(g, width - margin.right, 0, axisRight(y.domain(right))));
    // @ts-ignore
    function highlight(_e, d) {
        // @ts-ignore
        this.parentNode.appendChild(this);
        series.filter(s => s !== d)
            .transition().duration(500)
            .attr("fill", "#ddd").attr("stroke", "#ddd");
        markTick(leftY, 0);
        markTick(rightY, criteriaNames.length - 1);

        function markTick(
            axis: SvgNodeType2, 
            pos: number
        ) {
            axis.selectAll(".tick text").filter((_s, i) => i === d[pos].rank)
                .transition().duration(500)
                .attr("font-weight", "bold")
                .attr("fill", color(d[0].rank));
        }
    }

    function restore() {
        series.transition().duration(500)
            .attr("fill", s => color(s[0].rank)).attr("stroke", s => color(s[0].rank));
        restoreTicks(leftY);
        restoreTicks(rightY);

        function restoreTicks(axis: SvgNodeType2) {
            axis.selectAll(".tick text")
                .transition().duration(500)
                .attr("font-weight", "normal").attr("fill", "black");
        }
    }

    const svgRef = useSvgMount(svg)

    return <div style={{ width, height }} ref={svgRef} data-testid="container" />
}
