// src/app/profile/[id]/collections/page.tsx
import { Collections } from "@/components/profile/Collections";

export default function CollectionsPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="animate-fade-in-up">
      <Collections userId={params.id} />
    </div>
  );
}