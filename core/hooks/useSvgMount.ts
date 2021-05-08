
import { useRef, useEffect } from 'react';

const useSvgMount = (svg: any) => {
  const svgRef: any = useRef(null);
  
  const append = (svgItem: any) => svgRef.current.appendChild(svgItem.node())
  
  useEffect(() => {
    if (svgRef.current) {
      if (svg instanceof Array) {
        svg.forEach(svgItem => append(svgItem))
      } else {
        append(svg)
      }
    }
  }, [svgRef]);

  return [svgRef]
}

export default useSvgMount