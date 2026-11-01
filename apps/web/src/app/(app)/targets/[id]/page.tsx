import { Suspense } from 'react';
import { TargetDetailView } from '@/features/targets/target-detail-view';

async function Detail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <TargetDetailView id={id} />;
}

export default function TargetDetailPage(props: { params: Promise<{ id: string }> }) {
  return (
    <Suspense>
      <Detail {...props} />
    </Suspense>
  );
}
