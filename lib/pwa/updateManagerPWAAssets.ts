import { createClient } from "@supabase/supabase-js";

// 1. Inicializa el cliente AQUÍ, dentro de este archivo
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface UpdateManagerPWAAssetsParams {
  appLogo: string;
  icons: any[];
  tier: string;
}

export async function updateManagerPWAAssets({
  appLogo,
  icons,
}: UpdateManagerPWAAssetsParams) {
  
  // Función auxiliar para buscar la URL
  const getUrl = (filename: string) => {
    const icon = icons.find((i) => i.filename === filename);
    return (icon?.url && icon.url.startsWith('http')) ? icon.url : null;
  };

  const payload = {
    app_logo: (appLogo && appLogo.startsWith('http')) ? appLogo : null,
    icon_72_url: getUrl("icon-72.png"),
    icon_96_url: getUrl("icon-96.png"),
    icon_128_url: getUrl("icon-128.png"),
    icon_144_url: getUrl("icon-144.png"),
    icon_152_url: getUrl("icon-152.png"),
    icon_192_url: getUrl("icon-192.png"),
    icon_384_url: getUrl("icon-384.png"),
    icon_512_url: getUrl("icon-512.png"),
    maskable_icon_url: getUrl("maskable-icon.png"),
    updated_at: new Date().toISOString(),
  };

  // 2. Ahora 'supabase' ya está definido arriba y funcionará
  const { data: existing } = await supabase
    .from("manager_pwa_settings")
    .select("id")
    .limit(1)
    .maybeSingle();

  let result;
  
  if (existing) {
    const { data, error } = await supabase
      .from("manager_pwa_settings")
      .update(payload)
      .eq("id", existing.id)
      .select()
      .single();
    
    if (error) throw error;
    result = data;
  } else {
    const { data, error } = await supabase
      .from("manager_pwa_settings")
      .insert(payload)
      .select()
      .single();
      
    if (error) throw error;
    result = data;
  }

  return result;
}