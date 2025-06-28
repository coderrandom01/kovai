export default function ListingSkeleton() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-pulse space-y-6">
      <div className="bg-gray-200 h-[300px] sm:h-[450px] rounded-lg w-full" />
      
      <div className="space-y-4">
        <div className="h-6 bg-gray-200 rounded w-2/3" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />

        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-1/3" />
          <div className="h-4 bg-gray-200 rounded w-1/3" />
          <div className="h-6 bg-gray-300 rounded w-1/4" />
        </div>

        <div className="h-4 bg-gray-200 rounded w-1/2" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />

        <div className="h-10 bg-gray-300 rounded w-32" />
      </div>
    </div>
  );
}
















































































