"use client";

import type { ReactNode } from "react";

interface Product {

  id: string;

  name: string;

  quantity: number;

  revenue: number;

}

interface Payment {

  method: string;

  total: number;

  orders: number;

}

interface Props {

  totalSales: number;

  totalOrders: number;

  averageTicket: number;

  restaurantRevenue: number;

  wolfCommission: number;

  bestProduct: Product | null;

  bestPayment: Payment | null;

}

interface Insight {

  icon: string;

  title: string;

  value: string;

  subtitle?: string;

  progress?: number;

  color: string;

}

export default function SalesInsights({

  totalSales,

  totalOrders,

  averageTicket,

  restaurantRevenue,

  wolfCommission,

  bestProduct,

  bestPayment,

}: Props) {

  const wolfPercent =

    totalSales === 0

      ? 0

      : (wolfCommission / totalSales) * 100;

  const restaurantPercent =

    totalSales === 0

      ? 0

      : (restaurantRevenue / totalSales) * 100;

  const insights: Insight[] = [

    {

      icon: "🔥",

      title: "Producto estrella",

      value:

        bestProduct?.name ??

        "Sin ventas",

      subtitle:

        bestProduct

          ? `${bestProduct.quantity} vendidos`

          : undefined,

      progress:

        bestProduct

          ? Math.min(

              bestProduct.quantity * 10,

              100

            )

          : 0,

      color:"#F97316",

    },

    {

      icon:"💰",

      title:"Ticket promedio",

      value:`$${averageTicket.toFixed(2)}`,

      subtitle:`${totalOrders} pedidos`,

      progress:

        totalOrders

          ? 100

          : 0,

      color:"#22C55E",

    },

    {

      icon:"💳",

      title:"Método favorito",

      value:

        bestPayment

          ? bestPayment.method.toUpperCase()

          : "Sin datos",

      subtitle:

        bestPayment

          ? `${bestPayment.orders} pagos`

          : undefined,

      progress:

        bestPayment

          ? 100

          : 0,

      color:"#3B82F6",

    },

    {

      icon:"🏪",

      title:"Ingresos restaurante",

      value:

        `${restaurantPercent.toFixed(0)}%`,

      subtitle:

        `$${restaurantRevenue.toFixed(2)}`,

      progress:

        restaurantPercent,

      color:"#10B981",

    },

    {

      icon:"🐺",

      title:"Comisión Wolf",

      value:

        `${wolfPercent.toFixed(0)}%`,

      subtitle:

        `$${wolfCommission.toFixed(2)}`,

      progress:

        wolfPercent,

      color:"#F59E0B",

    },

  ];

   return (

    <>
      <style>{`

.wolf-insights{

display:flex;

flex-direction:column;

gap:26px;

}

`}</style>

      <section className="wolf-insights">

        {insights.map((item) => (

          <InsightRow
            key={item.title}
            icon={item.icon}
            title={item.title}
            value={item.value}
            subtitle={item.subtitle}
            progress={item.progress ?? 0}
            color={item.color}
          />

        ))}

      </section>

    </>

  );

}

/* ==========================================================
ROW
========================================================== */

interface InsightRowProps {

  icon: string;

  title: string;

  value: string;

  subtitle?: string;

  progress: number;

  color: string;

}

function InsightRow({

  icon,

  title,

  value,

  subtitle,

  progress,

  color,

}: InsightRowProps) {

  return (

<div
style={{

display:"grid",

gridTemplateColumns:"56px 1fr",

gap:18,

alignItems:"center",

}}

>

<div
style={{

width:52,

height:52,

borderRadius:18,

display:"flex",

alignItems:"center",

justifyContent:"center",

fontSize:24,

background:`${color}18`,

}}

>

{icon}

</div>

<div>

<div
style={{

display:"flex",

justifyContent:"space-between",

alignItems:"center",

marginBottom:6,

gap:16,

}}

>

<div>

<div
style={{

fontSize:13,

color:"#8b8b8b",

marginBottom:4,

}}

>

{title}

</div>

<div
style={{

fontSize:19,

fontWeight:800,

color:"#fff",

}}

>

{value}

</div>

</div>

{subtitle && (

<div
style={{

fontSize:13,

color:"#8b8b8b",

whiteSpace:"nowrap",

}}

>

{subtitle}

</div>

)}

</div>

<InsightProgress

value={progress}

color={color}

/>

</div>

</div>

  );

}

/* ==========================================================
PROGRESS
========================================================== */

interface ProgressProps{

value:number;

color:string;

}

function InsightProgress({

value,

color,

}:ProgressProps){

return(

<div
style={{

marginTop:12,

height:6,

borderRadius:999,

overflow:"hidden",

background:"rgba(255,255,255,.06)",

}}

>

<div
style={{

width:`${Math.min(value,100)}%`,

height:"100%",

borderRadius:999,

background:color,

transition:"width .8s cubic-bezier(.22,1,.36,1)",

}}

 />

</div>

);

}