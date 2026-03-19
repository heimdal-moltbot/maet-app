import Link from 'next/link'
import { signIn } from '@/app/actions/auth'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Log ind</h1>
      <p className="mt-2 text-sm text-gray-600">
        Log ind paa din Maet-konto for at se din madplan.
      </p>

      {error && (
        <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form action={signIn} className="mt-6 space-y-4">
        <Input
          id="email"
          name="email"
          type="email"
          label="E-mail"
          placeholder="din@email.dk"
          required
        />
        <Input
          id="password"
          name="password"
          type="password"
          label="Adgangskode"
          placeholder="••••••••"
          required
        />
        <Button type="submit" className="w-full">
          Log ind
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        Har du ikke en konto?{' '}
        <Link href="/signup" className="font-medium text-green-600 hover:text-green-500">
          Opret konto
        </Link>
      </p>
    </div>
  )
}
