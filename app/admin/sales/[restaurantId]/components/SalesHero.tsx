"use client";

import {
  TrendingUp,
  Package,
  Receipt,
  PawPrint,
} from "lucide-react";

import {
  useMemo,
  type ReactNode,
} from "react";

import {
  useWolfCounter,
  WolfHero,
  WolfChart,
  wolfHeroKeyframes,
  wolfChartKeyframes,
} from "@/lib/wolf-motion";

interface ChartPoint {

  label: string;

  value: number;

}

interface Props {

  totalSales: number;

  totalOrders: number;

  averageTicket: number;

  wolfCommission: number;

  chartData: ChartPoint[];

}

export default function SalesHero({

  totalSales,

  totalOrders,

  averageTicket,

  wolfCommission,

  chartData,

}: Props) {

  /*
  ==========================================================
  WOLF MOTION
  ==========================================================
  */

  const displayTotal =
    useWolfCounter(
      totalSales,
      {
        decimals: 2,
      }
    );

  /*
  ==========================================================
  CHART
  ==========================================================
  */

  const maxValue =
    useMemo(() => {

      return Math.max(

        ...chartData.map(

          item => item.value

        ),

        1

      );

    }, [chartData]);

  return (

<>

<style>

{`

${wolfHeroKeyframes}

${wolfChartKeyframes}

.wolf-hero{

position:relative;

overflow:hidden;

padding:8px 0 0;

}

.wolf-title{

font-size:15px;

font-weight:700;

letter-spacing:.3px;

color:#9ca3af;

}

.wolf-total{

margin-top:12px;

font-size:68px;

font-weight:900;

line-height:1;

letter-spacing:-3px;

color:white;

}

.wolf-live{

margin-top:18px;

display:inline-flex;

align-items:center;

gap:8px;

padding:10px 16px;

border-radius:999px;

background:

rgba(34,197,94,.12);

color:#22c55e;

font-size:13px;

font-weight:700;

}

.wolf-divider{

height:1px;

margin:36px 0;

background:

linear-gradient(

90deg,

transparent,

rgba(255,255,255,.08),

transparent

);

}

@media(max-width:768px){

.wolf-total{

font-size:48px;

}

}

`}

</style>

<section

className="wolf-hero"

style={WolfHero.reveal}

>

<div

style={{

...WolfHero.glow,

position:"absolute",

top:-140,

right:-120,

width:340,

height:340,

borderRadius:"50%",

background:

"radial-gradient(circle, rgba(249,115,22,.14), transparent 72%)",

pointerEvents:"none",

}}

 />

<div className="wolf-title">

Ventas del período

</div>

<div

className="wolf-total"

style={WolfHero.total}

>

${displayTotal.toFixed(2)}

</div>

<div

className="wolf-live"

style={WolfHero.badge}

>

<TrendingUp size={15}/>

Actualizado automáticamente

</div>

<div className="wolf-divider"/>


{/* ==============================================

AQUÍ VA EL GRÁFICO SVG

PARTE 2

============================================== */}
<div
  style={{
    width: "100%",
    overflow: "hidden",
  }}
>

<svg
  viewBox="0 0 900 320"
  width="100%"
  height="320"
>

<defs>

<linearGradient
id="wolfHeroFill"
x1="0"
y1="0"
x2="0"
y2="1"
>

<stop
offset="0%"
stopColor="#fb923c"
stopOpacity=".32"
/>

<stop
offset="100%"
stopColor="#fb923c"
stopOpacity="0"
/>

</linearGradient>

<filter id="wolfGlow">

<feGaussianBlur
stdDeviation="6"
result="blur"
/>

<feMerge>

<feMergeNode in="blur"/>

<feMergeNode in="SourceGraphic"/>

</feMerge>

</filter>

</defs>

<line

x1="0"

y1="270"

x2="900"

y2="270"

stroke="rgba(255,255,255,.08)"

strokeWidth="2"

/>

{

(() => {

const points =

chartData.map(

(item,index)=>{

const x =

chartData.length===1

?450

:index*

(900/(chartData.length-1));

const y =

270-

(item.value/maxValue)*180;

return {x,y};

}

);

if(points.length===0){

return null;

}

let line =

`M ${points[0].x} ${points[0].y}`;

for(

let i=1;

i<points.length;

i++

){

const prev=

points[i-1];

const curr=

points[i];

const cx=

(prev.x+curr.x)/2;

line +=

` Q ${cx} ${prev.y}, ${curr.x} ${curr.y}`;

}

const area =

line+

` L900 270 L0 270 Z`;

return(

<>

<path
d={area}
fill="url(#wolfHeroFill)"
style={WolfChart.area}
/>

<path
d={line}
fill="none"
stroke="#fb923c"
strokeWidth="5"
strokeLinecap="round"
strokeLinejoin="round"
filter="url(#wolfGlow)"
style={WolfChart.line}
/>

{

points.map(

(point,index)=>(

<g key={index}>

<circle

cx={point.x}

cy={point.y}

r="5"

fill="#fb923c"

/>

<circle
cx={point.x}
cy={point.y}
r="11"
fill="rgba(249,115,22,.18)"
style={WolfChart.point}
/>

<text
x={point.x}
y="302"
textAnchor="middle"
fill="#7f7f7f"
fontSize="12"
style={WolfChart.label}
>

{

chartData[index]

.label

}

</text>

</g>

)

)

}

</>

);

})()

}

</svg>

</div>


{/* ==============================================

KPIs

PARTE 3

============================================== */}
<div
  style={{
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(180px,1fr))",
    gap: 24,
    marginTop: 34,

    animation:
      "wolfHeroReveal .9s cubic-bezier(.19,1,.22,1)",

    animationDelay: ".45s",

    animationFillMode: "both",
  }}
>

  <HeroMetric
    icon={<Package size={22} />}
    label="Pedidos"
    value={totalOrders.toString()}
    color="#3b82f6"
  />

  <HeroMetric
    icon={<Receipt size={22} />}
    label="Ticket promedio"
    value={`$${averageTicket.toFixed(2)}`}
    color="#22c55e"
  />

  <HeroMetric
    icon={<PawPrint size={22} />}
    label="Comisión Wolf"
    value={`$${wolfCommission.toFixed(2)}`}
    color="#f97316"
  />

</div>

</section>

</>

);

}

interface HeroMetricProps {

  icon: ReactNode;

  label: string;

  value: string;

  color: string;

}

function HeroMetric({

  icon,

  label,

  value,

  color,

}: HeroMetricProps) {

  return (

<div
style={{

display:"flex",

alignItems:"center",

gap:16,

padding:"14px 0",

transition:"all .25s ease",

cursor:"default",

}}
>

<div
style={{

width:48,

height:48,

borderRadius:16,

display:"flex",

alignItems:"center",

justifyContent:"center",

background:`${color}16`,

transition:"all .25s ease",

color,

flexShrink:0,

}}

>

{icon}

</div>

<div>

<div
style={{

fontSize:13,

color:"#8b8b8b",

marginBottom:4,

}}

>

{label}

</div>

<div
style={{

fontSize:24,

fontWeight:800,

color:"white",

}}

>

{value}

</div>

</div>

</div>

  );

}