import { redirect } from "next/navigation";
import { getAvailableMonths } from "../../lib/posts";

export default async function ArchivePage() {
  const months = await getAvailableMonths();
  
  if (months.length === 0) {
    // Fallback: render the old flat list if no months found
    const { default: OldArchive } = await import("./old-archive");
    return <OldArchive />;
  }

  redirect(`/archive/month/${months[0].month}`);
}
