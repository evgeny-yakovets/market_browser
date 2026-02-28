<template>
  <div class="market-link-browser-container">
    <ProductResult :product="product" @clear="onClearResult" />

    <form @submit.prevent="onSearch" class="market-link-browser">
      <label for="link-input" class="sr-only">Marketplace Link</label>
      <input
        id="link-input"
        type="text"
        v-model="link"
        placeholder="Paste Wildberries.by link here"
        class="input-link"
        :disabled="isLoading"
      />
      <button type="submit" class="btn-search" :disabled="isLoading">
        {{ isLoading ? 'Searching...' : 'Search' }}
      </button>
    </form>

    <div v-if="error" class="error-message">
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'
import ProductResult from './ProductResult.vue'

interface Product {
  productId: string
  name: string
  currentPrice: number
  discountPrice: number | null
  link: string
}

const link = ref('')
const product = ref<Product | null>(null)
const error = ref('')
const isLoading = ref(false)

const API_URL = 'http://localhost:3000'

async function onSearch() {
  error.value = ''
  product.value = null

  if (!link.value.trim()) {
    error.value = 'Please enter a link'
    return
  }

  isLoading.value = true

  try {
    const response = await axios.post(`${API_URL}/api/parse-product`, {
      url: link.value,
    })

    if (response.data.success) {
      product.value = response.data.product
      link.value = ''
    }
  } catch (err: any) {
    error.value =
      err.response?.data?.error || 'Failed to parse product. Please try again.'
    console.error('Error:', err)
  } finally {
    isLoading.value = false
  }
}

function onClearResult() {
  product.value = null
}
</script>

<style scoped>
.market-link-browser-container {
  width: 100%;
}

.market-link-browser {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  margin-top: 1rem;
}

.input-link {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
}

.input-link:focus {
  outline: none;
  border-color: #42b883;
  box-shadow: 0 0 0 3px rgba(66, 184, 131, 0.1);
}

.input-link:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.btn-search {
  padding: 0.75rem 1.5rem;
  background-color: #42b883;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.3s ease;
}

.btn-search:hover:not(:disabled) {
  background-color: #369870;
}

.btn-search:disabled {
  background-color: #999;
  cursor: not-allowed;
}

.error-message {
  margin-top: 1rem;
  padding: 1rem;
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
  font-size: 0.9rem;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
</style>
