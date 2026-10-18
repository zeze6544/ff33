import { chromium } from 'playwright'

const browser = await chromium.launch({ headless: true })
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } })
const errors = []

page.on('pageerror', (e) => errors.push(String(e)))

await page.goto('http://localhost:5173/shop', { waitUntil: 'networkidle' })

await page.getByRole('button', { name: 'Add' }).first().click()
await page.waitForSelector('[role="dialog"]')
await page.keyboard.press('Escape')
await page.waitForTimeout(250)
if ((await page.locator('[role="dialog"]').count()) !== 0) {
  errors.push('Cart dialog did not close on Escape')
}

await page.getByRole('button', { name: 'Add' }).first().click()
await page.waitForSelector('[role="dialog"]')
await page.keyboard.press('Escape')
await page.waitForTimeout(200)
await page.reload({ waitUntil: 'networkidle' })
const badge = await page.locator('header button[aria-label^="Open cart"]').innerText()
if (!/\d/.test(badge)) errors.push(`Cart badge not hydrated after reload: "${badge}"`)

await page.getByRole('button', { name: 'Compare' }).nth(0).click()
await page.waitForTimeout(100)
await page.getByRole('button', { name: 'Compare' }).nth(0).click()
await page.getByRole('link', { name: 'View comparison' }).click()
await page.waitForURL(/compare=/)
await page.waitForSelector('h2:text("Compare")')
const compareHeading = await page.locator('h2', { hasText: 'Compare' }).count()
if (!compareHeading) errors.push('Compare view missing')

await page.goto('http://localhost:5173/shop/ridge-gaming-tower')
await page.getByRole('button', { name: 'Add to cart' }).first().click()
await page.waitForSelector('[role="dialog"]')
const nested = await page.locator('[role="dialog"] a:has(button)').count()
if (nested > 0) errors.push(`Found ${nested} nested button-in-link elements in cart`)

await browser.close()

if (errors.length) {
  console.error('AUDIT FAIL')
  for (const e of errors) console.error('-', e)
  process.exit(1)
}
console.log('AUDIT PASS')
