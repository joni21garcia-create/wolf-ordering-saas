import { supabaseAdmin } from "@/lib/supabase/supabase";


export class AvailabilityRepository {



 async getTables(
  restaurantId:string
 ){

  const {
   data,
   error
  } =
  await supabaseAdmin
   .from("restaurant_tables")
   .select("*")
   .eq(
    "restaurant_id",
    restaurantId
   )
   .eq(
    "active",
    true
   )
   .order(
    "capacity",
    {
     ascending:true
    }
   );


  if(error)
   throw error;


  return data ?? [];

 }





 async checkAvailability(
  restaurantId:string,
  start:string,
  end:string,
  guests:number
 ){


  const tables =
   await this.getTables(
    restaurantId
   );



  const {
   data:assignments,
   error
  } =
  await supabaseAdmin
   .from(
    "restaurant_table_assignments"
   )
   .select(`
      table_id,
      restaurant_reservations(
        restaurant_id,
        start_at,
        end_at,
        status
      )
   `);



  if(error)
   throw error;



  const occupied =
   new Set<string>();



  for(
   const assignment of assignments ?? []
  ){


   const reservation =
    assignment.restaurant_reservations;



   if(!reservation)
    continue;



   if(
    reservation.restaurant_id === restaurantId
    &&
    reservation.status !== "cancelled"
    &&
    reservation.start_at < end
    &&
    reservation.end_at > start
   ){

    occupied.add(
     assignment.table_id
    );

   }


  }





  const available =
   tables.filter(
    table =>
     !occupied.has(table.id)
     &&
     table.capacity >= guests
   );


console.log(
 "CHECK AVAILABILITY DEBUG",
 {
  restaurantId,
  start,
  end,
  guests,

  tables:
   tables.map(
    t=>({
     id:t.id,
     capacity:t.capacity,
     active:t.active
    })
   ),

  occupied:
   Array.from(occupied),

  available:
   available.map(
    t=>t.id
   )
 }
);

  return {

   available:
    available.length > 0,


   tables:
    available

  };


 }



}



export const availabilityRepository =
 new AvailabilityRepository();

