
import { useRef, useEffect } from 'react';

const useSvgMount = (svg) => {
  const svgRef = useRef(null);
  useEffect(() => {
      svgRef.current && svgRef.current.appendChild(svg.node())
  }, [svgRef]);

  return svgRef
}

export default useSvgMount