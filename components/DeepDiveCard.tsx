import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

export function DeepDiveCard({ slug, title, date, excerpt }: any) {
  return (
    <Link href={`/deep-dives/${slug}`} className="group block p-6 rounded-2xl border border-border bg-card hover:border-primary/50 transition-all">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono text-muted-foreground">{date}</span>
          <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-3">{excerpt}</p>
      </div>
    </Link>
  );
}
