import axios from 'axios'

const productId = '611984758'

async function testFetch() {
  try {
    console.log('Testing product page parsing...')

    const response = await axios.get(
      `https://www.wildberries.by/catalog/${productId}/detail.aspx`,
      {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept-Language': 'ru-RU,ru;q=0.9',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
          'Referer': 'https://www.wildberries.by/',
          'Cookie': 'lang=by',
        },
        timeout: 10000,
      }
    )

    const html = response.data

    // Extract og:title
    const nameMatch = html.match(/<meta\s+property="og:title"\s+content="([^"]+)"/)
    console.log('Name match:', nameMatch ? nameMatch[1] : 'NOT FOUND')

    // Extract JSON-LD
    const jsonLdMatch = html.match(/<script type="application\/ld\+json">({[\s\S]*?})<\/script>/)
    if (jsonLdMatch) {
      try {
        const jsonData = JSON.parse(jsonLdMatch[1])
        console.log('JSON-LD Name:', jsonData.name)
        console.log('JSON-LD Price:', jsonData.offers?.price)
      } catch (e) {
        console.log('JSON-LD parsing failed')
      }
    }

    // Show a sample of price patterns
    const priceMatches = html.match(/\d{1,3}(?:[.,]\d{2})?(?=\s*р|BYN)/g)
    console.log('Price patterns found:', priceMatches ? priceMatches.slice(0, 5) : 'NONE')

    // Show title tag
    const titleMatch = html.match(/<title>([^<]+)<\/title>/)
    console.log('Title tag:', titleMatch ? titleMatch[1] : 'NOT FOUND')

  } catch (error: any) {
    console.error('Error:', error.message)
  }
}

testFetch()

