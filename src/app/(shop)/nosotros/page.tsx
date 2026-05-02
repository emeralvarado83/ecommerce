export const metadata = {
  title: 'Nosotros - TechStore',
  description: 'Conoce más sobre TechStore, tu tienda de tecnología de confianza.'
}

export default function NosotrosPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-[#111111] mb-6">Nosotros</h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 text-lg mb-6">
            En <strong>TechStore</strong>, nos dedicamos a ofrecer los mejores productos de tecnología 
            con un compromiso inquebrantable hacia la calidad y el servicio al cliente.
          </p>

          <h2 className="text-2xl font-semibold text-[#111111] mt-8 mb-4">Nuestra Misión</h2>
          <p className="text-gray-600 mb-4">
            Brindar acceso a la tecnología más innovadora, ofreciendo una experiencia de compra 
            excepcional y soporte técnico de primer nivel.
          </p>

          <h2 className="text-2xl font-semibold text-[#111111] mt-8 mb-4">Nuestros Valores</h2>
          <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
            <li>Confianza y transparencia en cada transacción</li>
            <li>Compromiso con la satisfacción del cliente</li>
            <li>Innovación constante en nuestros productos</li>
            <li>Servicio técnico especializado y profesional</li>
          </ul>

          <h2 className="text-2xl font-semibold text-[#111111] mt-8 mb-4">¿Por qué elegirnos?</h2>
          <div className="grid md:grid-cols-2 gap-6 mt-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-[#111111] mb-2">Envíos rápidos</h3>
              <p className="text-gray-600 text-sm">Entrega a todo el país con seguimiento en tiempo real</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-[#111111] mb-2">Garantía oficial</h3>
              <p className="text-gray-600 text-sm">Todos nuestros productos cuentan con garantía del fabricante</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-[#111111] mb-2">Soporte técnico</h3>
              <p className="text-gray-600 text-sm">Equipo especializado para resolver todas tus dudas</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-[#111111] mb-2">Mejores precios</h3>
              <p className="text-gray-600 text-sm">Garantizamos el mejor precio del mercado</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}