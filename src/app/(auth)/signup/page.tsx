import Link from 'next/link'
import { signUp } from '@/app/actions/auth'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Opret konto</h1>
      <p className="mt-2 text-sm text-gray-600">
        Kom i gang med Maet og planlaeg maaltider for hele familien.
      </p>

      {error && (
        <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form action={signUp} className="mt-6 space-y-4">
        <Input
          id="name"
          name="name"
          type="text"
          label="Fulde navn"
          placeholder="Dit navn"
          required
        />
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
          placeholder="Mindst 6 tegn"
          minLength={6}
          required
        />
        <Button type="submit" className="w-full">
          Opret konto
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        Har du allerede en konto?{' '}
        <Link href="/login" className="font-medium text-green-600 hover:text-green-500">
          Log ind
        </Link>
      </p>
    </div>
  )
}
