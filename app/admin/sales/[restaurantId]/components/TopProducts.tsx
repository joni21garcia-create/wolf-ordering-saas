"use client";

interface Product {

  id: string;

  name: string;

  image_url: string | null;

  quantity: number;

  revenue: number;

}

interface Props {

  products: Product[];

}

export default function TopProducts({

  products,

}: Props) {

  const maxQuantity =

    Math.max(

      ...products.map(

        p => p.quantity

      ),

      1

    );

  return (

<>

<style>{`

.wolf-products{

display:flex;

flex-direction:column;

gap:22px;

}

.wolf-product{

display:flex;

align-items:center;

gap:18px;

}

.wolf-rank{

width:42px;

height:42px;

border-radius:50%;

display:flex;

align-items:center;

justify-content:center;

font-size:20px;

background:

rgba(249,115,22,.12);

flex-shrink:0;

}

.wolf-product-info{

flex:1;

min-width:0;

}

.wolf-product-header{

display:flex;

justify-content:space-between;

align-items:center;

gap:16px;

margin-bottom:10px;

}

.wolf-product-name{

font-size:16px;

font-weight:700;

color:white;

white-space:nowrap;

overflow:hidden;

text-overflow:ellipsis;

}

.wolf-product-qty{

font-size:13px;

color:#9ca3af;

}

.wolf-track{

height:10px;

border-radius:999px;

background:

rgba(255,255,255,.05);

overflow:hidden;

}

.wolf-fill{

height:100%;

border-radius:999px;

background:

linear-gradient(

90deg,

#fb923c,

#ea580c

);

transform-origin:left;

animation:

wolfGrow .8s ease forwards;

}

.wolf-revenue{

margin-top:8px;

font-size:13px;

color:#8b8b8b;

}

@keyframes wolfGrow{

from{

transform:scaleX(0);

}

to{

transform:scaleX(1);

}

}

`}</style>

<div

className="wolf-products"

>

{

products.map(

(product,index)=>(

<div

key={product.id}

className="wolf-product"

>

<div

className="wolf-rank"

>

{

index===0

?"🥇"

:index===1

?"🥈"

:index===2

?"🥉"

:"🍔"

}

</div>

<div

className="wolf-product-info"

>

<div

className="wolf-product-header"

>

<div

className="wolf-product-name"

>

{product.name}

</div>

<div

className="wolf-product-qty"

>

{product.quantity}

vendidos

</div>

</div>

<div

className="wolf-track"

>

<div

className="wolf-fill"

style={{

width:`${

(product.quantity/

maxQuantity)

*100

}%`

}}

>

</div>

</div>

<div

className="wolf-revenue"

>

${product.revenue.toFixed(2)}

generados

</div>

</div>

</div>

)

)

}

{

products.length===0 && (

<div

style={{

padding:"30px 0",

textAlign:"center",

color:"#7f7f7f",

}}

>

No hay productos vendidos en este período.

</div>

)

}

</div>

</>

  );

}