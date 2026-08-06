"use client";

export default function SalesSkeleton() {

  return (

    <>

      <style>{`

.wolf-skeleton{

display:flex;

flex-direction:column;

gap:30px;

animation:wolfFade .35s ease;

}

.wolf-skeleton-block{

position:relative;

overflow:hidden;

background:

rgba(255,255,255,.05);

border-radius:20px;

}

.wolf-skeleton-block::after{

content:"";

position:absolute;

inset:0;

transform:translateX(-100%);

background:

linear-gradient(

90deg,

transparent,

rgba(255,255,255,.08),

transparent

);

animation:

wolfShimmer 1.4s linear infinite;

}

.hero{

height:420px;

border-radius:28px;

}

.row{

display:grid;

grid-template-columns:

repeat(3,minmax(180px,1fr));

gap:20px;

}

.card{

height:96px;

border-radius:20px;

}

.list{

display:flex;

flex-direction:column;

gap:18px;

}

.line{

height:74px;

border-radius:18px;

}

@media(max-width:768px){

.row{

grid-template-columns:1fr;

}

.hero{

height:340px;

}

}

@keyframes wolfShimmer{

100%{

transform:translateX(100%);

}

}

@keyframes wolfFade{

from{

opacity:0;

}

to{

opacity:1;

}

}

`}</style>

<div className="wolf-skeleton">

<div

className="wolf-skeleton-block hero"

/>

<div className="row">

<div

className="wolf-skeleton-block card"

/>

<div

className="wolf-skeleton-block card"

/>

<div

className="wolf-skeleton-block card"

/>

</div>
<div className="list">

  <div
    className="wolf-skeleton-block line"
  />

  <div
    className="wolf-skeleton-block line"
  />

  <div
    className="wolf-skeleton-block line"
  />

</div>

<div className="list">

  <div
    className="wolf-skeleton-block line"
  />

  <div
    className="wolf-skeleton-block line"
  />

  <div
    className="wolf-skeleton-block line"
  />

  <div
    className="wolf-skeleton-block line"
  />

</div>

</div>

</>

);

}