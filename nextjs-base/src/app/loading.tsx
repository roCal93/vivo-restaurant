export default function Loading() {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        background:
          'radial-gradient(43.41% 65.16% at 65.56% 45.02%, #3CB152 0%, #194B23 79.62%)',
      }}
    >
      <div className="flex flex-col items-center gap-4 text-[#EBFFEE]">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-white/30 border-t-[#EBFFEE]"></div>
        <p className="text-sm opacity-90">Chargement...</p>
      </div>
    </div>
  )
}
