import { getPublicSettings } from '@/lib/settings';
import { LoginClient } from './LoginClient';

export default async function LoginPage() {
  const settings = await getPublicSettings();
  return <LoginClient logoUrl={settings.logoUrl} />;
}
