import express, { Express, Request, Response } from 'express'
import axios from 'axios'
import cors from 'cors'
import sqlite3 from 'sqlite3'
import path from 'path'
import * as cheerio from 'cheerio'

const app: Express = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(cors())
app.use(express.json())

// Initialize SQLite database
const dbPath = path.join(process.cwd(), 'products.db')
const db = new sqlite3.Database(dbPath)

// Create products table if it doesn't exist
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      productId TEXT UNIQUE,
      name TEXT,
      currentPrice REAL,
      discountPrice REAL,
      link TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)
})

// Interface for product data
interface WildberriesProduct {
  productId: string
  name: string
  currentPrice: number
  discountPrice: number | null
  link: string
}

// Extract product ID from Wildberries URL
function extractProductId(url: string): string | null {
  const match = url.match(/\/catalog\/(\d+)/)
  return match ? match[1] : null
}

// Fetch product data from Wildberries internal API
async function fetchWildberriesProduct(
  productId: string
): Promise<WildberriesProduct | null> {
  try {
    // Fetch from product page with proper headers
    const response = await axios.get(
      `https://www.wildberries.by/catalog/${productId}/detail.aspx`,
      {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept-Language': 'ru-RU,ru;q=0.9',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
          'Referer': 'https://www.wildberries.by/',
        },
        timeout: 10000,
      }
    )

    const html = response.data
    const $ = cheerio.load(html)

    // Try to extract product name and prices
    let name = ''
    let currentPrice = 0
    let discountPrice: number | null = null

    // Method 1: Look for price elements with data attributes
    const priceElement = $('[data-price], [class*="price"], span:contains("р.")')
    if (priceElement.length > 0) {
      priceElement.each((i, elem) => {
        const text = $(elem).text().trim()
        const match = text.match(/(\d+[.,]?\d{0,2})\s*р/)
        if (match && !currentPrice) {
          currentPrice = parseFloat(match[1].replace(',', '.'))
        }
      })
    }

    // Method 2: Extract from h1 or title-like elements
    const titleElements = $('h1, [class*="title"]')
    if (titleElements.length > 0) {
      titleElements.each((i, elem) => {
        const text = $(elem).text().trim()
        if (text && !name) {
          name = text.substring(0, 200)
        }
      })
    }

    // Method 3: Parse JSON-LD if available
    const jsonLdScript = $('script[type="application/ld+json"]').html()
    if (jsonLdScript) {
      try {
        const jsonData = JSON.parse(jsonLdScript)
        if (jsonData.name && !name) {
          name = jsonData.name
        }
        if (jsonData.offers?.price && !currentPrice) {
          currentPrice = parseFloat(jsonData.offers.price)
        }
      } catch (e) {
        // Ignore JSON-LD parsing errors
      }
    }

    // Method 4: Extract all numbers that look like prices
    if (!currentPrice) {
      const text = $.text()
      const priceMatches = text.match(/\d+[.,]\d{2}\s*р/g)
      if (priceMatches && priceMatches.length > 0) {
        const prices = priceMatches.map(p => parseFloat(p.replace(/[^\d.,]/g, '').replace(',', '.')))
        currentPrice = Math.min(...prices)
        if (prices.length > 1) {
          const maxPrice = Math.max(...prices)
          if (maxPrice > currentPrice) {
            discountPrice = maxPrice
          }
        }
      }
    }

    // Fallback: Try to get product ID from page for verification
    if (!name) {
      const pageText = $.text()
      const words = pageText.split(/\s+/).filter(w => w.length > 3)
      name = words.slice(0, 5).join(' ')
    }

    // Validate data
    if (!name || name.length < 3 || currentPrice === 0 || currentPrice < 0.01) {
      console.warn(
        `Invalid product data for ${productId}: name="${name}", price=${currentPrice}`
      )
      return null
    }

    return {
      productId,
      name: name.trim(),
      currentPrice,
      discountPrice,
      link: `https://www.wildberries.by/catalog/${productId}/detail.aspx`,
    }
  } catch (error: any) {
    console.error(
      `Error fetching product ${productId}:`,
      error.message
    )
    return null
  }
}

// Store product in database
function storeProduct(product: WildberriesProduct): Promise<void> {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT OR REPLACE INTO products (productId, name, currentPrice, discountPrice, link)
       VALUES (?, ?, ?, ?, ?)`,
      [
        product.productId,
        product.name,
        product.currentPrice,
        product.discountPrice,
        product.link,
      ],
      (err: Error | null) => {
        if (err) reject(err)
        else resolve()
      }
    )
  })
}

// API endpoint to parse and fetch product
app.post('/api/parse-product', async (req: Request, res: Response) => {
  try {
    const { url } = req.body

    if (!url) {
      return res.status(400).json({ error: 'URL is required' })
    }

    // Only allow Wildberries URLs
    if (!url.includes('wildberries.by')) {
      return res
        .status(400)
        .json({ error: 'Only Wildberries.by links are supported' })
    }

    const productId = extractProductId(url)
    if (!productId) {
      return res.status(400).json({ error: 'Invalid Wildberries URL format' })
    }

    // Fetch product data
    const product = await fetchWildberriesProduct(productId)
    if (!product) {
      return res
        .status(500)
        .json({ error: 'Failed to fetch product data from Wildberries' })
    }

    // Store in database
    await storeProduct(product)

    return res.json({
      success: true,
      product: {
        productId: product.productId,
        name: product.name,
        currentPrice: product.currentPrice,
        discountPrice: product.discountPrice,
        link: product.link,
      },
    })
  } catch (error) {
    console.error('Error parsing product:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
})

// API endpoint to get all stored products
app.get('/api/products', (req: Request, res: Response) => {
  db.all('SELECT * FROM products ORDER BY createdAt DESC', (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' })
    }
    return res.json(rows)
  })
})

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`)
})
