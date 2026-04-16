export default function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-[#0B0F1A] flex items-center justify-center">
      <div className="w-10 h-10 border-2 border-[#C9A84C]/20 border-t-[#C9A84C] rounded-full animate-spin" />
    </div>
  )
}