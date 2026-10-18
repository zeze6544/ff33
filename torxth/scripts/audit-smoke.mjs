import { chromium } from 'playwright'

const browser = await chromium.launch({ headless: true })
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } })
const errors = []
page.on('pageerror', (err) => errors.push(String(err)))

await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' })
if (!(await page.getByRole('heading', { name: /open the case/i }).count())) {
  errors.push('Home headline missing')
}

await page.goto('http://localhost:5173/shop', { waitUntil: 'networkidle' })
await page.getByRole('button', { name: 'Add' }).first().click()
await page.waitForSelector('[role="dialog"]')
await page.keyboard.press('Escape')
await page.waitForTimeout(200)
if ((await page.locator('[role="dialog"]').count()) !== 0) errors.push('Docket stayed open')

await page.reload({ waitUntil: 'networkidle' })
const badge = await page.locator('header button[aria-label^="Open docket"]').innerText()
if (!/\d/.test(badge)) errors.push(`Docket badge missing after reload: ${badge}`)

await page.goto('http://localhost:5173/build', { waitUntil: 'networkidle' })
await page.getByRole('button', { name: /Summit/ }).click()
if (!(await page.getByText(/\$4,299|\$5,199/).count())) errors.push('Schematic price did not move')

await page.goto('http://localhost:5173/shop/ridge-gaming-tower')
const nested = await page.locator('[role="dialog"] a:has(button)').count()
if (nested) errors.push('Nested controls in docket')

await browser.close()
if (errors.length) {
  console.error('AUDIT FAIL')
  errors.forEach((e) => console.error('-', e))
  process.exit(1)
}
console.log('AUDIT PASS')
