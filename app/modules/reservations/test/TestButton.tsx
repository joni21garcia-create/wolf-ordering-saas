"use client";

import { useState } from "react";
import { createReservation } from "@/modules/reservations/actions";

export default function TestButton(){

  const [result,setResult]=useState<any>(null);

  async function testReservation(){

    const response = await createReservation({
      restaurantId:
  "aa5dc78e-bcad-4636-baf5-5093a42933b5",

      slug:"demo",

      guest:{
        firstName:"Juan",
        lastName:"Perez",
        fullName:"Juan Perez",
        phone:"0999999999",
        email:"juan@test.com"
      },

      datetime:{
        date:"2026-07-20",
        startTime:"20:00",
        endTime:"22:00",
        timezone:"America/Guayaquil",
        durationMinutes:120
      },

      capacity:{
        guests:4,
        adults:4,
        children:0,
        babies:0,
        occupiesCapacity:4
      },

      customerNotes:"Reserva creada desde test"
    });

    setResult(response);
  }


  return (
    <>
      <button
        onClick={testReservation}
        style={{
          padding:15,
          marginTop:20
        }}
      >
        Crear Reserva
      </button>

      <pre>
        {JSON.stringify(result,null,2)}
      </pre>
    </>
  );
}

