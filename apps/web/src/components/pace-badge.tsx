import { Badge } from '@/components/ui/badge';
import type { PaceStatus } from '@/lib/domain';
import { PACE_LABEL } from '@/lib/units';

const VARIANT = { done: 'default', on_track: 'secondary', behind: 'destructive' } as const;

export function PaceBadge({ status }: { status: PaceStatus }) {
  return <Badge variant={VARIANT[status]}>{PACE_LABEL[status]}</Badge>;
}
