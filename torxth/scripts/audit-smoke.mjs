import { chromium } from 'playwright'

const base = process.env.BASE ?? 'http://localhost:5173'
const browser = await chromium.launch({ headless: true })
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } })
const errors = []
page.on('pageerror', (err) => errors.push(String(err)))

await page.goto(`${base}/`, { waitUntil: 'networkidle' })
if (!(await page.getByRole('heading', { name: /open the case/i }).count())) {
  errors.push('Home headline missing')
}

await page.goto(`${base}/shop`, { waitUntil: 'networkidle' })
await page.getByRole('button', { name: 'Add' }).first().click()
await page.waitForSelector('[role="dialog"]')
await page.keyboard.press('Escape')
await page.waitForTimeout(200)
if ((await page.locator('[role="dialog"]').count()) !== 0) errors.push('Docket stayed open')

await page.reload({ waitUntil: 'networkidle' })
const badge = await page.locator('header button[aria-label^="Open docket"]').innerText()
if (!/\d/.test(badge)) errors.push(`Docket badge missing after reload: ${badge}`)

await page.goto(`${base}/build`, { waitUntil: 'networkidle' })
const before = await page.locator('[data-total]').getAttribute('data-total')
await page.getByRole('button', { name: 'Summit 4K and the long jobs.' }).click()
await page.getByText(/RTX 5080/).first().waitFor()
const after = await page.locator('[data-total]').getAttribute('data-total')
if (!before || !after || before === after) errors.push(`Editor price did not move (${before} -> ${after})`)

await page.goto(`${base}/shop/ridge-gaming-tower`)
const nested = await page.locator('[role="dialog"] a:has(button)').count()
if (nested) errors.push('Nested controls in docket')

await browser.close()
if (errors.length) {
  console.error('AUDIT FAIL')
  errors.forEach((e) => console.error('-', e))
  process.exit(1)
}
console.log('AUDIT PASS')
