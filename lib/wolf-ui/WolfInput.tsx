"use client";

import {
  forwardRef,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";

export interface WolfInputProps
  extends InputHTMLAttributes<HTMLInputElement> {

  label?: string;

  hint?: string;

  error?: string;

  leftIcon?: ReactNode;

  rightIcon?: ReactNode;

}

const borderColor =

  "1px solid rgba(255,255,255,.08)";

const background =

  "#111111";

const WolfInput = forwardRef<
HTMLInputElement,
WolfInputProps
>(function WolfInput(

{

label,

hint,

error,

leftIcon,

rightIcon,

style,

disabled,

...props

},

ref

){

return(

<div
style={{

display:"flex",

flexDirection:"column",

gap:10,

width:"100%",

}}

>

{label && (

<label
style={{

fontSize:14,

fontWeight:700,

color:"#fff",

}}

>

{label}

</label>

)}

<div
style={{

display:"flex",

alignItems:"center",

gap:12,

height:52,

padding:"0 16px",

borderRadius:16,

background,

border:error

? "1px solid #EF4444"

: borderColor,

transition:"all .25s ease",

opacity:disabled

? .55

: 1,

}}

>

{leftIcon}

<input

ref={ref}

disabled={disabled}

style={{

flex:1,

border:"none",

outline:"none",

background:"transparent",

color:"#fff",

fontSize:15,

fontWeight:500,

}}

{...props}

/>

{rightIcon}

</div>

{error ? (

<div
style={{

fontSize:13,

color:"#EF4444",

}}

>

{error}

</div>

) : hint ? (

<div
style={{

fontSize:13,

color:"#777",

}}

>

{hint}

</div>

) : null}

</div>

);

});

export default WolfInput;