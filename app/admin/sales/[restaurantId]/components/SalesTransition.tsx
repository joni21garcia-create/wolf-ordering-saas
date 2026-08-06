"use client";

import type { ReactNode } from "react";

interface Props {

  children: ReactNode;

  transitionKey: string;

}

export default function SalesTransition({

  children,

  transitionKey,

}: Props) {

  return (

<>

<style>{`

@keyframes wolfSalesTransition{

0%{

opacity:0;

transform:

translateY(18px)

scale(.985);

}

100%{

opacity:1;

transform:

translateY(0)

scale(1);

}

}

.wolf-transition{

animation:

wolfSalesTransition

420ms

cubic-bezier(.19,1,.22,1);

will-change:

transform,

opacity;

}

`}</style>

<div

key={transitionKey}

className="wolf-transition"

>

{children}
</div>

</>

);

}