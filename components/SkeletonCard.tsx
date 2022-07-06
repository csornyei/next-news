export function SkeletonCard() {
  return (
    <article className="card w-full sm:w-48 lg:w-60 bg-base-200 shadow-xl ml-4 mb-6 mr-4 sm:mr-0">
      <div className="card-body animate-pulse">
        <h3 className="card-title text-lg">
          <div className="h-8 w-11/12 rounded-md bg-gray-800" />
        </h3>
        <div>
          <div className="h-6 w-11/12 rounded-md bg-gray-800 mt-1" />
          <div className="h-6 w-11/12 rounded-md bg-gray-800 mt-1" />
          <div className="h-6 w-11/12 rounded-md bg-gray-800 mt-1" />
        </div>
        <div className="justify-end">
          <span className="badge badge-outline text-xs mr-2">
            <div className="h-3 w-10 rounded-md bg-gray-800" />
          </span>
        </div>
      </div>
    </article>
  );
}
