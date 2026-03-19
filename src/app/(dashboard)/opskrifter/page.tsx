import { Button } from '@/components/ui/Button'

export default function OpskrifterPage() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Opskrifter</h1>
          <p className="mt-1 text-gray-600">
            Dine gemte opskrifter og favoritter
          </p>
        </div>
        <Button>Tilfoej opskrift</Button>
      </div>

      <div className="mt-8">
        <div className="flex flex-col items-center justify-center rounded-xl bg-white py-16 shadow-sm">
          <div className="text-5xl">📖</div>
          <h3 className="mt-4 text-lg font-semibold text-gray-900">
            Ingen opskrifter endnu
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            Tilfoej din foerste opskrift for at komme i gang.
          </p>
          <div className="mt-6">
            <Button>Tilfoej opskrift</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
