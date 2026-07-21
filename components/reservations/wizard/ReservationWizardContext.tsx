"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  ReactNode,
} from "react";



export interface ReservationWizardData {

  date?: string;

  time?: string;

  guests?: number;

  type?: string;


  customerName?: string;

  phone?: string;

  email?: string;


  service?: string;

  services?: string[];


  notes?: string;

  customerNotes?: string;

}



export interface ReservationWizardContextValue {

  currentStep:number;

  totalSteps:number;


  data:ReservationWizardData;


  next:()=>void;

  previous:()=>void;

  goTo:(step:number)=>void;


  update:(
    values:Partial<ReservationWizardData>
  )=>void;


  reset:()=>void;

}



const ReservationWizardContext =
 createContext<ReservationWizardContextValue | null>(
  null
 );



interface Props {

 children:ReactNode;

 totalSteps:number;

}





export function ReservationWizardProvider({

 children,

 totalSteps,

}:Props){



 const [
  currentStep,
  setCurrentStep
 ] =
 useState(0);




 const [
  data,
  setData
 ] =
 useState<ReservationWizardData>({});






 function next(){


  setCurrentStep(

   step =>
    Math.min(
     step + 1,
     totalSteps - 1
    )

  );


 }







 function previous(){


  setCurrentStep(

   step =>
    Math.max(
     step - 1,
     0
    )

  );


 }







 function goTo(
  step:number
 ){


  setCurrentStep(

   Math.min(

    Math.max(
     step,
     0
    ),

    totalSteps - 1

   )

  );


 }







 function update(

  values:Partial<ReservationWizardData>

 ){


  setData(

   previous => ({

    ...previous,

    ...values

   })

  );


 }







 function reset(){


  setCurrentStep(0);


  setData({});


 }







 const value = useMemo(

  () => ({

   currentStep,

   totalSteps,

   data,

   next,

   previous,

   goTo,

   update,

   reset,

  }),


  [
   currentStep,
   totalSteps,
   data
  ]

 );







 return (

  <ReservationWizardContext.Provider

   value={
    value
   }

  >

   {children}

  </ReservationWizardContext.Provider>

 );


}









export function useReservationWizard(){



 const context =

  useContext(
   ReservationWizardContext
  );





 if(!context){


  throw new Error(

   "useReservationWizard must be used inside ReservationWizardProvider"

  );


 }





 return context;


}

