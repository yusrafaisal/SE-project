export default function SkeletonCard() {
  return (
    <div className="bg-white border border-cream-200 rounded-2xl overflow-hidden animate-pulse">
      <div className="h-48 bg-cream-100" />
      <div className="p-5 space-y-3">
        <div className="flex justify-between">
          <div className="h-5 bg-cream-100 rounded-lg w-2/3" />
          <div className="h-5 bg-cream-100 rounded-lg w-1/4" />
        </div>
        <div className="h-4 bg-cream-100 rounded-lg w-full" />
        <div className="h-4 bg-cream-100 rounded-lg w-4/5" />
        <div className="h-px bg-cream-100 my-3" />
        <div className="flex gap-2">
          <div className="h-8 bg-cream-100 rounded-lg w-16" />
          <div className="h-8 bg-cream-100 rounded-lg w-16 ml-auto" />
        </div>
      </div>
    </div>
  )
}
