export default function Header({ title, right }) {
  return (
    <header className="bg-[#0056D2] text-white flex items-center justify-between px-4 h-14 shrink-0">
      <h1 className="text-base font-semibold tracking-wide">{title}</h1>
      {right && <div className="flex items-center">{right}</div>}
    </header>
  )
}
