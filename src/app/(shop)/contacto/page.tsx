import { Mail, MapPin, Phone } from 'lucide-react'

export const metadata = {
  title: 'Contacto - TechStore',
  description: 'Contáctanos para cualquier consulta o soporte técnico.'
}

export default function ContactoPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-[#111111] mb-6">Contacto</h1>
        <p className="text-gray-600 text-lg mb-12">
          ¿Tienes alguna pregunta? Estamos aquí para ayudarte. Contáctanos por cualquiera 
          de los siguientes medios.
        </p>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-gray-50 p-6 rounded-lg text-center">
            <div className="w-12 h-12 bg-[#0A84FF]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone className="h-6 w-6 text-[#0A84FF]" />
            </div>
            <h3 className="font-semibold text-[#111111] mb-2">Teléfono</h3>
            <p className="text-gray-600 text-sm">+52 (55) 1234-5678</p>
            <p className="text-gray-600 text-sm">Lun - Vie: 9am - 6pm</p>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg text-center">
            <div className="w-12 h-12 bg-[#0A84FF]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="h-6 w-6 text-[#0A84FF]" />
            </div>
            <h3 className="font-semibold text-[#111111] mb-2">Email</h3>
            <p className="text-gray-600 text-sm">contacto@techstore.com</p>
            <p className="text-gray-600 text-sm">soporte@techstore.com</p>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg text-center">
            <div className="w-12 h-12 bg-[#0A84FF]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="h-6 w-6 text-[#0A84FF]" />
            </div>
            <h3 className="font-semibold text-[#111111] mb-2">Dirección</h3>
            <p className="text-gray-600 text-sm">Av. Principal 123</p>
            <p className="text-gray-600 text-sm">Ciudad de México, CDMX</p>
          </div>
        </div>

        <div className="bg-gray-50 p-8 rounded-lg">
          <h2 className="text-2xl font-semibold text-[#111111] mb-6">Envíanos un mensaje</h2>
          <form className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0A84FF] focus:border-transparent"
                  placeholder="Tu nombre"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0A84FF] focus:border-transparent"
                  placeholder="tu@email.com"
                />
              </div>
            </div>
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                Asunto
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0A84FF] focus:border-transparent"
                placeholder="Asunto de tu mensaje"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                Mensaje
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0A84FF] focus:border-transparent"
                placeholder="Escribe tu mensaje aquí..."
              />
            </div>
            <button
              type="submit"
              className="w-full md:w-auto px-6 py-3 bg-[#0A84FF] hover:bg-[#007AE6] text-white font-medium rounded-lg transition-colors"
            >
              Enviar Mensaje
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}