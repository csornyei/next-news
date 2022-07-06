import { SkeletonCard } from "./SkeletonCard";

export default function SkeletonList() {
  return (
    <section className="animate-pulse">
      <h2 className="text-lg font-bold ml-6 mt-4 mb-4">
        <div className="h-8 w-4/12 rounded-md bg-gray-800" />
      </h2>
      <div className="flex flex-row flex-wrap">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </section>
  );
}
