import { supabaseAdmin }
from "@/lib/supabase/supabase";



export class NotificationService {



  /*
    Agregar una notificaciÃ³n
    a la cola
  */

  async queue(
    reservationId:string,
    type:string,
    payload:any
  ){

    const {
      data,
      error
    }
    =
    await supabaseAdmin
      .from(
        "restaurant_notification_queue"
      )
      .insert({

        reservation_id:
          reservationId,

        restaurant_id:
          payload.restaurantId,

        notification_type:
          type,

        channel:
          payload.channel ?? "email",

        recipient:
          payload.recipient,

        subject:
          payload.subject ?? null,

        content:
          payload.content ?? "",

        metadata:
          payload,

        status:
          "pending"

      })
      .select()
      .single();



    if(error){

      throw error;

    }



    return data;


  }






  /*
    ConfirmaciÃ³n de reserva
  */

  async reservationCreated(
    reservationId:string,
    payload:any
  ){

    return this.queue(

      reservationId,

      "reservation_created",

      payload

    );

  }






  /*
    Reserva confirmada
  */

  async reservationConfirmed(
    reservationId:string,
    payload:any
  ){

    return this.queue(

      reservationId,

      "reservation_confirmed",

      payload

    );

  }






  /*
    Reserva cancelada
  */

  async reservationCancelled(
    reservationId:string,
    payload:any
  ){

    return this.queue(

      reservationId,

      "reservation_cancelled",

      payload

    );

  }






  /*
    Recordatorio
  */

  async reservationReminder(
    reservationId:string,
    payload:any
  ){

    return this.queue(

      reservationId,

      "reservation_reminder",

      payload

    );

  }






  /*
    No Show
  */

  async reservationNoShow(
    reservationId:string,
    payload:any
  ){

    return this.queue(

      reservationId,

      "reservation_no_show",

      payload

    );

  }






  /*
    Pago recibido
  */

  async paymentReceived(
    reservationId:string,
    payload:any
  ){

    return this.queue(

      reservationId,

      "payment_received",

      payload

    );

  }






  /*
    Obtener pendientes
  */

  async pending(){

    const {

      data,

      error

    }
    =
    await supabaseAdmin
      .from(
        "restaurant_notification_queue"
      )
      .select("*")
      .eq(
        "status",
        "pending"
      )
      .order(
        "created_at"
      );



    if(error){

      throw error;

    }



    return data ?? [];


  }






  /*
    Marcar enviada
  */

  async markSent(
    id:string
  ){

    const {

      data,

      error

    }
    =
    await supabaseAdmin
      .from(
        "restaurant_notification_queue"
      )
      .update({

        status:"sent",

        sent_at:
          new Date().toISOString()

      })
      .eq(
        "id",
        id
      )
      .select()
      .single();



    if(error){

      throw error;

    }



    return data;


  }






  /*
    Marcar error
  */

  async markFailed(
    id:string,
    message:string
  ){

    const {

      data,

      error

    }
    =
    await supabaseAdmin
      .from(
        "restaurant_notification_queue"
      )
      .update({

        status:"failed",

        last_error:
          message

      })
      .eq(
        "id",
        id
      )
      .select()
      .single();



    if(error){

      throw error;

    }



    return data;


  }



}



export const notificationService =
  new NotificationService();







