import 'server-only';
import { supabase } from '@/lib/supabase';
import { PublicSettings } from '@/types';

const PUBLIC_SETTING_KEYS = [
  'logo_url',
  'map_url',
  'whatsapp_number',
  'phone',
  'address',
  'email',
  'instagram_url',
  'facebook_url',
  'hero_image_scale',
  'catalog_image_height',
] as const;

const DEFAULT_PUBLIC_SETTINGS: PublicSettings = {
  logoUrl: '/images/logo.png',
  mapUrl: '',
  whatsappNumber: '5491112345678',
  phone: '+54 9 11 1234-5678',
  address: 'Av. Ejemplo 1234, Buenos Aires, Argentina',
  email: 'info@multimarkmotos.com',
  instagramUrl: 'https://instagram.com',
  facebookUrl: 'https://facebook.com',
  heroImageScale: 1.05,
  catalogImageHeight: 192,
};

const parseNumberSetting = (value: string | null | undefined, fallback: number) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export async function getPublicSettings(): Promise<PublicSettings> {
  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('key, value')
      .in('key', [...PUBLIC_SETTING_KEYS]);

    if (error) throw error;

    const settings = { ...DEFAULT_PUBLIC_SETTINGS };
    for (const item of data || []) {
      switch (item.key) {
        case 'logo_url':
          settings.logoUrl = item.value || DEFAULT_PUBLIC_SETTINGS.logoUrl;
          break;
        case 'map_url':
          settings.mapUrl = item.value || DEFAULT_PUBLIC_SETTINGS.mapUrl;
          break;
        case 'whatsapp_number':
          settings.whatsappNumber = item.value || DEFAULT_PUBLIC_SETTINGS.whatsappNumber;
          break;
        case 'phone':
          settings.phone = item.value || DEFAULT_PUBLIC_SETTINGS.phone;
          break;
        case 'address':
          settings.address = item.value || DEFAULT_PUBLIC_SETTINGS.address;
          break;
        case 'email':
          settings.email = item.value || DEFAULT_PUBLIC_SETTINGS.email;
          break;
        case 'instagram_url':
          settings.instagramUrl = item.value || DEFAULT_PUBLIC_SETTINGS.instagramUrl;
          break;
        case 'facebook_url':
          settings.facebookUrl = item.value || DEFAULT_PUBLIC_SETTINGS.facebookUrl;
          break;
        case 'hero_image_scale':
          settings.heroImageScale = parseNumberSetting(
            item.value,
            DEFAULT_PUBLIC_SETTINGS.heroImageScale
          );
          break;
        case 'catalog_image_height':
          settings.catalogImageHeight = parseNumberSetting(
            item.value,
            DEFAULT_PUBLIC_SETTINGS.catalogImageHeight
          );
          break;
        default:
          break;
      }
    }

    return settings;
  } catch (error) {
    console.error('Error fetching site settings:', error);
    return DEFAULT_PUBLIC_SETTINGS;
  }
}

export async function getSiteLogo() {
  const settings = await getPublicSettings();
  return settings.logoUrl;
}
