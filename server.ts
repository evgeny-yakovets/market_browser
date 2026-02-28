import express, { Express, Request, Response } from 'express'
import axios from 'axios'
import cors from 'cors'
import sqlite3 from 'sqlite3'
import path from 'path'

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
    // Try Wildberries API endpoint
    const response = await axios.get(
      `https://www.wildberries.by/api/items/${productId}`,
      {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
        timeout: 5000,
      }
    )

    const data = response.data

    return {
      productId,
      name: data.name || data.title || 'Unknown Product',
      currentPrice: data.price || data.salePriceU ? data.salePriceU / 100 : 0,
      discountPrice: data.basicPrice || data.basicPriceU ? data.basicPriceU / 100 : null,
      link: `https://www.wildberries.by/catalog/${productId}/detail.aspx`,
    }
  } catch (error) {
    console.error('Error fetching from Wildberries API:', error)
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
