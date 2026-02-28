<template>
  <div class="market-browser-page">
    <h1>Market Link Browser</h1>
    <MarketLinkBrowser />
  </div>
</template>

<script setup lang="ts">
import MarketLinkBrowser from '../components/MarketLinkBrowser.vue'
</script>

<style scoped>
.market-browser-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

h1 {
  color: #333;
  margin-bottom: 2rem;
}
</style>
