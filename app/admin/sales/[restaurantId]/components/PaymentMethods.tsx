"use client";

interface PaymentMethod {

  method: string;

  total: number;

  orders: number;

}

interface Props {

  methods: PaymentMethod[];

}

export default function PaymentMethods({

  methods,

}: Props) {

  const totalRevenue =

    methods.reduce(

      (sum,item)=>sum+item.total,

      0

    );

  return (

<>

<style>{`

.wolf-payments{

display:flex;

flex-direction:column;

gap:22px;

}

.wolf-payment{

display:flex;

flex-direction:column;

gap:10px;

}

.wolf-payment-header{

display:flex;

justify-content:space-between;

align-items:center;

gap:20px;

}

.wolf-payment-name{

display:flex;

align-items:center;

gap:10px;

font-size:16px;

font-weight:700;

color:white;

}

.wolf-payment-orders{

font-size:13px;

color:#8b8b8b;

}

.wolf-payment-track{

height:10px;

background:

rgba(255,255,255,.05);

border-radius:999px;

overflow:hidden;

}

.wolf-payment-fill{

height:100%;

border-radius:999px;

background:

linear-gradient(

90deg,

#22c55e,

#16a34a

);

transform-origin:left;

animation:

wolfPaymentGrow .8s ease forwards;

}

.wolf-payment-footer{

display:flex;

justify-content:space-between;

margin-top:4px;

font-size:13px;

color:#8b8b8b;

}

@keyframes wolfPaymentGrow{

from{

transform:scaleX(0);

}

to{

transform:scaleX(1);

}

}

`}</style>

<div

className="wolf-payments"

>

{

methods.map(method=>{

const percent=

totalRevenue===0

?0

:(method.total/

totalRevenue)*100;

const icon=

method.method==="cash"

?"💵"

:method.method==="qr"

?"📱"

:method.method==="card"

?"💳"

:"💰";

return(

<div

key={method.method}

className="wolf-payment"

>

<div

className="wolf-payment-header"

>

<div

className="wolf-payment-name"

>

<span>

{icon}

</span>

<span>

{method.method.toUpperCase()}

</span>

</div>

<div

className="wolf-payment-orders"

>

{method.orders}

pedidos

</div>

</div>

<div

className="wolf-payment-track"

>

<div

className="wolf-payment-fill"

style={{

width:`${percent}%`

}}

>

</div>

</div>

<div

className="wolf-payment-footer"

>

<div>

${method.total.toFixed(2)}

</div>

<div>

{percent.toFixed(0)}%

</div>

</div>

</div>

);

})

}

{

methods.length===0&&(

<div

style={{

padding:"30px 0",

textAlign:"center",

color:"#7f7f7f",

}}

>

No hay pagos registrados.

</div>

)

}

</div>

</>

  );

}