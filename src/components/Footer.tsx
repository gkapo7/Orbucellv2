function Footer() {
  return (
    <footer className="border-t border-neutral-200/60 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 grid gap-8 sm:grid-cols-3">
        <div>
          <div className="flex items-center gap-2">
            <img src="/logo.svg" alt="Orbucell" className="h-7 w-7" />
            <span className="font-semibold">Orbucell</span>
          </div>
          <p className="mt-3 text-sm text-neutral-600">Science‑backed daily nutrition. Transparent sourcing. Third‑party tested.</p>
        </div>
        <div>
          <p className="font-medium">Company</p>
          <ul className="mt-3 space-y-2 text-sm text-neutral-600">
            <li><a href="#about" className="hover:text-black">About</a></li>
            <li><a href="#benefits" className="hover:text-black">Benefits</a></li>
            <li><a href="#" className="hover:text-black">Contact</a></li>
          </ul>
        </div>
        <div>
          <p className="font-medium">Legal</p>
          <ul className="mt-3 space-y-2 text-sm text-neutral-600">
            <li><a href="#" className="hover:text-black">Privacy</a></li>
            <li><a href="#" className="hover:text-black">Terms</a></li>
          </ul>
        </div>
      </div>
      <div className="py-4 text-center text-xs text-neutral-500">© {new Date().getFullYear()} Orbucell • 90‑day money back guarantee</div>
    </footer>
  )
}

export default Footer


