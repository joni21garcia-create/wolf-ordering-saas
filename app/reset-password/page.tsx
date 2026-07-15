"use client";

import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function ResetPasswordPage() {

  const router = useRouter();

  const [
    password,
    setPassword
  ] = useState("");

  const [
    confirmPassword,
    setConfirmPassword
  ] = useState("");

  const [
    loading,
    setLoading
  ] = useState(false);

  const [
    success,
    setSuccess
  ] = useState(false);

  const [
    checkingSession,
    setCheckingSession
  ] = useState(true);



  /*
   * Esperar a que Supabase cree
   * la sesión temporal del Recovery.
   *
   * Esto evita:
   * Auth session missing!
   */
  useEffect(() => {

    let mounted = true;

    const {
      data: {
        subscription
      },
    } =
      supabase.auth.onAuthStateChange(
        (event) => {

          console.log(
            "RESET EVENT:",
            event
          );

        }
      );



    async function initialize() {

      let session = null;

      for (let i = 0; i < 10; i++) {

        const result =
          await supabase.auth.getSession();

        session =
          result.data.session;

        console.log(
          `INTENTO ${i + 1}:`,
          session
        );

        if (session) {
          break;
        }

        await new Promise(
          (resolve) =>
            setTimeout(
              resolve,
              500
            )
        );

      }

      if (!mounted) {
        return;
      }

      if (!session) {

        router.replace("/login");

        return;

      }

      setCheckingSession(false);

    }



    initialize();



    return () => {

      mounted = false;

      subscription.unsubscribe();

    };

  }, [router]);
    async function updatePassword() {

    const {
      data: {
        session
      },
    } =
      await supabase.auth.getSession();

    if (!session) {

      alert(
        "La sesión de recuperación expiró."
      );

      router.replace("/login");

      return;

    }



    if (!password) {

      alert(
        "Ingrese una contraseña"
      );

      return;

    }



    if (
      password !== confirmPassword
    ) {

      alert(
        "Las contraseñas no coinciden"
      );

      return;

    }



    if (
      password.length < 8
    ) {

      alert(
        "La contraseña debe tener al menos 8 caracteres"
      );

      return;

    }



    try {

      setLoading(true);



      const {
        error
      } =
      await supabase.auth.updateUser({

        password,

      });



      if (error) {

        alert(
          error.message
        );

        return;

      }



      setSuccess(true);



      /*
       * Cerramos la sesión temporal
       * creada por el enlace de recuperación.
       */

      await supabase.auth.signOut();



      setTimeout(() => {

        router.replace("/login");

      }, 3500);



    } catch (error) {

      console.error(error);

      alert(
        "Error actualizando contraseña."
      );

    } finally {

      setLoading(false);

    }

  }
    if (
    checkingSession &&
    !success
  ) {

    return (

      <main
        style={{
          minHeight:"100vh",
          display:"flex",
          justifyContent:"center",
          alignItems:"center",
          background:"#0f0f0f",
          color:"#fff",
        }}
      >

        <p
          style={{
            color:"#888",
            fontSize:"18px",
          }}
        >
          Verificando enlace de recuperación...
        </p>

      </main>

    );

  }



  if (success) {

    return (

      <main
        style={{
          minHeight:"100vh",
          display:"flex",
          justifyContent:"center",
          alignItems:"center",
          padding:"30px",
        }}
      >

        <div
          style={{
            width:"100%",
            maxWidth:"620px",
            background:"rgba(15,15,15,.95)",
            border:"1px solid rgba(249,115,22,.20)",
            borderRadius:"32px",
            padding:"60px",
            textAlign:"center",
            backdropFilter:"blur(30px)",
            boxShadow:"0 30px 80px rgba(0,0,0,.45)",
          }}
        >

          <div
            style={{
              fontSize:"90px",
              marginBottom:"20px",
            }}
          >
            ✅
          </div>

          <h1
            style={{
              color:"#fff",
              fontSize:"46px",
              fontWeight:900,
              marginBottom:"15px",
            }}
          >
            Contraseña Actualizada
          </h1>

          <p
            style={{
              color:"#999",
              lineHeight:1.9,
              fontSize:"18px",
            }}
          >
            Tu contraseña fue actualizada
            correctamente.

            Serás redirigido al login
            automáticamente.
          </p>

        </div>

      </main>

    );

  }





  return (

    <main
      style={{
        minHeight:"100vh",
        display:"flex",
        justifyContent:"center",
        alignItems:"center",
        padding:"30px",
      }}
    >


      <div
        style={{
          width:"100%",
          maxWidth:"560px",
          background:"rgba(15,15,15,.92)",
          border:"1px solid rgba(255,255,255,.08)",
          borderRadius:"32px",
          padding:"45px",
          backdropFilter:"blur(30px)",
          boxShadow:"0 30px 80px rgba(0,0,0,.45)",
        }}
      >



        <div
          style={{
            textAlign:"center",
            marginBottom:"35px",
          }}
        >


          <div
            style={{
              display:"flex",
              justifyContent:"center",
              marginBottom:"15px",
            }}
          >

            <Image
              src="/wolf-log.png"
              alt="Wolf Ordering"
              width={280}
              height={280}
              priority
            />

          </div>



          <h1
            style={{
              color:"#fff",
              margin:0,
              fontSize:"42px",
              fontWeight:900,
            }}
          >
            Nueva Contraseña
          </h1>



          <p
            style={{
              color:"#888",
              marginTop:"12px",
              lineHeight:1.8,
            }}
          >
            Crea una nueva contraseña
            para acceder nuevamente a
            Wolf Ordering.
          </p>


        </div>





        <div
          style={{
            marginBottom:"20px",
          }}
        >

          <label
            style={{
              color:"#aaa",
            }}
          >
            Nueva contraseña
          </label>


          <input
            type="password"
            value={password}
            onChange={(e)=>
              setPassword(
                e.target.value
              )
            }
            placeholder="********"
            style={inputStyle}
          />


        </div>





        <div
          style={{
            marginBottom:"25px",
          }}
        >


          <label
            style={{
              color:"#aaa",
            }}
          >
            Confirmar contraseña
          </label>


          <input
            type="password"
            value={confirmPassword}
            onChange={(e)=>
              setConfirmPassword(
                e.target.value
              )
            }
            placeholder="********"
            style={inputStyle}
          />


        </div>





        <button
          onClick={updatePassword}
          disabled={loading}
          style={{
            width:"100%",
            border:"none",
            cursor:"pointer",
            padding:"16px",
            borderRadius:"16px",
            fontWeight:800,
            fontSize:"16px",
            color:"#fff",
            background:
              "linear-gradient(135deg,#ff7b00,#ff9900)",
          }}
        >

          {
            loading
              ? "Actualizando..."
              : "Actualizar Contraseña"
          }

        </button>
                <div
          style={{
            marginTop:"30px",
            textAlign:"center",
          }}
        >

          <button
            onClick={() =>
              router.replace("/login")
            }
            style={{
              background:"transparent",
              border:"none",
              color:"#f97316",
              cursor:"pointer",
            }}
          >

            Volver al Login

          </button>

        </div>

      </div>

    </main>

  );

}



const inputStyle = {

  width:"100%",

  marginTop:"10px",

  padding:"16px",

  background:
    "rgba(255,255,255,.03)",

  color:"#fff",

  border:
    "1px solid rgba(255,255,255,.08)",

  borderRadius:"14px",

  outline:"none",

};