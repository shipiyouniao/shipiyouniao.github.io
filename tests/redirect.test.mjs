import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { runInNewContext } from 'node:vm'
import test from 'node:test'

const primary = readFileSync('site/Minesweeper-2.0/index.html', 'utf8')
const script = primary.match(/<script>([\s\S]*?)<\/script>/)?.[1]
assert.ok(script)

test('legacy entry points preserve query and fragment while replacing browser history', () => {
  for (const suffix of ['', '?ruleset=survey&lang=zh#board', '?mode=expert&lang=ja', '?page=story&lang=en#camp', '?next=https%3A%2F%2Fexample.net%2F&lang=zh#%E8%90%A5%E5%9C%B0']) {
    const old = new URL('https://shipiyouniao.github.io/Minesweeper-2.0/' + suffix)
    const link = { href: '' }
    let replaced = null
    runInNewContext(script, { URL, location: { origin: old.origin, search: old.search, hash: old.hash, replace: (url) => { replaced = url } }, document: { querySelector: () => link } })
    const target = new URL(replaced)
    assert.equal(target.origin, old.origin)
    assert.equal(target.pathname, '/minefarer/')
    assert.equal(target.search, old.search)
    assert.equal(target.hash, old.hash)
    assert.equal(link.href, replaced)
  }
})

test('the legacy directory and index entry include a no-script fallback', () => {
  assert.match(primary, /http-equiv="refresh" content="5;url=\/minefarer\/"/)
  assert.match(primary, /id="destination" href="\/minefarer\/"/)
  assert.ok(readFileSync('site/index.html', 'utf8').includes('href="/minefarer/"'))
})
