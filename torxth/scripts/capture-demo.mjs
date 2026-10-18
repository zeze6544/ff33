import { chromium } from 'playwright'
import { mkdirSync } from 'fs'
import { dirname, join } from 'path'

const outDir = '/opt/cursor/artifacts/screenshots'
mkdirSync(outDir, { recursive: true })
mkdirSync('/opt/cursor/artifacts', { recursive: true })

const browser = await chromium.launch({ headless: true })
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  recordVideo: {
    dir: '/opt/cursor/artifacts',
    size: { width: 1440, height: 900 },
  },
})
const page = await context.newPage()

const shot = async (name) => {
  const path = join(outDir, `${name}.png`)
  await page.screenshot({ path, fullPage: false })
  console.log('saved', path)
}

await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' })
await page.waitForTimeout(800)
await shot('home_hero')

await page.waitForTimeout(600)
await shot('home_with_marquee')

await page.getByRole('link', { name: 'Shop systems' }).click()
await page.waitForURL('**/shop')
await page.waitForTimeout(500)
await shot('shop_catalog')

await page.getByRole('button', { name: 'Compare' }).first().click()
await page.getByRole('button', { name: 'Compare' }).nth(1).click()
await page.waitForTimeout(400)
await shot('shop_compare_tray')

await page.getByRole('link', { name: 'Ridge Gaming Tower' }).first().click()
await page.waitForURL('**/shop/ridge-gaming-tower')
await page.waitForTimeout(400)
await page.getByRole('button', { name: 'Add to cart' }).first().click()
await page.waitForTimeout(500)
await shot('product_cart_drawer')

await page.getByRole('link', { name: 'Proceed to checkout' }).click()
await page.waitForURL('**/checkout')
await page.waitForTimeout(500)
await shot('checkout_form')

await page.goto('http://localhost:5173/build')
await page.waitForTimeout(500)
await page.getByRole('button', { name: /Summit.*4K/i }).click()
await page.waitForTimeout(300)
await shot('build_configurator')

await page.goto('http://localhost:5173/services')
await page.waitForTimeout(400)
await shot('services_page')

await page.goto('http://localhost:5173/about')
await page.waitForTimeout(400)
await shot('about_page')

await page.goto('http://localhost:5173/contact')
await page.waitForTimeout(400)
await shot('contact_page')

// Mobile home
await page.setViewportSize({ width: 390, height: 844 })
await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' })
await page.waitForTimeout(500)
await shot('home_mobile')

const videoPath = await page.video().path()
await context.close()
await browser.close()
console.log('video', videoPath)
