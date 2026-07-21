"use client";

import type {
  ReservationStatus,
} from "@/types/reservations";

import {
  RESERVATION_STATUS_LABELS,
} from "@/constants/reservations/reservation-status";


interface ReservationTableFiltersProps {

  status?: ReservationStatus;

  date?: string;

  search?: string;


  onStatusChange?:(
    status?:ReservationStatus
  )=>void;


  onDateChange?:(
    date?:string
  )=>void;


  onSearchChange?:(
    search?:string
  )=>void;

}





export function ReservationTableFilters({

  status,

  date,

  search,

  onStatusChange,

  onDateChange,

  onSearchChange,

}:ReservationTableFiltersProps){



 return (

  <div
    className="
      flex
      flex-wrap
      gap-3
      border
      bg-white
      p-4
    "
  >



    <input

      type="text"

      value={
        search ?? ""
      }

      onChange={
        e =>
          onSearchChange?.(
            e.target.value
          )
      }

      placeholder="Buscar cliente..."

      className="
        rounded-md
        border
        px-3
        py-2
        text-sm
      "

    />





    <input

      type="date"

      value={
        date ?? ""
      }

      onChange={
        e =>
          onDateChange?.(
            e.target.value || undefined
          )
      }

      className="
        rounded-md
        border
        px-3
        py-2
        text-sm
      "

    />






    <select

      value={
        status ?? ""
      }

      onChange={

        e =>
          onStatusChange?.(
            e.target.value
              ?
              e.target.value as ReservationStatus
              :
              undefined
          )

      }

      className="
        rounded-md
        border
        px-3
        py-2
        text-sm
      "

    >


      <option value="">
        Todos los estados
      </option>



      {
        Object.entries(
          RESERVATION_STATUS_LABELS
        )
        .map(
          ([key,label])=>(

            <option

              key={key}

              value={key}

            >

              {label}

            </option>

          )
        )
      }


    </select>



  </div>

 );

}

