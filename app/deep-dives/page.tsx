import { getDeepDives } from '@/lib/deep-dives';
import { DeepDiveCard } from '@/components/DeepDiveCard';
import { PageLayout } from '@/components/PageLayout';

export default async function DeepDivesPage() {
  const deepDives = await getDeepDives();

  return (
    <PageLayout title="Deep Dives">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Deep Dives</h1>
          <p className="text-muted-foreground">
            Detailed explorations of the AI landscape, cutting through the hype to find tools that actually change the game.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {deepDives.map((dive) => (
            <DeepDiveCard key={dive.slug} {...dive} />
          ))}
        </div>
      </div>
    </PageLayout>
  );
}
