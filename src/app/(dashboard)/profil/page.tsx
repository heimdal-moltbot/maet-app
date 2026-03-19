import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/Button'

export default async function ProfilPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Profil</h1>
      <p className="mt-1 text-gray-600">
        Administrer din profil og familiemedlemmer
      </p>

      <div className="mt-8 space-y-6">
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">
            Kontooplysninger
          </h2>
          <div className="mt-4 space-y-3">
            <div>
              <p className="text-sm font-medium text-gray-500">E-mail</p>
              <p className="text-gray-900">{user?.email ?? '-'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Navn</p>
              <p className="text-gray-900">
                {user?.user_metadata?.full_name ?? '-'}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Familiemedlemmer
            </h2>
            <Button size="sm">Tilfoej medlem</Button>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-500">
              Ingen familiemedlemmer tilfojet endnu. Tilfoej familiemedlemmer
              for at tilpasse maaltider og haandtere allergier.
            </p>
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">
            Praeferencer
          </h2>
          <div className="mt-4">
            <p className="text-sm text-gray-500">
              Tilfoej familiemedlemmer for at angive kostrestriktioner og
              praeferencer.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
