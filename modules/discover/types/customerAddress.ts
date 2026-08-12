export type CustomerAddressLabel =
  | "Casa"
  | "Trabajo"
  | "Oficina"
  | "Otra";

export interface CustomerAddress {
  id: string;
  customer_id: string;

  /**
   * Nombre visible para el cliente:
   * Casa, Trabajo, Oficina, Otra, etc.
   */
  label: CustomerAddressLabel;

  /**
   * Datos opcionales del destinatario.
   * Si no se especifican, Checkout podrá usar los datos
   * principales del cliente.
   */
  recipient_name: string | null;
  recipient_phone: string | null;
  email: string | null;

  /**
   * Dirección principal de entrega.
   */
  address: string;

  /**
   * Sector o zona de la ciudad.
   */
  zone: string | null;

  /**
   * Referencia para facilitar la entrega.
   */
  reference: string | null;

  /**
   * Instrucciones adicionales para el repartidor.
   */
  instructions: string | null;

  /**
   * Coordenadas opcionales.
   * Las dejamos preparadas para futuras funciones
   * de ubicación/mapa.
   */
  latitude: number | null;
  longitude: number | null;

  /**
   * Dirección utilizada por defecto en Delivery.
   */
  is_default: boolean;

  created_at: string;
  updated_at: string;
}

/**
 * Datos necesarios para crear una dirección.
 *
 * El id, customer_id y timestamps los genera el sistema.
 */
export interface CreateCustomerAddressInput {
  label: CustomerAddressLabel;
  recipient_name?: string | null;
  recipient_phone?: string | null;
  email?: string | null;
  address: string;
  zone?: string | null;
  reference?: string | null;
  instructions?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  is_default?: boolean;
}

/**
 * Datos permitidos para editar una dirección existente.
 */
export interface UpdateCustomerAddressInput {
  label?: CustomerAddressLabel;
  recipient_name?: string | null;
  recipient_phone?: string | null;
  email?: string | null;
  address?: string;
  zone?: string | null;
  reference?: string | null;
  instructions?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  is_default?: boolean;
}