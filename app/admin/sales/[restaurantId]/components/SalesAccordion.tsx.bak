"use client";

import {

  useState,

  type ReactNode,

} from "react";

import {

  ChevronDown,

} from "lucide-react";

import {

  wolfAccordion,

} from "@/lib/wolf-motion";

interface Props {

  title: string;

  subtitle?: string;

  children: ReactNode;

  defaultOpen?: boolean;

}

export default function SalesAccordion({

  title,

  subtitle,

  children,

  defaultOpen = false,

}: Props) {

  const [open, setOpen] =

    useState(defaultOpen);

  const motion =

    wolfAccordion(open);

  return (

<>
<style>{`

.wolf-accordion{

border-top:

1px solid rgba(255,255,255,.08);

padding:26px 0;

}

.wolf-accordion-button{

width:100%;

display:flex;

align-items:center;

justify-content:space-between;

background:none;

border:none;

padding:0;

cursor:pointer;

color:white;

}

.wolf-accordion-left{

display:flex;

flex-direction:column;

align-items:flex-start;

gap:6px;

}

.wolf-accordion-title{

font-size:20px;

font-weight:800;

letter-spacing:-.3px;

}

.wolf-accordion-subtitle{

font-size:14px;

color:#8b8b8b;

}

.wolf-chevron{

transition:

transform .35s ease;

}

.wolf-chevron.open{

transform:rotate(180deg);

}

.wolf-content{

display:grid;

grid-template-rows:0fr;

transition:

grid-template-rows .45s ease;

}

.wolf-content.open{

grid-template-rows:1fr;

}

.wolf-content-inner{

overflow:hidden;

}

`}</style>

<section

className="wolf-accordion"

>

<button

type="button"

className="wolf-accordion-button"

onClick={()=>

setOpen(

!open

)

}

>

<div

className="wolf-accordion-left"

>

<div

className="wolf-accordion-title"

>

{title}

</div>

{

subtitle && (

<div

className="wolf-accordion-subtitle"

>

{subtitle}

</div>

)

}

</div>

<ChevronDown
size={22}
style={motion.chevron}
/>

</button>

<div
style={motion.container}
>

<div

className="wolf-content-inner"

>

<div
style={motion.body}
>

{children}

</div>

</div>

</div>

</section>

</>

  );

}