import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function VercelObservability() {
  if (process.env.VERCEL !== '1') return null;
  return <><Analytics /><SpeedInsights /></>;
}
