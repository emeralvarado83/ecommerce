'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { User, MapPin, Settings } from 'lucide-react'

type UserProfile = {
  name: string | null
  lastName: string | null
  email: string
  image: string | null
  phone: string | null
  address: string | null
}

type Address = {
  id: string
  name: string
  address: string
  city: string
  state: string
  postal: string
  isDefault: boolean
}

export default function AccountPage() {
  const { data: session, status, update } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('personal')
  const [loading, setLoading] = useState(false)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [addresses, setAddresses] = useState<Address[]>([])
  const [savingProfile, setSavingProfile] = useState(false)
  const [profileSuccess, setProfileSuccess] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    lastName: '',
    phone: '',
    address: ''
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    if (status === 'authenticated') {
      fetchProfile()
      fetchAddresses()
    }
  }, [status])

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/account/profile')
      if (res.ok) {
        const data = await res.json()
        setProfile(data)
        setFormData({
          name: data.name || '',
          lastName: data.lastName || '',
          phone: data.phone || '',
          address: data.address || ''
        })
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    }
  }

  const fetchAddresses = async () => {
    try {
      const res = await fetch('/api/account/addresses')
      if (res.ok) {
        const data = await res.json()
        setAddresses(data)
      }
    } catch (error) {
      console.error('Error fetching addresses:', error)
    }
  }

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSavingProfile(true)
    setProfileSuccess(false)

    try {
      const res = await fetch('/api/account/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (res.ok) {
        const data = await res.json()
        setProfile(data)
        setProfileSuccess(true)
        update({ name: data.name })
      }
    } catch (error) {
      console.error('Error updating profile:', error)
    } finally {
      setSavingProfile(false)
      setTimeout(() => setProfileSuccess(false), 3000)
    }
  }

  if (status === 'loading' || !profile) {
    return (
      <div className="container mx-auto px-4 py-12">
        <p className="text-center text-gray-600">Cargando...</p>
      </div>
    )
  }

  const tabs = [
    { id: 'personal', label: 'Información Personal', icon: User },
    { id: 'addresses', label: 'Direcciones', icon: MapPin },
    { id: 'security', label: 'Seguridad', icon: Settings }
  ]

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Mi Cuenta</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-1">
          <Card>
            <CardContent className="p-4">
              <div className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-[2.5px] text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-[#0A84FF] text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <tab.icon className="h-5 w-5" />
                    {tab.label}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-3">
          {activeTab === 'personal' && (
            <Card>
              <CardHeader>
                <CardTitle>Información Personal</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-6 mb-8 pb-6 border-b">
                  <div className="w-20 h-20 rounded-full bg-[#F5F5F7] flex items-center justify-center overflow-hidden">
                    {profile.image ? (
                      <img src={profile.image} alt="Perfil" className="w-full h-full object-cover" />
                    ) : (
                      <User className="h-10 w-10 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <Button variant="outline" size="sm">
                      Cambiar foto
                    </Button>
                  </div>
                </div>

                <form onSubmit={handleProfileSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nombres</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Tu nombre"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Apellidos</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        placeholder="Tu apellido"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Correo electrónico</Label>
                    <Input
                      id="email"
                      value={profile.email}
                      disabled
                      className="bg-gray-50"
                    />
                    <p className="text-xs text-gray-500">El correo no se puede cambiar</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Teléfono</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="Número de teléfono"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Dirección</Label>
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        placeholder="Tu dirección"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-4 pt-4">
                    <Button type="submit" disabled={savingProfile}>
                      {savingProfile ? 'Guardando...' : 'Guardar cambios'}
                    </Button>
                    {profileSuccess && (
                      <span className="text-green-600 text-sm">Cambios guardados</span>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {activeTab === 'addresses' && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Mis Direcciones</CardTitle>
                <Button size="sm">Agregar Dirección</Button>
              </CardHeader>
              <CardContent>
                {addresses.length === 0 ? (
                  <p className="text-gray-600 text-center py-8">
                    No tienes direcciones guardadas
                  </p>
                ) : (
                  <div className="space-y-4">
                    {addresses.map((address) => (
                      <div key={address.id} className="p-4 border rounded-[2.5px]">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{address.name}</p>
                            <p className="text-gray-600">{address.address}</p>
                            <p className="text-sm text-gray-500">
                              {address.city}, {address.state} {address.postal}
                            </p>
                          </div>
                          {address.isDefault && (
                            <span className="text-xs bg-[#0A84FF]/10 text-[#0A84FF] px-2 py-1 rounded">
                              Principal
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {activeTab === 'security' && (
            <Card>
              <CardHeader>
                <CardTitle>Seguridad</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-[2.5px]">
                    <p className="font-medium mb-2">Contraseña</p>
                    <p className="text-sm text-gray-600 mb-4">Cambia tu contraseña regularmente para mayor seguridad</p>
                    <Button variant="outline" size="sm">Cambiar contraseña</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}