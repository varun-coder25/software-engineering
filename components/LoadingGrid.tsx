export default function LoadingGrid({
  columns = 3
}: {
  columns?: 1 | 2 | 3;
}) {
  const columnClasses =
    columns === 1
      ? "grid-cols-1"
      : columns === 2
        ? "grid-cols-1 md:grid-cols-2"
        : "grid-cols-1 md:grid-cols-2 xl:grid-cols-3";

  return (
    <div className={`grid gap-4 ${columnClasses}`}>
      {Array.from({ length: columns }).map((_, index) => (
        <div
          className="h-32 animate-pulse rounded-3xl border border-slate-200 bg-slate-100/80 dark:border-slate-800 dark:bg-slate-900"
          key={index}
        />
      ))}
    </div>
  );
}
