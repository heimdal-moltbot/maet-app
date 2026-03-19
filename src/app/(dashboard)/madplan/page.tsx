const dage = [
  'Mandag',
  'Tirsdag',
  'Onsdag',
  'Torsdag',
  'Fredag',
  'Loerdag',
  'Soendag',
]

export default function MadplanPage() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ugens madplan</h1>
          <p className="mt-1 text-gray-600">
            Planlaeg maaltider for hele ugen
          </p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-7">
        {dage.map((dag) => (
          <div
            key={dag}
            className="rounded-xl bg-white p-4 shadow-sm"
          >
            <h3 className="font-semibold text-gray-900">{dag}</h3>
            <div className="mt-3 space-y-2">
              <div className="rounded-lg border-2 border-dashed border-gray-200 p-3 text-center">
                <p className="text-xs text-gray-400">Morgenmad</p>
              </div>
              <div className="rounded-lg border-2 border-dashed border-gray-200 p-3 text-center">
                <p className="text-xs text-gray-400">Frokost</p>
              </div>
              <div className="rounded-lg border-2 border-dashed border-gray-200 p-3 text-center">
                <p className="text-xs text-gray-400">Aftensmad</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
