# `animatedLineChart`

> TODO: React line chart with the animation 

## Usage

```javascript
import AnimatedLineChart from "@data-eureka/animated-line-chart"

const dataSet = {
    xTitle: "Miles per person per year",
    yTitle: "Cost per gallon",
    items: [
        {
            "orient":"bottom",
            "name":"2000",
            "x":0,
            "y":0
        },
        {
            "orient":"top",
            "name":"2005",
            "x":6.6965,
            "y":2.3829
        },
        {
            "orient":"right",
            "name":"2010",
            "x":36.6965,
            "y":5.3828
        },
        {
            "orient":"left",
            "name":"2021",
            "x":44.6,
            "y":1.65
        },
    ]
}

const AnyWrapperComponent = () => {
    return (
        <AnimatedLineChart data={dataSet}/>
    )
}
```
