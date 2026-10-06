// The main screen. For now it only shows a hello-world message.
// All words shown to users come from content/ui.en.json, never typed here.

import ui from '../content/ui.en.json'

export default function App() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-16 font-sans text-gray-900">
      <h1 className="text-3xl font-semibold text-accent">{ui.appTitle}</h1>
      <p className="mt-4 text-lg">{ui.helloMessage}</p>
    </main>
  )
}
