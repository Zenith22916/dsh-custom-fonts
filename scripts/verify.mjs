// Zero-dependency smoke test for dsh-custom-fonts.
//
// Verifies the two load contracts this package ships:
//   1. host half  — importable ESM exposing { name, apply }
//   2. client half — window.__ModuleLoader__.load({ id, factory }) registers
//      a Cordis surface { name, inject: ['slots'], apply } that registers the
//      settings.section entry under a fresh id and carries a cleanup disposer.
//
// Run: node scripts/verify.mjs

import { createRequire } from 'node:module'
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'

const require = createRequire(import.meta.url)
const root = join(import.meta.dirname, '..')
let failures = 0

function check(name, fn) {
  Promise.resolve()
    .then(fn)
    .then(() => console.log(`ok   ${name}`))
    .catch((error) => {
      failures += 1
      console.error(`FAIL ${name}: ${error.message}`)
    })
}

// --- host half -----------------------------------------------------------
check('host half imports and exposes { name, apply }', async () => {
  const mod = await import(pathToFileURL(join(root, 'lib', 'index.js')).href)
  if (mod.name !== 'dsh-custom-fonts') throw new Error(`name is ${mod.name}`)
  if (typeof mod.apply !== 'function') throw new Error('apply missing')
  mod.apply() // must not throw
})

// --- client half ---------------------------------------------------------
check('client half registers through __ModuleLoader__', async () => {
  globalThis.window = {
    __ModuleLoader__: { load: (handoff) => { globalThis.__handoff = handoff } },
  }
  require(join(root, 'client', 'client.js'))
  globalThis.window = undefined
  const handoff = globalThis.__handoff
  if (!handoff || handoff.id !== 'dsh-custom-fonts') throw new Error('no registration with id dsh-custom-fonts')

  const surface = handoff.factory((id) => {
    if (id === 'react') return { createElement: () => {}, useState: () => ['', () => {}] }
    throw new Error('unexpected require: ' + id)
  })
  if (surface.name !== 'dsh-custom-fonts') throw new Error(`name is ${surface.name}`)
  if (JSON.stringify(surface.inject) !== '["slots"]') throw new Error('inject must declare slots')

  let effectFn = null
  let registered = false
  surface.apply({
    effect: (fn) => { effectFn = fn },
    slots: {
      inject: (key, cb) => { if (key !== 'settings.section') throw new Error(`wrong slot ${key}`); cb() },
      register: (opts, component) => {
        registered = opts.name === 'settings.section' && opts.id === 'fonts'
          && typeof opts.label() === 'string' && typeof component === 'function'
      },
    },
  })
  if (!registered) throw new Error('settings.section entry not registered')
  if (typeof effectFn !== 'function') throw new Error('unload cleanup disposer missing')
  if (typeof effectFn() !== 'function') throw new Error('effect must return a cleanup disposer')
})

// --- manifest self-consistency -------------------------------------------
check('package.json dsh fields are consistent', async () => {
  const manifest = require(join(root, 'package.json'))
  for (const file of [manifest.main, manifest.dsh?.bundle?.patch, manifest.exports?.['./client']]) {
    if (typeof file !== 'string' || !file.startsWith('./')) throw new Error(`bad artifact ref: ${file}`)
    if (!existsSync(join(root, file))) throw new Error(`missing artifact: ${file}`)
  }
  if (manifest.dsh?.client?.platform !== 'web') throw new Error('dsh.client.platform must be web')
})

// --- wait for async checks -----------------------------------------------
await new Promise((resolve) => setImmediate(resolve))
if (failures > 0) {
  console.error(`${failures} check(s) failed`)
  process.exit(1)
}
console.log('all checks passed')