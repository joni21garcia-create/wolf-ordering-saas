import {
  getOrCreateWolfCustomerId,
  supabase,
} from "@/lib/supabase/client";
import type {
  CreateCustomerAddressInput,
  CustomerAddress,
  UpdateCustomerAddressInput,
} from "@/modules/discover/types/customerAddress";

const TABLE_NAME = "customer_addresses";

/**
 * Obtiene el identificador anónimo estable del cliente Wolf.
 *
 * Este valor debe ser el mismo que utiliza Checkout.
 */
function getWolfCustomerId(): string {
  if (typeof window === "undefined") {
    throw new Error("Wolf customer ID solo está disponible en el cliente.");
  }

  const customerId = getOrCreateWolfCustomerId();

  if (!customerId) {
    throw new Error("No se pudo inicializar el cliente Wolf.");
  }

  return customerId;
}

/**
 * Construye los headers que utilizan las RLS policies
 * de customer_addresses.
 */
function getCustomerHeaders(customerId: string): Record<string, string> {
  return {
    "x-wolf-customer-id": customerId,
  };
}

/**
 * Obtiene todas las direcciones del cliente actual.
 */
export async function getCustomerAddresses(): Promise<CustomerAddress[]> {
  const customerId = getWolfCustomerId();

  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select("*")
    .eq("customer_id", customerId)
    .order("is_default", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(
      `No se pudieron cargar las direcciones: ${error.message}`,
    );
  }

  return (data ?? []) as CustomerAddress[];
}

/**
 * Obtiene una dirección concreta del cliente actual.
 */
export async function getCustomerAddress(
  addressId: string,
): Promise<CustomerAddress | null> {
  const customerId = getWolfCustomerId();

  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select("*")
    .eq("id", addressId)
    .eq("customer_id", customerId)
    .maybeSingle();

  if (error) {
    throw new Error(
      `No se pudo cargar la dirección: ${error.message}`,
    );
  }

  return data as CustomerAddress | null;
}

/**
 * Crea una nueva dirección.
 *
 * Si se marca como predeterminada, primero quitamos
 * la predeterminación de las demás direcciones del cliente.
 */
export async function createCustomerAddress(
  input: CreateCustomerAddressInput,
): Promise<CustomerAddress> {
  const customerId = getWolfCustomerId();

  if (input.is_default) {
    await clearDefaultCustomerAddress(customerId);
  }

  const payload = {
    customer_id: customerId,
    label: input.label,
    recipient_name: input.recipient_name ?? null,
    recipient_phone: input.recipient_phone ?? null,
    email: input.email?.trim() || null,
    address: input.address.trim(),
    zone: input.zone?.trim() || null,
    reference: input.reference?.trim() || null,
    instructions: input.instructions?.trim() || null,
    latitude: input.latitude ?? null,
    longitude: input.longitude ?? null,
    is_default: input.is_default ?? false,
  };


  const { data, error } = await supabase
    .from(TABLE_NAME)
    .insert(payload)
    .select("*")
    .single();

  if (error) {
    throw new Error(
      `No se pudo guardar la dirección: ${error.message}`,
    );
  }

  return data as CustomerAddress;
}

/**
 * Actualiza una dirección existente.
 */
export async function updateCustomerAddress(
  addressId: string,
  input: UpdateCustomerAddressInput,
): Promise<CustomerAddress> {
  const customerId = getWolfCustomerId();

  if (input.is_default === true) {
    await clearDefaultCustomerAddress(customerId, addressId);
  }

  const payload: Record<string, unknown> = {};

  if (input.label !== undefined) {
    payload.label = input.label;
  }

  if (input.recipient_name !== undefined) {
    payload.recipient_name = input.recipient_name?.trim() || null;
  }

  if (input.recipient_phone !== undefined) {
    payload.recipient_phone = input.recipient_phone?.trim() || null;
  }

  if (input.email !== undefined) {
    payload.email = input.email?.trim() || null;
  }

  if (input.address !== undefined) {
    payload.address = input.address.trim();
  }

  if (input.zone !== undefined) {
    payload.zone = input.zone?.trim() || null;
  }

  if (input.reference !== undefined) {
    payload.reference = input.reference?.trim() || null;
  }

  if (input.instructions !== undefined) {
    payload.instructions = input.instructions?.trim() || null;
  }

  if (input.latitude !== undefined) {
    payload.latitude = input.latitude;
  }

  if (input.longitude !== undefined) {
    payload.longitude = input.longitude;
  }

  if (input.is_default !== undefined) {
    payload.is_default = input.is_default;
  }

  const { data, error } = await supabase
    .from(TABLE_NAME)
    .update(payload)
    .eq("id", addressId)
    .eq("customer_id", customerId)
    .select("*")
    .single();

  if (error) {
    throw new Error(
      `No se pudo actualizar la dirección: ${error.message}`,
    );
  }

  return data as CustomerAddress;
}

/**
 * Elimina una dirección.
 */
export async function deleteCustomerAddress(
  addressId: string,
): Promise<void> {
  const customerId = getWolfCustomerId();

  const { error } = await supabase
    .from(TABLE_NAME)
    .delete()
    .eq("id", addressId)
    .eq("customer_id", customerId);

  if (error) {
    throw new Error(
      `No se pudo eliminar la dirección: ${error.message}`,
    );
  }
}

/**
 * Establece una dirección como predeterminada.
 */
export async function setDefaultCustomerAddress(
  addressId: string,
): Promise<CustomerAddress> {
  const customerId = getWolfCustomerId();

  await clearDefaultCustomerAddress(customerId, addressId);

  const { data, error } = await supabase
    .from(TABLE_NAME)
    .update({
      is_default: true,
    })
    .eq("id", addressId)
    .eq("customer_id", customerId)
    .select("*")
    .single();

  if (error) {
    throw new Error(
      `No se pudo establecer la dirección predeterminada: ${error.message}`,
    );
  }

  return data as CustomerAddress;
}

/**
 * Quita la dirección predeterminada actual del cliente.
 *
 * excludeAddressId se utiliza al actualizar una dirección
 * que ya existe.
 */
async function clearDefaultCustomerAddress(
  customerId: string,
  excludeAddressId?: string,
): Promise<void> {
  let query = supabase
    .from(TABLE_NAME)
    .update({
      is_default: false,
    })
    .eq("customer_id", customerId)
    .eq("is_default", true);

  if (excludeAddressId) {
    query = query.neq("id", excludeAddressId);
  }

  const { error } = await query;

  if (error) {
    throw new Error(
      `No se pudo actualizar la dirección predeterminada: ${error.message}`,
    );
  }
}

/**
 * Obtiene la dirección predeterminada del cliente.
 */
export async function getDefaultCustomerAddress(): Promise<CustomerAddress | null> {
  const customerId = getWolfCustomerId();

  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select("*")
    .eq("customer_id", customerId)
    .eq("is_default", true)
    .maybeSingle();

  if (error) {
    throw new Error(
      `No se pudo cargar la dirección predeterminada: ${error.message}`,
    );
  }

  return data as CustomerAddress | null;
}