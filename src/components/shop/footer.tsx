import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-[#1C1C1E] text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-xl mb-4 text-[#0A84FF]">TechStore</h3>
            <p className="text-sm text-gray-400">
              Tu tienda de tecnología de confianza. Encuentra los mejores dispositivos y accesorios tecnológicos.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Productos</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/products" className="hover:text-[#0A84FF] transition-colors">Todos</Link></li>
              <li><Link href="/categories/smartphones" className="hover:text-[#0A84FF] transition-colors">Smartphones</Link></li>
              <li><Link href="/categories/laptops" className="hover:text-[#0A84FF] transition-colors">Laptops</Link></li>
              <li><Link href="/categories/audio" className="hover:text-[#0A84FF] transition-colors">Audio</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Cuenta</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/login" className="hover:text-[#0A84FF] transition-colors">Iniciar Sesión</Link></li>
              <li><Link href="/register" className="hover:text-[#0A84FF] transition-colors">Registrarse</Link></li>
              <li><Link href="/orders" className="hover:text-[#0A84FF] transition-colors">Mis Pedidos</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Contacto</h4>
            <p className="text-sm text-gray-400">
              info@techstore.com<br />
              +52 55 1234 5678
            </p>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} TechStore. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  )
}