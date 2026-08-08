"use client";

import {
  CreditCard,
  Eye,
} from "lucide-react";

import {
  WolfButton,
} from "@/lib/wolf-ui";

import {
  WolfFlex,
  WolfStack,
} from "@/lib/wolf-ui/layout";

export interface WolfOrderAction {

  label: string;

  icon?: React.ReactNode;

  variant?:
    | "primary"
    | "secondary"
    | "ghost"
    | "danger"
    | "success";

  loading?: boolean;

  disabled?: boolean;

  onClick: () => void;

}

export interface WolfOrderActionsProps {

  primary?: WolfOrderAction | null;

  paymentPaid?: boolean;

  onMarkPaid?: () => void;

  onViewDetail?: () => void;

}

export default function WolfOrderActions({

  primary,

  paymentPaid = false,

  onMarkPaid,

  onViewDetail,

}: WolfOrderActionsProps) {

  return (

    <WolfStack
      spacing="sm"
    >

      {primary && (

        <WolfButton

          fullWidth

          size="lg"

          variant={
            primary.variant ??
            "primary"
          }

          leftIcon={
            primary.icon
          }

          disabled={
            primary.disabled
          }

          loading={
            primary.loading
          }

          onClick={
            primary.onClick
          }

        >

          {primary.label}

        </WolfButton>

      )}

      <WolfFlex gap="sm">

        <WolfButton

          fullWidth

          variant={
            paymentPaid
              ? "success"
              : "secondary"
          }

          leftIcon={
            <CreditCard
              size={15}
            />
          }

          onClick={
            onMarkPaid
          }

        >

          {paymentPaid

            ? "Pagado"

            : "Marcar pagado"}

        </WolfButton>

        <WolfButton

          fullWidth

          variant="ghost"

          leftIcon={
            <Eye size={15} />
          }

          onClick={
            onViewDetail
          }

        >

          Ver detalle

        </WolfButton>

      </WolfFlex>

    </WolfStack>

  );

}