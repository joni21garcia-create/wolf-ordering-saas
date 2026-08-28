export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      categories: {
        Row: {
          active: boolean | null
          color: string | null
          created_at: string | null
          description: string | null
          id: string
          name: string
          restaurant_id: string
          slug: string | null
          sort_order: number | null
        }
        Insert: {
          active?: boolean | null
          color?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          restaurant_id: string
          slug?: string | null
          sort_order?: number | null
        }
        Update: {
          active?: boolean | null
          color?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          restaurant_id?: string
          slug?: string | null
          sort_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "categories_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      legal_documents: {
        Row: {
          code: string
          content: string
          created_at: string | null
          id: string
          is_active: boolean | null
          published_at: string | null
          requires_signature: boolean | null
          summary: string | null
          title: string
          updated_at: string | null
          version: string
        }
        Insert: {
          code: string
          content: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          published_at?: string | null
          requires_signature?: boolean | null
          summary?: string | null
          title: string
          updated_at?: string | null
          version: string
        }
        Update: {
          code?: string
          content?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          published_at?: string | null
          requires_signature?: boolean | null
          summary?: string | null
          title?: string
          updated_at?: string | null
          version?: string
        }
        Relationships: []
      }
      legal_events: {
        Row: {
          acceptance_id: string
          created_at: string | null
          description: string | null
          event: string
          id: string
          metadata: Json | null
          performed_by: string | null
        }
        Insert: {
          acceptance_id: string
          created_at?: string | null
          description?: string | null
          event: string
          id?: string
          metadata?: Json | null
          performed_by?: string | null
        }
        Update: {
          acceptance_id?: string
          created_at?: string | null
          description?: string | null
          event?: string
          id?: string
          metadata?: Json | null
          performed_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "legal_events_acceptance_id_fkey"
            columns: ["acceptance_id"]
            isOneToOne: false
            referencedRelation: "restaurant_legal_acceptance"
            referencedColumns: ["id"]
          },
        ]
      }
      liquidations: {
        Row: {
          created_at: string | null
          id: string
          invoice_id: string | null
          month: number
          paid_at: string | null
          restaurant_id: string
          restaurant_total: number | null
          sales_total: number | null
          status: string | null
          total_orders: number | null
          wolf_total: number | null
          year: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          invoice_id?: string | null
          month: number
          paid_at?: string | null
          restaurant_id: string
          restaurant_total?: number | null
          sales_total?: number | null
          status?: string | null
          total_orders?: number | null
          wolf_total?: number | null
          year: number
        }
        Update: {
          created_at?: string | null
          id?: string
          invoice_id?: string | null
          month?: number
          paid_at?: string | null
          restaurant_id?: string
          restaurant_total?: number | null
          sales_total?: number | null
          status?: string | null
          total_orders?: number | null
          wolf_total?: number | null
          year?: number
        }
        Relationships: []
      }
      manager_pwa_settings: {
        Row: {
          app_logo: string | null
          app_name: string
          background_color: string | null
          created_at: string | null
          description: string | null
          display: string | null
          icon_128_url: string | null
          icon_144_url: string | null
          icon_152_url: string | null
          icon_192_url: string | null
          icon_384_url: string | null
          icon_512_url: string | null
          icon_72_url: string | null
          icon_96_url: string | null
          id: string
          maskable_icon_url: string | null
          orientation: string | null
          short_name: string
          theme_color: string | null
          updated_at: string | null
        }
        Insert: {
          app_logo?: string | null
          app_name?: string
          background_color?: string | null
          created_at?: string | null
          description?: string | null
          display?: string | null
          icon_128_url?: string | null
          icon_144_url?: string | null
          icon_152_url?: string | null
          icon_192_url?: string | null
          icon_384_url?: string | null
          icon_512_url?: string | null
          icon_72_url?: string | null
          icon_96_url?: string | null
          id?: string
          maskable_icon_url?: string | null
          orientation?: string | null
          short_name?: string
          theme_color?: string | null
          updated_at?: string | null
        }
        Update: {
          app_logo?: string | null
          app_name?: string
          background_color?: string | null
          created_at?: string | null
          description?: string | null
          display?: string | null
          icon_128_url?: string | null
          icon_144_url?: string | null
          icon_152_url?: string | null
          icon_192_url?: string | null
          icon_384_url?: string | null
          icon_512_url?: string | null
          icon_72_url?: string | null
          icon_96_url?: string | null
          id?: string
          maskable_icon_url?: string | null
          orientation?: string | null
          short_name?: string
          theme_color?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          quantity: number
          subtotal: number
          unit_price: number
        }
        Insert: {
          id?: string
          order_id: string
          product_id: string
          quantity?: number
          subtotal: number
          unit_price: number
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string
          quantity?: number
          subtotal?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          accepted_at: string | null
          cash_amount: number | null
          change_amount: number | null
          commission_amount: number | null
          completed_at: string | null
          created_at: string | null
          customer_email: string | null
          customer_name: string | null
          customer_phone: string | null
          delivery_address: string | null
          delivery_fee: number | null
          delivery_instructions: string | null
          delivery_sector: string | null
          estimated_minutes: number | null
          id: string
          notes: string | null
          order_type: string | null
          payment_confirmed: boolean | null
          payment_method: string | null
          payment_proof_url: string | null
          payment_status: string | null
          preparing_at: string | null
          push_subscription_id: number | null
          ready_at: string | null
          restaurant_amount: number | null
          restaurant_id: string
          selected_qr_id: string | null
          selected_qr_name: string | null
          status: string | null
          subtotal: number | null
          table_id: string | null
          terms_accepted: boolean | null
          terms_accepted_at: string | null
          total: number | null
          tracking_code: string | null
          wolf_amount: number | null
        }
        Insert: {
          accepted_at?: string | null
          cash_amount?: number | null
          change_amount?: number | null
          commission_amount?: number | null
          completed_at?: string | null
          created_at?: string | null
          customer_email?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          delivery_address?: string | null
          delivery_fee?: number | null
          delivery_instructions?: string | null
          delivery_sector?: string | null
          estimated_minutes?: number | null
          id?: string
          notes?: string | null
          order_type?: string | null
          payment_confirmed?: boolean | null
          payment_method?: string | null
          payment_proof_url?: string | null
          payment_status?: string | null
          preparing_at?: string | null
          push_subscription_id?: number | null
          ready_at?: string | null
          restaurant_amount?: number | null
          restaurant_id: string
          selected_qr_id?: string | null
          selected_qr_name?: string | null
          status?: string | null
          subtotal?: number | null
          table_id?: string | null
          terms_accepted?: boolean | null
          terms_accepted_at?: string | null
          total?: number | null
          tracking_code?: string | null
          wolf_amount?: number | null
        }
        Update: {
          accepted_at?: string | null
          cash_amount?: number | null
          change_amount?: number | null
          commission_amount?: number | null
          completed_at?: string | null
          created_at?: string | null
          customer_email?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          delivery_address?: string | null
          delivery_fee?: number | null
          delivery_instructions?: string | null
          delivery_sector?: string | null
          estimated_minutes?: number | null
          id?: string
          notes?: string | null
          order_type?: string | null
          payment_confirmed?: boolean | null
          payment_method?: string | null
          payment_proof_url?: string | null
          payment_status?: string | null
          preparing_at?: string | null
          push_subscription_id?: number | null
          ready_at?: string | null
          restaurant_amount?: number | null
          restaurant_id?: string
          selected_qr_id?: string | null
          selected_qr_name?: string | null
          status?: string | null
          subtotal?: number | null
          table_id?: string | null
          terms_accepted?: boolean | null
          terms_accepted_at?: string | null
          total?: number | null
          tracking_code?: string | null
          wolf_amount?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_table_id_fkey"
            columns: ["table_id"]
            isOneToOne: false
            referencedRelation: "tables"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          available: boolean | null
          category_id: string
          created_at: string | null
          description: string | null
          featured: boolean | null
          id: string
          image_url: string | null
          name: string
          price: number
          restaurant_id: string
          slug: string | null
        }
        Insert: {
          available?: boolean | null
          category_id: string
          created_at?: string | null
          description?: string | null
          featured?: boolean | null
          id?: string
          image_url?: string | null
          name: string
          price: number
          restaurant_id: string
          slug?: string | null
        }
        Update: {
          available?: boolean | null
          category_id?: string
          created_at?: string | null
          description?: string | null
          featured?: boolean | null
          id?: string
          image_url?: string | null
          name?: string
          price?: number
          restaurant_id?: string
          slug?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      push_subscriptions: {
        Row: {
          active: boolean | null
          created_at: string | null
          endpoint: string
          id: number
          restaurant_id: string
          subscription: Json
          updated_at: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          endpoint: string
          id?: never
          restaurant_id: string
          subscription: Json
          updated_at?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          endpoint?: string
          id?: never
          restaurant_id?: string
          subscription?: Json
          updated_at?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      restaurant_admin_pwa_settings: {
        Row: {
          app_logo: string | null
          app_name: string
          apple_icon_url: string | null
          background_color: string | null
          created_at: string | null
          description: string | null
          display: string | null
          favicon_url: string | null
          icon_128_url: string | null
          icon_144_url: string | null
          icon_152_url: string | null
          icon_192_url: string | null
          icon_384_url: string | null
          icon_512_url: string | null
          icon_72_url: string | null
          icon_96_url: string | null
          id: string
          maskable_icon_url: string | null
          orientation: string | null
          restaurant_id: string
          short_name: string
          theme_color: string | null
          updated_at: string | null
        }
        Insert: {
          app_logo?: string | null
          app_name?: string
          apple_icon_url?: string | null
          background_color?: string | null
          created_at?: string | null
          description?: string | null
          display?: string | null
          favicon_url?: string | null
          icon_128_url?: string | null
          icon_144_url?: string | null
          icon_152_url?: string | null
          icon_192_url?: string | null
          icon_384_url?: string | null
          icon_512_url?: string | null
          icon_72_url?: string | null
          icon_96_url?: string | null
          id?: string
          maskable_icon_url?: string | null
          orientation?: string | null
          restaurant_id: string
          short_name?: string
          theme_color?: string | null
          updated_at?: string | null
        }
        Update: {
          app_logo?: string | null
          app_name?: string
          apple_icon_url?: string | null
          background_color?: string | null
          created_at?: string | null
          description?: string | null
          display?: string | null
          favicon_url?: string | null
          icon_128_url?: string | null
          icon_144_url?: string | null
          icon_152_url?: string | null
          icon_192_url?: string | null
          icon_384_url?: string | null
          icon_512_url?: string | null
          icon_72_url?: string | null
          icon_96_url?: string | null
          id?: string
          maskable_icon_url?: string | null
          orientation?: string | null
          restaurant_id?: string
          short_name?: string
          theme_color?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "restaurant_admin_pwa_settings_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: true
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      restaurant_delivery_settings: {
        Row: {
          created_at: string | null
          delivery_enabled: boolean | null
          delivery_fee: number | null
          delivery_mode: string | null
          delivery_radius_km: number | null
          delivery_time: number | null
          free_delivery_enabled: boolean | null
          free_delivery_minimum: number | null
          id: string
          minimum_order: number | null
          pickup_enabled: boolean | null
          preparation_time: number | null
          restaurant_id: string
        }
        Insert: {
          created_at?: string | null
          delivery_enabled?: boolean | null
          delivery_fee?: number | null
          delivery_mode?: string | null
          delivery_radius_km?: number | null
          delivery_time?: number | null
          free_delivery_enabled?: boolean | null
          free_delivery_minimum?: number | null
          id?: string
          minimum_order?: number | null
          pickup_enabled?: boolean | null
          preparation_time?: number | null
          restaurant_id: string
        }
        Update: {
          created_at?: string | null
          delivery_enabled?: boolean | null
          delivery_fee?: number | null
          delivery_mode?: string | null
          delivery_radius_km?: number | null
          delivery_time?: number | null
          free_delivery_enabled?: boolean | null
          free_delivery_minimum?: number | null
          id?: string
          minimum_order?: number | null
          pickup_enabled?: boolean | null
          preparation_time?: number | null
          restaurant_id?: string
        }
        Relationships: []
      }
      restaurant_gallery: {
        Row: {
          active: boolean | null
          created_at: string | null
          id: string
          image_url: string
          restaurant_id: string
          sort_order: number | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          id?: string
          image_url: string
          restaurant_id: string
          sort_order?: number | null
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          id?: string
          image_url?: string
          restaurant_id?: string
          sort_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "restaurant_gallery_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      restaurant_hero_slides: {
        Row: {
          active: boolean | null
          button_text: string | null
          button_url: string | null
          created_at: string | null
          id: string
          image_url: string
          restaurant_id: string
          sort_order: number | null
          subtitle: string | null
          title: string | null
        }
        Insert: {
          active?: boolean | null
          button_text?: string | null
          button_url?: string | null
          created_at?: string | null
          id?: string
          image_url: string
          restaurant_id: string
          sort_order?: number | null
          subtitle?: string | null
          title?: string | null
        }
        Update: {
          active?: boolean | null
          button_text?: string | null
          button_url?: string | null
          created_at?: string | null
          id?: string
          image_url?: string
          restaurant_id?: string
          sort_order?: number | null
          subtitle?: string | null
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "restaurant_hero_slides_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      restaurant_legal_acceptance: {
        Row: {
          accepted_at: string | null
          accepted_content_snapshot: string | null
          accepted_version: string | null
          created_at: string | null
          id: string
          ip_address: string | null
          legal_document_id: string
          owner_email: string | null
          owner_name: string | null
          owner_phone: string | null
          owner_position: string | null
          pdf_url: string | null
          restaurant_id: string
          signature_hash: string | null
          signature_image_url: string | null
          signature_name: string | null
          status: string
          token: string
          updated_at: string | null
          user_agent: string | null
          viewed_at: string | null
        }
        Insert: {
          accepted_at?: string | null
          accepted_content_snapshot?: string | null
          accepted_version?: string | null
          created_at?: string | null
          id?: string
          ip_address?: string | null
          legal_document_id: string
          owner_email?: string | null
          owner_name?: string | null
          owner_phone?: string | null
          owner_position?: string | null
          pdf_url?: string | null
          restaurant_id: string
          signature_hash?: string | null
          signature_image_url?: string | null
          signature_name?: string | null
          status?: string
          token?: string
          updated_at?: string | null
          user_agent?: string | null
          viewed_at?: string | null
        }
        Update: {
          accepted_at?: string | null
          accepted_content_snapshot?: string | null
          accepted_version?: string | null
          created_at?: string | null
          id?: string
          ip_address?: string | null
          legal_document_id?: string
          owner_email?: string | null
          owner_name?: string | null
          owner_phone?: string | null
          owner_position?: string | null
          pdf_url?: string | null
          restaurant_id?: string
          signature_hash?: string | null
          signature_image_url?: string | null
          signature_name?: string | null
          status?: string
          token?: string
          updated_at?: string | null
          user_agent?: string | null
          viewed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "restaurant_legal_acceptance_legal_document_id_fkey"
            columns: ["legal_document_id"]
            isOneToOne: false
            referencedRelation: "legal_documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "restaurant_legal_acceptance_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      restaurant_notification_queue: {
        Row: {
          attempts: number
          channel: string
          content: string
          created_at: string
          id: string
          last_error: string | null
          max_attempts: number
          metadata: Json
          notification_type: string
          recipient: string
          reservation_id: string | null
          restaurant_id: string
          scheduled_for: string
          sent_at: string | null
          status: string
          subject: string | null
        }
        Insert: {
          attempts?: number
          channel: string
          content: string
          created_at?: string
          id?: string
          last_error?: string | null
          max_attempts?: number
          metadata?: Json
          notification_type: string
          recipient: string
          reservation_id?: string | null
          restaurant_id: string
          scheduled_for?: string
          sent_at?: string | null
          status?: string
          subject?: string | null
        }
        Update: {
          attempts?: number
          channel?: string
          content?: string
          created_at?: string
          id?: string
          last_error?: string | null
          max_attempts?: number
          metadata?: Json
          notification_type?: string
          recipient?: string
          reservation_id?: string | null
          restaurant_id?: string
          scheduled_for?: string
          sent_at?: string | null
          status?: string
          subject?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "restaurant_notification_queue_reservation_id_fkey"
            columns: ["reservation_id"]
            isOneToOne: false
            referencedRelation: "restaurant_reservations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "restaurant_notification_queue_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      restaurant_payment_qrs: {
        Row: {
          account_holder: string | null
          account_number: string | null
          active: boolean | null
          created_at: string | null
          id: string
          name: string
          qr_image_url: string
          restaurant_id: string
          sort_order: number | null
        }
        Insert: {
          account_holder?: string | null
          account_number?: string | null
          active?: boolean | null
          created_at?: string | null
          id?: string
          name: string
          qr_image_url: string
          restaurant_id: string
          sort_order?: number | null
        }
        Update: {
          account_holder?: string | null
          account_number?: string | null
          active?: boolean | null
          created_at?: string | null
          id?: string
          name?: string
          qr_image_url?: string
          restaurant_id?: string
          sort_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "restaurant_payment_qrs_restaurant_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      restaurant_pwa_settings: {
        Row: {
          app_logo: string | null
          app_name: string
          apple_icon_url: string | null
          background_color: string | null
          created_at: string | null
          description: string | null
          display: string | null
          favicon_url: string | null
          icon_128_url: string | null
          icon_144_url: string | null
          icon_152_url: string | null
          icon_192_url: string | null
          icon_384_url: string | null
          icon_512_url: string | null
          icon_72_url: string | null
          icon_96_url: string | null
          id: string
          maskable_icon_url: string | null
          orientation: string | null
          restaurant_id: string
          short_name: string
          theme_color: string | null
          updated_at: string | null
        }
        Insert: {
          app_logo?: string | null
          app_name: string
          apple_icon_url?: string | null
          background_color?: string | null
          created_at?: string | null
          description?: string | null
          display?: string | null
          favicon_url?: string | null
          icon_128_url?: string | null
          icon_144_url?: string | null
          icon_152_url?: string | null
          icon_192_url?: string | null
          icon_384_url?: string | null
          icon_512_url?: string | null
          icon_72_url?: string | null
          icon_96_url?: string | null
          id?: string
          maskable_icon_url?: string | null
          orientation?: string | null
          restaurant_id: string
          short_name: string
          theme_color?: string | null
          updated_at?: string | null
        }
        Update: {
          app_logo?: string | null
          app_name?: string
          apple_icon_url?: string | null
          background_color?: string | null
          created_at?: string | null
          description?: string | null
          display?: string | null
          favicon_url?: string | null
          icon_128_url?: string | null
          icon_144_url?: string | null
          icon_152_url?: string | null
          icon_192_url?: string | null
          icon_384_url?: string | null
          icon_512_url?: string | null
          icon_72_url?: string | null
          icon_96_url?: string | null
          id?: string
          maskable_icon_url?: string | null
          orientation?: string | null
          restaurant_id?: string
          short_name?: string
          theme_color?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "restaurant_pwa_settings_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: true
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      restaurant_reservation_blocks: {
        Row: {
          active: boolean
          affects_all_tables: boolean
          block_type: string
          color: string | null
          created_at: string
          description: string | null
          end_at: string
          id: string
          metadata: Json
          restaurant_id: string
          start_at: string
          table_id: string | null
          title: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          affects_all_tables?: boolean
          block_type?: string
          color?: string | null
          created_at?: string
          description?: string | null
          end_at: string
          id?: string
          metadata?: Json
          restaurant_id: string
          start_at: string
          table_id?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          affects_all_tables?: boolean
          block_type?: string
          color?: string | null
          created_at?: string
          description?: string | null
          end_at?: string
          id?: string
          metadata?: Json
          restaurant_id?: string
          start_at?: string
          table_id?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "restaurant_reservation_blocks_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "restaurant_reservation_blocks_table_id_fkey"
            columns: ["table_id"]
            isOneToOne: false
            referencedRelation: "restaurant_tables"
            referencedColumns: ["id"]
          },
        ]
      }
      restaurant_reservation_logs: {
        Row: {
          action: string
          actor_id: string | null
          actor_type: string
          created_at: string
          id: string
          message: string | null
          metadata: Json
          new_status: string | null
          previous_status: string | null
          reservation_id: string
          restaurant_id: string
        }
        Insert: {
          action: string
          actor_id?: string | null
          actor_type?: string
          created_at?: string
          id?: string
          message?: string | null
          metadata?: Json
          new_status?: string | null
          previous_status?: string | null
          reservation_id: string
          restaurant_id: string
        }
        Update: {
          action?: string
          actor_id?: string | null
          actor_type?: string
          created_at?: string
          id?: string
          message?: string | null
          metadata?: Json
          new_status?: string | null
          previous_status?: string | null
          reservation_id?: string
          restaurant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "restaurant_reservation_logs_reservation_id_fkey"
            columns: ["reservation_id"]
            isOneToOne: false
            referencedRelation: "restaurant_reservations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "restaurant_reservation_logs_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      restaurant_reservation_reminders: {
        Row: {
          channel: string
          created_at: string
          enabled: boolean
          id: string
          last_sent_at: string | null
          reminder_type: string
          reservation_id: string
          restaurant_id: string
          send_before_minutes: number
          updated_at: string
        }
        Insert: {
          channel: string
          created_at?: string
          enabled?: boolean
          id?: string
          last_sent_at?: string | null
          reminder_type: string
          reservation_id: string
          restaurant_id: string
          send_before_minutes: number
          updated_at?: string
        }
        Update: {
          channel?: string
          created_at?: string
          enabled?: boolean
          id?: string
          last_sent_at?: string | null
          reminder_type?: string
          reservation_id?: string
          restaurant_id?: string
          send_before_minutes?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "restaurant_reservation_reminders_reservation_id_fkey"
            columns: ["reservation_id"]
            isOneToOne: false
            referencedRelation: "restaurant_reservations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "restaurant_reservation_reminders_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      restaurant_reservation_settings: {
        Row: {
          allow_cancellations: boolean
          allow_same_day: boolean
          auto_confirm: boolean
          buffer_after_minutes: number
          buffer_before_minutes: number
          cancellation_limit_hours: number
          created_at: string
          id: string
          max_advance_days: number
          max_guests_per_reservation: number
          min_advance_hours: number
          min_guests_per_reservation: number
          require_email: boolean
          require_phone: boolean
          reservation_duration_minutes: number
          reservations_enabled: boolean
          restaurant_id: string
          slot_interval_minutes: number
          special_dates: Json
          timezone: string
          updated_at: string
          weekly_schedule: Json
        }
        Insert: {
          allow_cancellations?: boolean
          allow_same_day?: boolean
          auto_confirm?: boolean
          buffer_after_minutes?: number
          buffer_before_minutes?: number
          cancellation_limit_hours?: number
          created_at?: string
          id?: string
          max_advance_days?: number
          max_guests_per_reservation?: number
          min_advance_hours?: number
          min_guests_per_reservation?: number
          require_email?: boolean
          require_phone?: boolean
          reservation_duration_minutes?: number
          reservations_enabled?: boolean
          restaurant_id: string
          slot_interval_minutes?: number
          special_dates?: Json
          timezone?: string
          updated_at?: string
          weekly_schedule?: Json
        }
        Update: {
          allow_cancellations?: boolean
          allow_same_day?: boolean
          auto_confirm?: boolean
          buffer_after_minutes?: number
          buffer_before_minutes?: number
          cancellation_limit_hours?: number
          created_at?: string
          id?: string
          max_advance_days?: number
          max_guests_per_reservation?: number
          min_advance_hours?: number
          min_guests_per_reservation?: number
          require_email?: boolean
          require_phone?: boolean
          reservation_duration_minutes?: number
          reservations_enabled?: boolean
          restaurant_id?: string
          slot_interval_minutes?: number
          special_dates?: Json
          timezone?: string
          updated_at?: string
          weekly_schedule?: Json
        }
        Relationships: [
          {
            foreignKeyName: "restaurant_reservation_settings_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: true
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      restaurant_reservations: {
        Row: {
          cancelled_at: string | null
          checked_in_at: string | null
          completed_at: string | null
          confirmation_code: string
          confirmed_at: string | null
          created_at: string
          created_by: string | null
          customer_email: string | null
          customer_name: string
          customer_phone: string
          end_at: string
          end_time: string
          guests: number
          id: string
          internal_notes: string | null
          metadata: Json
          notes: string | null
          occasion: string | null
          reservation_date: string
          reservation_number: string
          restaurant_id: string
          source: string
          start_at: string
          start_time: string
          status: string
          timezone: string
          updated_at: string
        }
        Insert: {
          cancelled_at?: string | null
          checked_in_at?: string | null
          completed_at?: string | null
          confirmation_code: string
          confirmed_at?: string | null
          created_at?: string
          created_by?: string | null
          customer_email?: string | null
          customer_name: string
          customer_phone: string
          end_at: string
          end_time: string
          guests: number
          id?: string
          internal_notes?: string | null
          metadata?: Json
          notes?: string | null
          occasion?: string | null
          reservation_date: string
          reservation_number: string
          restaurant_id: string
          source?: string
          start_at: string
          start_time: string
          status?: string
          timezone?: string
          updated_at?: string
        }
        Update: {
          cancelled_at?: string | null
          checked_in_at?: string | null
          completed_at?: string | null
          confirmation_code?: string
          confirmed_at?: string | null
          created_at?: string
          created_by?: string | null
          customer_email?: string | null
          customer_name?: string
          customer_phone?: string
          end_at?: string
          end_time?: string
          guests?: number
          id?: string
          internal_notes?: string | null
          metadata?: Json
          notes?: string | null
          occasion?: string | null
          reservation_date?: string
          reservation_number?: string
          restaurant_id?: string
          source?: string
          start_at?: string
          start_time?: string
          status?: string
          timezone?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "restaurant_reservations_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      restaurant_roles: {
        Row: {
          code: string
          created_at: string | null
          id: string
          name: string
          restaurant_id: string
        }
        Insert: {
          code: string
          created_at?: string | null
          id?: string
          name: string
          restaurant_id: string
        }
        Update: {
          code?: string
          created_at?: string | null
          id?: string
          name?: string
          restaurant_id?: string
        }
        Relationships: []
      }
      restaurant_services: {
        Row: {
          active: boolean | null
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          restaurant_id: string
          sort_order: number | null
          title: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          restaurant_id: string
          sort_order?: number | null
          title: string
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          restaurant_id?: string
          sort_order?: number | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "restaurant_services_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      restaurant_settings: {
        Row: {
          about_enabled: boolean | null
          created_at: string | null
          delivery_enabled: boolean | null
          delivery_fee_enabled: boolean | null
          featured_menu_enabled: boolean | null
          floating_whatsapp_enabled: boolean | null
          gallery_enabled: boolean | null
          hero_enabled: boolean | null
          hours_enabled: boolean | null
          id: string
          map_enabled: boolean | null
          pickup_enabled: boolean | null
          restaurant_id: string
          reviews_enabled: boolean | null
          services_enabled: boolean | null
          theme_type: string | null
          whatsapp_enabled: boolean | null
        }
        Insert: {
          about_enabled?: boolean | null
          created_at?: string | null
          delivery_enabled?: boolean | null
          delivery_fee_enabled?: boolean | null
          featured_menu_enabled?: boolean | null
          floating_whatsapp_enabled?: boolean | null
          gallery_enabled?: boolean | null
          hero_enabled?: boolean | null
          hours_enabled?: boolean | null
          id?: string
          map_enabled?: boolean | null
          pickup_enabled?: boolean | null
          restaurant_id: string
          reviews_enabled?: boolean | null
          services_enabled?: boolean | null
          theme_type?: string | null
          whatsapp_enabled?: boolean | null
        }
        Update: {
          about_enabled?: boolean | null
          created_at?: string | null
          delivery_enabled?: boolean | null
          delivery_fee_enabled?: boolean | null
          featured_menu_enabled?: boolean | null
          floating_whatsapp_enabled?: boolean | null
          gallery_enabled?: boolean | null
          hero_enabled?: boolean | null
          hours_enabled?: boolean | null
          id?: string
          map_enabled?: boolean | null
          pickup_enabled?: boolean | null
          restaurant_id?: string
          reviews_enabled?: boolean | null
          services_enabled?: boolean | null
          theme_type?: string | null
          whatsapp_enabled?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "restaurant_settings_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      restaurant_table_assignments: {
        Row: {
          assigned_at: string
          assigned_by: string | null
          assigned_guests: number
          created_at: string
          id: string
          is_primary: boolean
          metadata: Json
          notes: string | null
          reservation_id: string
          table_id: string
          updated_at: string
        }
        Insert: {
          assigned_at?: string
          assigned_by?: string | null
          assigned_guests: number
          created_at?: string
          id?: string
          is_primary?: boolean
          metadata?: Json
          notes?: string | null
          reservation_id: string
          table_id: string
          updated_at?: string
        }
        Update: {
          assigned_at?: string
          assigned_by?: string | null
          assigned_guests?: number
          created_at?: string
          id?: string
          is_primary?: boolean
          metadata?: Json
          notes?: string | null
          reservation_id?: string
          table_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "restaurant_table_assignments_reservation_id_fkey"
            columns: ["reservation_id"]
            isOneToOne: false
            referencedRelation: "restaurant_reservations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "restaurant_table_assignments_table_id_fkey"
            columns: ["table_id"]
            isOneToOne: false
            referencedRelation: "restaurant_tables"
            referencedColumns: ["id"]
          },
        ]
      }
      restaurant_tables: {
        Row: {
          active: boolean
          area: string | null
          capacity: number
          code: string
          color: string | null
          created_at: string
          id: string
          joinable: boolean
          max_capacity: number | null
          metadata: Json
          min_capacity: number
          name: string
          notes: string | null
          position_x: number | null
          position_y: number | null
          restaurant_id: string
          shape: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          area?: string | null
          capacity: number
          code: string
          color?: string | null
          created_at?: string
          id?: string
          joinable?: boolean
          max_capacity?: number | null
          metadata?: Json
          min_capacity?: number
          name: string
          notes?: string | null
          position_x?: number | null
          position_y?: number | null
          restaurant_id: string
          shape?: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          area?: string | null
          capacity?: number
          code?: string
          color?: string | null
          created_at?: string
          id?: string
          joinable?: boolean
          max_capacity?: number | null
          metadata?: Json
          min_capacity?: number
          name?: string
          notes?: string | null
          position_x?: number | null
          position_y?: number | null
          restaurant_id?: string
          shape?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "restaurant_tables_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      design_theme_catalog: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          hero_style: string
          menu_style: string
          gallery_style: string
          config: any
          preview_image: string | null
          is_active: boolean
          is_system: boolean
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          hero_style?: string
          menu_style?: string
          gallery_style?: string
          config?: any
          preview_image?: string | null
          is_active?: boolean
          is_system?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          hero_style?: string
          menu_style?: string
          gallery_style?: string
          config?: any
          preview_image?: string | null
          is_active?: boolean
          is_system?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      restaurant_design_themes: {
        Row: {
          id: string
          restaurant_id: string
          theme_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          restaurant_id: string
          theme_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          restaurant_id?: string
          theme_id?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "restaurant_design_themes_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: true
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "restaurant_design_themes_theme_id_fkey"
            columns: ["theme_id"]
            isOneToOne: false
            referencedRelation: "design_theme_catalog"
            referencedColumns: ["id"]
          },
        ]
      }
      restaurant_theme_settings: {
        Row: {
          animation_style: string | null
          background_color: string | null
          button_style: string | null
          card_border: boolean | null
          card_style: string | null
          created_at: string | null
          font_family: string | null
          glow_effect: boolean | null
          hero_overlay: string | null
          id: string
          primary_color: string | null
          radius: string | null
          restaurant_id: string
          secondary_color: string | null
          shadow_intensity: string | null
          text_color: string | null
          theme_style: string | null
          updated_at: string | null
        }
        Insert: {
          animation_style?: string | null
          background_color?: string | null
          button_style?: string | null
          card_border?: boolean | null
          card_style?: string | null
          created_at?: string | null
          font_family?: string | null
          glow_effect?: boolean | null
          hero_overlay?: string | null
          id?: string
          primary_color?: string | null
          radius?: string | null
          restaurant_id: string
          secondary_color?: string | null
          shadow_intensity?: string | null
          text_color?: string | null
          theme_style?: string | null
          updated_at?: string | null
        }
        Update: {
          animation_style?: string | null
          background_color?: string | null
          button_style?: string | null
          card_border?: boolean | null
          card_style?: string | null
          created_at?: string | null
          font_family?: string | null
          glow_effect?: boolean | null
          hero_overlay?: string | null
          id?: string
          primary_color?: string | null
          radius?: string | null
          restaurant_id?: string
          secondary_color?: string | null
          shadow_intensity?: string | null
          text_color?: string | null
          theme_style?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      restaurant_users: {
        Row: {
          active: boolean | null
          auth_user_id: string | null
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          phone: string | null
          restaurant_id: string
          role_id: string | null
        }
        Insert: {
          active?: boolean | null
          auth_user_id?: string | null
          created_at?: string | null
          email: string
          full_name?: string | null
          id?: string
          phone?: string | null
          restaurant_id: string
          role_id?: string | null
        }
        Update: {
          active?: boolean | null
          auth_user_id?: string | null
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          restaurant_id?: string
          role_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_restaurant_users_role"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "restaurant_roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "restaurant_users_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      restaurant_waitlist: {
        Row: {
          accepted_at: string | null
          created_at: string
          customer_email: string | null
          customer_name: string
          customer_phone: string
          expires_at: string | null
          guests: number
          id: string
          metadata: Json
          notes: string | null
          notified_at: string | null
          priority: number
          requested_date: string
          requested_time: string
          reservation_id: string | null
          restaurant_id: string
          status: string
          updated_at: string
        }
        Insert: {
          accepted_at?: string | null
          created_at?: string
          customer_email?: string | null
          customer_name: string
          customer_phone: string
          expires_at?: string | null
          guests: number
          id?: string
          metadata?: Json
          notes?: string | null
          notified_at?: string | null
          priority?: number
          requested_date: string
          requested_time: string
          reservation_id?: string | null
          restaurant_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          accepted_at?: string | null
          created_at?: string
          customer_email?: string | null
          customer_name?: string
          customer_phone?: string
          expires_at?: string | null
          guests?: number
          id?: string
          metadata?: Json
          notes?: string | null
          notified_at?: string | null
          priority?: number
          requested_date?: string
          requested_time?: string
          reservation_id?: string | null
          restaurant_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "restaurant_waitlist_reservation_id_fkey"
            columns: ["reservation_id"]
            isOneToOne: false
            referencedRelation: "restaurant_reservations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "restaurant_waitlist_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      restaurants: {
        Row: {
          about_description: string | null
          about_stat1_label: string | null
          about_stat1_value: string | null
          about_stat2_label: string | null
          about_stat2_value: string | null
          about_stat3_label: string | null
          about_stat3_value: string | null
          about_title: string | null
          accepting_orders: boolean | null
          accepts_cash: boolean | null
          accepts_delivery_payment: boolean | null
          accepts_qr: boolean | null
          accepts_transfer: boolean | null
          account_holder: string | null
          account_number: string | null
          active: boolean | null
          address: string | null
          background_color: string | null
          bank_account: string | null
          bank_account_type: string | null
          bank_holder: string | null
          bank_name: string | null
          banner_url: string | null
          button_color: string | null
          cash_enabled: boolean | null
          city: string | null
          commission_active: boolean | null
          commission_mode: string | null
          commission_percentage: number | null
          commission_type: string | null
          contact_email: string | null
          country: string | null
          created_at: string | null
          cta_button_text: string | null
          cta_description: string | null
          cta_title: string | null
          custom_commission: number | null
          custom_commission_enabled: boolean | null
          delivery_enabled: boolean | null
          delivery_fee: number | null
          delivery_mode: string | null
          description: string | null
          estimated_max_time: number | null
          estimated_min_time: number | null
          expires_at: string | null
          facebook: string | null
          facebook_url: string | null
          favicon_url: string | null
          footer_text: string | null
          free_delivery_from: number | null
          google_maps_url: string | null
          hero_button_text: string | null
          hero_fallback_image: string | null
          hero_subtitle: string | null
          hero_title: string | null
          id: string
          instagram: string | null
          instagram_url: string | null
          latitude: number | null
          logo_url: string | null
          longitude: number | null
          manager_email: string | null
          manager_name: string | null
          manager_phone: string | null
          meta_description: string | null
          meta_title: string | null
          minimum_order: number | null
          name: string
          navbar_button_text: string | null
          og_image_url: string | null
          owner_email: string | null
          owner_name: string | null
          owner_phone: string | null
          pay_at_store_enabled: boolean | null
          pay_on_delivery_enabled: boolean | null
          payment_instructions: string | null
          payment_phone: string | null
          payment_qr_url: string | null
          pickup_enabled: boolean | null
          plan_name: string | null
          prep_time_max: number | null
          prep_time_min: number | null
          primary_color: string | null
          qr_enabled: boolean | null
          qr_image_url: string | null
          restaurant_pays_commission: boolean | null
          secondary_color: string | null
          service_delivery: boolean | null
          service_events: boolean | null
          service_menu: boolean | null
          service_ordering: boolean | null
          service_pickup: boolean | null
          service_reservations: boolean | null
          show_about: boolean | null
          show_about_stat1: boolean | null
          show_about_stat2: boolean | null
          show_about_stat3: boolean | null
          show_contact: boolean | null
          show_contact_email: boolean | null
          show_cta: boolean | null
          show_facebook: boolean | null
          show_footer_copyright: boolean | null
          show_footer_socials: boolean | null
          show_gallery: boolean | null
          show_instagram: boolean | null
          show_location: boolean | null
          show_menu: boolean | null
          show_services: boolean | null
          show_socials: boolean | null
          show_tiktok: boolean | null
          show_whatsapp: boolean | null
          show_wolf_branding: boolean | null
          show_youtube: boolean | null
          slogan: string | null
          slug: string
          state: string | null
          suspended: boolean | null
          terms_accepted: boolean | null
          terms_accepted_at: string | null
          text_color: string | null
          tiktok: string | null
          tiktok_url: string | null
          transfer_enabled: boolean | null
          website_url: string | null
          whatsapp: string | null
          whatsapp_number: string | null
          whatsapp_url: string | null
          youtube: string | null
          youtube_url: string | null
        }
        Insert: {
          about_description?: string | null
          about_stat1_label?: string | null
          about_stat1_value?: string | null
          about_stat2_label?: string | null
          about_stat2_value?: string | null
          about_stat3_label?: string | null
          about_stat3_value?: string | null
          about_title?: string | null
          accepting_orders?: boolean | null
          accepts_cash?: boolean | null
          accepts_delivery_payment?: boolean | null
          accepts_qr?: boolean | null
          accepts_transfer?: boolean | null
          account_holder?: string | null
          account_number?: string | null
          active?: boolean | null
          address?: string | null
          background_color?: string | null
          bank_account?: string | null
          bank_account_type?: string | null
          bank_holder?: string | null
          bank_name?: string | null
          banner_url?: string | null
          button_color?: string | null
          cash_enabled?: boolean | null
          city?: string | null
          commission_active?: boolean | null
          commission_mode?: string | null
          commission_percentage?: number | null
          commission_type?: string | null
          contact_email?: string | null
          country?: string | null
          created_at?: string | null
          cta_button_text?: string | null
          cta_description?: string | null
          cta_title?: string | null
          custom_commission?: number | null
          custom_commission_enabled?: boolean | null
          delivery_enabled?: boolean | null
          delivery_fee?: number | null
          delivery_mode?: string | null
          description?: string | null
          estimated_max_time?: number | null
          estimated_min_time?: number | null
          expires_at?: string | null
          facebook?: string | null
          facebook_url?: string | null
          favicon_url?: string | null
          footer_text?: string | null
          free_delivery_from?: number | null
          google_maps_url?: string | null
          hero_button_text?: string | null
          hero_fallback_image?: string | null
          hero_subtitle?: string | null
          hero_title?: string | null
          id?: string
          instagram?: string | null
          instagram_url?: string | null
          latitude?: number | null
          logo_url?: string | null
          longitude?: number | null
          manager_email?: string | null
          manager_name?: string | null
          manager_phone?: string | null
          meta_description?: string | null
          meta_title?: string | null
          minimum_order?: number | null
          name: string
          navbar_button_text?: string | null
          og_image_url?: string | null
          owner_email?: string | null
          owner_name?: string | null
          owner_phone?: string | null
          pay_at_store_enabled?: boolean | null
          pay_on_delivery_enabled?: boolean | null
          payment_instructions?: string | null
          payment_phone?: string | null
          payment_qr_url?: string | null
          pickup_enabled?: boolean | null
          plan_name?: string | null
          prep_time_max?: number | null
          prep_time_min?: number | null
          primary_color?: string | null
          qr_enabled?: boolean | null
          qr_image_url?: string | null
          restaurant_pays_commission?: boolean | null
          secondary_color?: string | null
          service_delivery?: boolean | null
          service_events?: boolean | null
          service_menu?: boolean | null
          service_ordering?: boolean | null
          service_pickup?: boolean | null
          service_reservations?: boolean | null
          show_about?: boolean | null
          show_about_stat1?: boolean | null
          show_about_stat2?: boolean | null
          show_about_stat3?: boolean | null
          show_contact?: boolean | null
          show_contact_email?: boolean | null
          show_cta?: boolean | null
          show_facebook?: boolean | null
          show_footer_copyright?: boolean | null
          show_footer_socials?: boolean | null
          show_gallery?: boolean | null
          show_instagram?: boolean | null
          show_location?: boolean | null
          show_menu?: boolean | null
          show_services?: boolean | null
          show_socials?: boolean | null
          show_tiktok?: boolean | null
          show_whatsapp?: boolean | null
          show_wolf_branding?: boolean | null
          show_youtube?: boolean | null
          slogan?: string | null
          slug: string
          state?: string | null
          suspended?: boolean | null
          terms_accepted?: boolean | null
          terms_accepted_at?: string | null
          text_color?: string | null
          tiktok?: string | null
          tiktok_url?: string | null
          transfer_enabled?: boolean | null
          website_url?: string | null
          whatsapp?: string | null
          whatsapp_number?: string | null
          whatsapp_url?: string | null
          youtube?: string | null
          youtube_url?: string | null
        }
        Update: {
          about_description?: string | null
          about_stat1_label?: string | null
          about_stat1_value?: string | null
          about_stat2_label?: string | null
          about_stat2_value?: string | null
          about_stat3_label?: string | null
          about_stat3_value?: string | null
          about_title?: string | null
          accepting_orders?: boolean | null
          accepts_cash?: boolean | null
          accepts_delivery_payment?: boolean | null
          accepts_qr?: boolean | null
          accepts_transfer?: boolean | null
          account_holder?: string | null
          account_number?: string | null
          active?: boolean | null
          address?: string | null
          background_color?: string | null
          bank_account?: string | null
          bank_account_type?: string | null
          bank_holder?: string | null
          bank_name?: string | null
          banner_url?: string | null
          button_color?: string | null
          cash_enabled?: boolean | null
          city?: string | null
          commission_active?: boolean | null
          commission_mode?: string | null
          commission_percentage?: number | null
          commission_type?: string | null
          contact_email?: string | null
          country?: string | null
          created_at?: string | null
          cta_button_text?: string | null
          cta_description?: string | null
          cta_title?: string | null
          custom_commission?: number | null
          custom_commission_enabled?: boolean | null
          delivery_enabled?: boolean | null
          delivery_fee?: number | null
          delivery_mode?: string | null
          description?: string | null
          estimated_max_time?: number | null
          estimated_min_time?: number | null
          expires_at?: string | null
          facebook?: string | null
          facebook_url?: string | null
          favicon_url?: string | null
          footer_text?: string | null
          free_delivery_from?: number | null
          google_maps_url?: string | null
          hero_button_text?: string | null
          hero_fallback_image?: string | null
          hero_subtitle?: string | null
          hero_title?: string | null
          id?: string
          instagram?: string | null
          instagram_url?: string | null
          latitude?: number | null
          logo_url?: string | null
          longitude?: number | null
          manager_email?: string | null
          manager_name?: string | null
          manager_phone?: string | null
          meta_description?: string | null
          meta_title?: string | null
          minimum_order?: number | null
          name?: string
          navbar_button_text?: string | null
          og_image_url?: string | null
          owner_email?: string | null
          owner_name?: string | null
          owner_phone?: string | null
          pay_at_store_enabled?: boolean | null
          pay_on_delivery_enabled?: boolean | null
          payment_instructions?: string | null
          payment_phone?: string | null
          payment_qr_url?: string | null
          pickup_enabled?: boolean | null
          plan_name?: string | null
          prep_time_max?: number | null
          prep_time_min?: number | null
          primary_color?: string | null
          qr_enabled?: boolean | null
          qr_image_url?: string | null
          restaurant_pays_commission?: boolean | null
          secondary_color?: string | null
          service_delivery?: boolean | null
          service_events?: boolean | null
          service_menu?: boolean | null
          service_ordering?: boolean | null
          service_pickup?: boolean | null
          service_reservations?: boolean | null
          show_about?: boolean | null
          show_about_stat1?: boolean | null
          show_about_stat2?: boolean | null
          show_about_stat3?: boolean | null
          show_contact?: boolean | null
          show_contact_email?: boolean | null
          show_cta?: boolean | null
          show_facebook?: boolean | null
          show_footer_copyright?: boolean | null
          show_footer_socials?: boolean | null
          show_gallery?: boolean | null
          show_instagram?: boolean | null
          show_location?: boolean | null
          show_menu?: boolean | null
          show_services?: boolean | null
          show_socials?: boolean | null
          show_tiktok?: boolean | null
          show_whatsapp?: boolean | null
          show_wolf_branding?: boolean | null
          show_youtube?: boolean | null
          slogan?: string | null
          slug?: string
          state?: string | null
          suspended?: boolean | null
          terms_accepted?: boolean | null
          terms_accepted_at?: string | null
          text_color?: string | null
          tiktok?: string | null
          tiktok_url?: string | null
          transfer_enabled?: boolean | null
          website_url?: string | null
          whatsapp?: string | null
          whatsapp_number?: string | null
          whatsapp_url?: string | null
          youtube?: string | null
          youtube_url?: string | null
        }
        Relationships: []
      }
      role_modules: {
        Row: {
          can_view: boolean | null
          created_at: string | null
          id: string
          module_code: string
          role_id: string
        }
        Insert: {
          can_view?: boolean | null
          created_at?: string | null
          id?: string
          module_code: string
          role_id: string
        }
        Update: {
          can_view?: boolean | null
          created_at?: string | null
          id?: string
          module_code?: string
          role_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "role_modules_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "restaurant_roles"
            referencedColumns: ["id"]
          },
        ]
      }
      schedule_settings: {
        Row: {
          created_at: string | null
          friday_close: string | null
          friday_open: string | null
          id: string
          monday_close: string | null
          monday_open: string | null
          restaurant_id: string
          saturday_close: string | null
          saturday_open: string | null
          sunday_close: string | null
          sunday_open: string | null
          thursday_close: string | null
          thursday_open: string | null
          tuesday_close: string | null
          tuesday_open: string | null
          wednesday_close: string | null
          wednesday_open: string | null
        }
        Insert: {
          created_at?: string | null
          friday_close?: string | null
          friday_open?: string | null
          id?: string
          monday_close?: string | null
          monday_open?: string | null
          restaurant_id: string
          saturday_close?: string | null
          saturday_open?: string | null
          sunday_close?: string | null
          sunday_open?: string | null
          thursday_close?: string | null
          thursday_open?: string | null
          tuesday_close?: string | null
          tuesday_open?: string | null
          wednesday_close?: string | null
          wednesday_open?: string | null
        }
        Update: {
          created_at?: string | null
          friday_close?: string | null
          friday_open?: string | null
          id?: string
          monday_close?: string | null
          monday_open?: string | null
          restaurant_id?: string
          saturday_close?: string | null
          saturday_open?: string | null
          sunday_close?: string | null
          sunday_open?: string | null
          thursday_close?: string | null
          thursday_open?: string | null
          tuesday_close?: string | null
          tuesday_open?: string | null
          wednesday_close?: string | null
          wednesday_open?: string | null
        }
        Relationships: []
      }
      system_modules: {
        Row: {
          code: string
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          code: string
          created_at?: string | null
          id?: string
          name: string
        }
        Update: {
          code?: string
          created_at?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      tables: {
        Row: {
          active: boolean | null
          created_at: string | null
          id: string
          number: string
          qr_code: string | null
          restaurant_id: string
          slug: string | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          id?: string
          number: string
          qr_code?: string | null
          restaurant_id: string
          slug?: string | null
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          id?: string
          number?: string
          qr_code?: string | null
          restaurant_id?: string
          slug?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tables_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      wolf_invoices: {
        Row: {
          created_at: string | null
          id: string
          invoice_number: string | null
          invoice_pdf_url: string | null
          liquidation_id: string | null
          restaurant_id: string | null
          status: string | null
          total: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          invoice_number?: string | null
          invoice_pdf_url?: string | null
          liquidation_id?: string | null
          restaurant_id?: string | null
          status?: string | null
          total?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          invoice_number?: string | null
          invoice_pdf_url?: string | null
          liquidation_id?: string | null
          restaurant_id?: string | null
          status?: string | null
          total?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "wolf_invoices_liquidation_id_fkey"
            columns: ["liquidation_id"]
            isOneToOne: false
            referencedRelation: "liquidations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const


