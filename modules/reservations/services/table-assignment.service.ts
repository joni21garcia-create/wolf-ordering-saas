import { supabaseAdmin } from "@/lib/supabase/supabase";



export class TableAssignmentService {



  async assign(
    reservationId:string,
    tableId:string,
    guests:number
  ){



    /*
      Verificar que la reserva
      no tenga mesa asignada
    */

    const {
      data:existing,
      error:existingError
    }
    =
    await supabaseAdmin
      .from(
        "restaurant_table_assignments"
      )
      .select(
        "id"
      )
      .eq(
        "reservation_id",
        reservationId
      )
      .maybeSingle();



    if(existingError){

      throw existingError;

    }



    if(existing){

      throw new Error(
        "La reserva ya tiene una mesa asignada"
      );

    }






    /*
      Verificar que la mesa
      siga activa
    */


    const {
      data:table,
      error:tableError
    }
    =
    await supabaseAdmin
      .from(
        "restaurant_tables"
      )
      .select(
        `
        id,
        active,
        capacity
        `
      )
      .eq(
        "id",
        tableId
      )
      .single();



    if(tableError){

      throw tableError;

    }



    if(!table.active){

      throw new Error(
        "La mesa no está activa"
      );

    }



    if(
      table.capacity < guests
    ){

      throw new Error(
        "La mesa no tiene capacidad suficiente"
      );

    }






    /*
      Crear asignación
    */


    const {
      data,
      error
    }
    =
    await supabaseAdmin
      .from(
        "restaurant_table_assignments"
      )
      .insert({


        reservation_id:
          reservationId,


        table_id:
          tableId,


        assigned_guests:
          guests,


        is_primary:
          true


      })
      .select(`

        *,

        restaurant_tables(
          *
        )

      `)
      .single();




    if(error){

      throw error;

    }



    return data;


  }









  async removeByReservation(
    reservationId:string
  ){


    const {
      error
    }
    =
    await supabaseAdmin
      .from(
        "restaurant_table_assignments"
      )
      .delete()
      .eq(
        "reservation_id",
        reservationId
      );



    if(error){

      throw error;

    }



    return true;


  }









  async getByReservation(
    reservationId:string
  ){


    const {
      data,
      error
    }
    =
    await supabaseAdmin
      .from(
        "restaurant_table_assignments"
      )
      .select(`

        *,

        restaurant_tables(
          *
        )

      `)
      .eq(
        "reservation_id",
        reservationId
      );



    if(error){

      throw error;

    }



    return data ?? [];


  }



}



export const tableAssignmentService =
 new TableAssignmentService();

