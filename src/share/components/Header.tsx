export default function Header() {
  return (
    <header className="flex items-center justify-between px-6 py-3">
      <div className="flex items-center gap-4">
        <div className="font-bold text-xl">Notsh</div> {/* Logo */}
      </div>
      
      <div className="hidden md:flex flex-1 max-w-xl mx-10">
        <input 
          type="text" 
          placeholder="Search notes..." 
          className="w-full rounded-full border border-neutral-200 bg-neutral-100 px-4 py-1.5 focus:outline-none"
        />
      </div>

      <div className="flex items-center gap-3">
        <div className="text-xs text-neutral-400">Sync Status</div>
        <div className="w-8 h-8 rounded-full bg-neutral-200"></div> {/* User Icon */}
      </div>
    </header>
  );
}
