"use client";

import {
  Calendar,
  RefreshCw,
} from "lucide-react";

import type {
  SalesPeriod,
} from "../SalesClient";

interface Props {

  restaurant: any;

  period: SalesPeriod;

  loading: boolean;

  onPeriodChange: (
    period: SalesPeriod
  ) => void;

}

export default function SalesHeader({

  restaurant,

  period,

  loading,

  onPeriodChange,

}: Props) {

  return (

<>

<style>{`

.wolf-sales-header{

display:flex;

justify-content:space-between;

align-items:flex-start;

gap:24px;

flex-wrap:wrap;

}

.wolf-sales-title{

font-size:32px;

font-weight:900;

letter-spacing:-1.8px;

color:white;

margin:0;

}

.wolf-sales-subtitle{

margin-top:8px;

display:flex;

align-items:center;

gap:8px;

font-size:14px;

color:#8b8b8b;

}

.wolf-segment{

display:flex;

align-items:center;

background:

rgba(255,255,255,.04);

border:

1px solid rgba(255,255,255,.06);

border-radius:999px;

padding:5px;

gap:5px;

}

.wolf-segment button{

padding:11px 18px;

border:none;

border-radius:999px;

background:none;

color:#9ca3af;

font-weight:700;

cursor:pointer;

transition:.25s;

}

.wolf-segment button.active{

background:

linear-gradient(

180deg,

#fb923c,

#ea580c

);

color:white;

box-shadow:

0 8px 20px

rgba(249,115,22,.35);

}

.wolf-refresh{

margin-left:12px;

width:46px;

height:46px;

border-radius:50%;

border:

1px solid rgba(255,255,255,.08);

background:

rgba(255,255,255,.03);

display:flex;

align-items:center;

justify-content:center;

cursor:pointer;

transition:.25s;

color:white;

}

.wolf-refresh:hover{

transform:translateY(-2px);

background:

rgba(255,255,255,.05);

}

.wolf-spin{

animation:

wolfSpin 1s linear infinite;

}

@keyframes wolfSpin{

to{

transform:rotate(360deg);

}

}

@media(max-width:768px){

.wolf-sales-header{

flex-direction:column;

align-items:stretch;

}

.wolf-sales-title{

font-size:22px;padding-left:12px;}

.wolf-segment{

width:100%;

justify-content:space-between;

}

.wolf-segment button{

flex:1;

}

.wolf-refresh{

display:none;

}

}

`}</style>

<header

className="wolf-sales-header"

>

<div>

<h1

className="wolf-sales-title"

>

Ventas

</h1>

<div

className="wolf-sales-subtitle"

>

<Calendar

size={15}

/>

<span>

{restaurant.name}

</span>

</div>

</div>

<div
style={{
display:"flex",
alignItems:"center",
}}
>

<div

className="wolf-segment"

>

<button

className={
period==="today"
?"active":""
}

onClick={()=>

onPeriodChange("today")

}

>

Hoy

</button>

<button

className={
period==="week"
?"active":""
}

onClick={()=>

onPeriodChange("week")

}

>

Semana

</button>

<button

className={
period==="month"
?"active":""
}

onClick={()=>

onPeriodChange("month")

}

>

Mes

</button>

</div>

<button

className="wolf-refresh"

>

<RefreshCw

size={18}

className={
loading
?"wolf-spin":""
}

/>

</button>

</div>

</header>

</>

  );

}