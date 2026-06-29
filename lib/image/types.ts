/// <reference types="node" />

/**
 * Representa un icono generado tras procesar la imagen original
 */
export interface GeneratedIcon {
  name: string;        // Identificador humano (ej: "icon-192")
  filename: string;    // Nombre del archivo (ej: "icon-192.png")
  size: number;        // Dimensión en píxeles (ej: 192)
  buffer: Buffer;      // El contenido binario de la imagen lista para subir
}

/**
 * Resultado del proceso de generación de iconos
 */
export interface GenerateIconsResult {
  icons: GeneratedIcon[];
}