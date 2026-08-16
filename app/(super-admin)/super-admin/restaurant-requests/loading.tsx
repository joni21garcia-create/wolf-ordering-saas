export default function RestaurantRequestsLoading() {
  return (
    <main className="min-h-screen bg-[#080808] text-white">
      <div className="mx-auto w-full max-w-[1500px] px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <div className="h-3 w-24 animate-pulse rounded bg-white/[0.06]" />
            <div className="h-8 w-72 animate-pulse rounded-lg bg-white/[0.07]" />
            <div className="h-4 w-[min(600px,80vw)] animate-pulse rounded bg-white/[0.04]" />
          </div>

          <div className="h-11 w-28 animate-pulse rounded-xl bg-white/[0.05]" />
        </div>

        <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4"
            >
              <div className="h-3 w-20 animate-pulse rounded bg-white/[0.05]" />
              <div className="mt-4 h-7 w-10 animate-pulse rounded bg-white/[0.07]" />
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-3 sm:p-4">
          <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_200px_180px]">
            <div className="h-11 animate-pulse rounded-xl bg-white/[0.04]" />
            <div className="h-11 animate-pulse rounded-xl bg-white/[0.04]" />
            <div className="h-11 animate-pulse rounded-xl bg-white/[0.04]" />
          </div>
        </div>

        <div className="mt-5 overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.025]">
          <div className="hidden grid-cols-6 gap-4 border-b border-white/[0.06] px-5 py-3 lg:grid">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-2.5 animate-pulse rounded bg-white/[0.04]"
              />
            ))}
          </div>

          <div className="divide-y divide-white/[0.05]">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="grid min-h-20 items-center gap-4 px-5 py-4 lg:grid-cols-6"
              >
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 shrink-0 animate-pulse rounded-xl bg-white/[0.05]" />
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="h-3.5 w-32 animate-pulse rounded bg-white/[0.06]" />
                    <div className="h-2.5 w-44 animate-pulse rounded bg-white/[0.04]" />
                  </div>
                </div>

                <div className="hidden h-3 w-28 animate-pulse rounded bg-white/[0.04] lg:block" />
                <div className="hidden h-5 w-14 animate-pulse rounded bg-white/[0.04] lg:block" />
                <div className="hidden h-5 w-24 animate-pulse rounded-full bg-white/[0.04] lg:block" />
                <div className="hidden h-3 w-20 animate-pulse rounded bg-white/[0.04] lg:block" />
                <div className="hidden justify-self-end h-8 w-12 animate-pulse rounded-lg bg-white/[0.04] lg:block" />

                <div className="grid gap-2 lg:hidden">
                  <div className="h-3 w-28 animate-pulse rounded bg-white/[0.05]" />
                  <div className="h-3 w-44 animate-pulse rounded bg-white/[0.035]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}