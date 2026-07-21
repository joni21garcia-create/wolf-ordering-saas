"use client";


// LANDING
import {
  ReservationLanding,
  ReservationHero,
  ReservationFeatures,
  ReservationCTA,
} from "@/components/reservations/landing";


// EMPTY
import {
  ReservationEmpty,
  ReservationEmptyState,
  ReservationEmptyAction,
} from "@/components/reservations/empty";


// BUTTONS
import {
  ReservationButton,
  ReservationBackButton,
  ReservationSubmitButton,
} from "@/components/reservations/common/buttons";


// INPUTS
import {
  ReservationInput,
  ReservationSelect,
  ReservationTextarea,
  ReservationPhoneInput,
  ReservationDateInput,
  ReservationTimeInput,
  ReservationGuestsInput,
} from "@/components/reservations/common/inputs";


// LAYOUTS
import {
  ReservationContainer,
  ReservationCard,
  ReservationHeader,
  ReservationPage,
  ReservationSection,
} from "@/components/reservations/common/layouts";


// SECTIONS
import {
  ReservationSection as ReservationSectionComponent,
  ReservationSectionActions,
  ReservationSectionHeader,
} from "@/components/reservations/common/sections";


// CARDS
import {
  ReservationCardActions,
  ReservationCardCapacity,
  ReservationCardDate,
  ReservationCardGuest,
  ReservationCardSummary,
  ReservationCardTable,
} from "@/components/reservations/cards";


// CALENDAR
import {
  ReservationCalendar,
  ReservationCalendarDay,
  ReservationCalendarEvent,
  ReservationCalendarGrid,
  ReservationCalendarHeader,
  ReservationCalendarMonth,
  ReservationCalendarWeek,
} from "@/components/reservations/calendar";


// FILTERS
import {
  ReservationFilters,
  ReservationDateFilter,
  ReservationSearch,
  ReservationStatusFilter,
} from "@/components/reservations/filters";


// FORMS
import {
  ReservationCustomerStep,
  ReservationDateStep,
  ReservationGuestsStep,
  ReservationNotesStep,
  ReservationServicesStep,
  ReservationSummaryStep,
  ReservationTimeStep,
  ReservationTypeStep,
} from "@/components/reservations/forms";


// STATUS
import {
  ReservationStatus,
  ReservationStatusLabel,
} from "@/components/reservations/status";


// TABLES
import {
  ReservationTable,
  ReservationTableActions,
  ReservationTableFilters,
  ReservationTableHeader,
  ReservationTableRow,
  ReservationTableStatus,
  ReservationTableToolbar,
} from "@/components/reservations/tables";


// DASHBOARD
import {
  ReservationDashboard,
  ReservationDashboardContent,
  ReservationDashboardHeader,
} from "@/components/reservations/dashboard";


// DIALOGS
import {
  CancelReservationDialog,
  CheckinReservationDialog,
  CompleteReservationDialog,
  ConfirmReservationDialog,
  NoShowReservationDialog,
  ReservationDetailsDialog,
  ReservationStatusDialog,
} from "@/components/reservations/dialogs";


// FLOATING BUTTON
import {
  ReservationFloatingAction,
  ReservationFloatingButton,
} from "@/components/reservations/floating-button";


// LOADING
import {
  ReservationLoading,
  ReservationLoadingOverlay,
  ReservationLoadingSpinner,
} from "@/components/reservations/loading";


// SKELETON
import {
  ReservationCardSkeleton,
  ReservationSkeleton,
  ReservationStatsSkeleton,
  ReservationTableSkeleton,
} from "@/components/reservations/skeleton";


// STATISTICS
import {
  ReservationMetric,
  ReservationStatCard,
  ReservationStatsGrid,
} from "@/components/reservations/statistics";


// TIMELINE
import {
  ReservationTimeline,
  ReservationTimelineConnector,
  ReservationTimelineItem,
} from "@/components/reservations/timeline";


// WIZARD
import {
  ReservationWizard,
  ReservationWizardFooter,
  ReservationWizardHeader,
  ReservationWizardNavigation,
  ReservationWizardProgress,
  ReservationWizardStep,
} from "@/components/reservations/wizard";

export default function TestReservationPage() {
  return (
    <main className="min-h-screen bg-background">

      {/* LANDING */}

      <ReservationLanding>

        <ReservationHero
          title="Reserva tu mesa"
          description="Disfruta una experiencia única reservando de forma rápida y sencilla."
          action={
            <ReservationButton>
              Reservar ahora
            </ReservationButton>
          }
        />


        <ReservationFeatures />


        <ReservationCTA
          action={
            <ReservationButton>
              Crear reserva
            </ReservationButton>
          }
        />

      </ReservationLanding>


      {/* CONTENIDO ADMINISTRATIVO */}

      <div className="mx-auto max-w-6xl space-y-10 px-6 py-12">


        <ReservationSection
          title="Nueva reserva"
          description="Completa los datos del cliente"
        >

          <ReservationCard>

            <div className="grid gap-5 md:grid-cols-2">


              <ReservationInput
                label="Nombre"
                placeholder="Nombre del cliente"
              />


              <ReservationInput
                label="Email"
                placeholder="correo@email.com"
              />


              <ReservationPhoneInput
                label="Teléfono"
              />


              <ReservationDateInput
                label="Fecha"
              />


              <ReservationTimeInput
                label="Hora"
              />


              <ReservationGuestsInput
                label="Personas"
              />


              <ReservationSelect
                label="Estado"
              >
                <option>
                  Pendiente
                </option>

                <option>
                  Confirmada
                </option>

                <option>
                  Cancelada
                </option>

              </ReservationSelect>


              <div className="md:col-span-2">

                <ReservationTextarea
                  label="Notas"
                  placeholder="Observaciones..."
                />

              </div>


            </div>


            <div className="mt-8 flex justify-end gap-3">

              <ReservationBackButton />

              <ReservationSubmitButton />

            </div>


          </ReservationCard>


        </ReservationSection>



        {/* EMPTY STATE */}


        <ReservationSection
          title="Sin reservas"
        >

          <ReservationEmpty>

            <ReservationEmptyState />

            <ReservationEmptyAction>

              <ReservationButton>
                Crear reserva
              </ReservationButton>

            </ReservationEmptyAction>

          </ReservationEmpty>


        </ReservationSection>




        {/* TIMELINE */}


        <ReservationSection
          title="Historial"
        >

          <ReservationTimeline>


            <ReservationTimelineItem
              title="Reserva creada"
              description="Cliente realizó la solicitud"
              time="10:30"
            />


            <ReservationTimelineItem
              title="Confirmada"
              description="Reserva aprobada"
              time="10:45"
            />


            <ReservationTimelineItem
              title="Finalizada"
              description="Servicio completado"
              time="14:00"
            />


          </ReservationTimeline>


        </ReservationSection>




        {/* SKELETON */}


        <ReservationSection
          title="Estado de carga"
        >

          <ReservationStatsSkeleton />


        </ReservationSection>



      </div>

    </main>
  );
}


