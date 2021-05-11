export type DrawingStyles = 'default' | 'transit' | 'compact'

export type SvgNodeType = d3.Selection<
    SVGSVGElement, undefined, null, undefined
> & string

export type SvgNodeType2 = d3.Selection<
    SVGGElement, undefined, null, undefined
>

export type MARGINS_SET = {
    left: 105 | number
    right: 105 | number
    top: 20 | number
    bottom: 50 | number
}

export type RankEntity = {
    nameGroup: string
    criteriaName: string | number
    value: string | number 
}