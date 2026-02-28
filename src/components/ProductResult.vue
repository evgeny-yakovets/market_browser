<template>
  <div class="product-result" v-if="product">
    <div class="result-header">
      <h2>Product Found</h2>
      <button @click="onClear" class="btn-clear">Clear</button>
    </div>
    <div class="product-card">
      <div class="product-info">
        <h3>{{ product.name }}</h3>
        <div class="product-prices">
          <div class="price-row">
            <span class="label">Current Price:</span>
            <span class="current-price">{{ formatPrice(product.currentPrice) }}</span>
          </div>
          <div class="price-row" v-if="product.discountPrice">
            <span class="label">Original Price:</span>
            <span class="discount-price">{{ formatPrice(product.discountPrice) }}</span>
            <span class="discount-badge">
              -{{ calculateDiscount(product.currentPrice, product.discountPrice) }}%
            </span>
          </div>
          <div class="price-row" v-else>
            <span class="label">Original Price:</span>
            <span class="no-discount">No discount</span>
          </div>
        </div>
        <div class="product-link">
          <a :href="product.link" target="_blank" rel="noopener noreferrer">
            View on Wildberries →
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

interface Product {
  productId: string
  name: string
  currentPrice: number
  discountPrice: number | null
  link: string
}

defineProps<{
  product: Product | null
}>()

const emit = defineEmits<{
  clear: []
}>()

function formatPrice(price: number): string {
  return `${price.toFixed(2)} BYN`
}

function calculateDiscount(current: number, original: number): string {
  if (!original || original <= current) return '0'
  const discount = Math.round(((original - current) / original) * 100)
  return discount.toString()
}

function onClear() {
  emit('clear')
}
</script>

<style scoped>
.product-result {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #42b883;
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.result-header h2 {
  margin: 0;
  color: #333;
  font-size: 1.3rem;
}

.btn-clear {
  padding: 0.5rem 1rem;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.3s ease;
}

.btn-clear:hover {
  background-color: #c82333;
}

.product-card {
  background-color: white;
  padding: 1.5rem;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.product-info h3 {
  margin-top: 0;
  color: #333;
  font-size: 1.2rem;
}

.product-prices {
  margin: 1.5rem 0;
  padding: 1rem;
  background-color: #f0f0f0;
  border-radius: 4px;
}

.price-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.75rem;
}

.price-row:last-child {
  margin-bottom: 0;
}

.label {
  font-weight: 600;
  color: #555;
  min-width: 150px;
}

.current-price {
  font-size: 1.3rem;
  font-weight: bold;
  color: #42b883;
}

.discount-price {
  font-size: 1.1rem;
  color: #999;
  text-decoration: line-through;
}

.discount-badge {
  background-color: #dc3545;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: 0.9rem;
  font-weight: bold;
}

.no-discount {
  color: #999;
  font-style: italic;
}

.product-link {
  margin-top: 1.5rem;
}

.product-link a {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background-color: #42b883;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.product-link a:hover {
  background-color: #369870;
}
</style>
