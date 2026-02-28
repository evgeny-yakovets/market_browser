<template>
  <div class="home-page">
    <h1>Welcome to Market Browser</h1>
    <p>This application helps you browse and analyze marketplace links.</p>
    <div class="features">
      <div class="feature">
        <h2>Market Link Browser</h2>
        <p>Search and browse marketplace links using our dedicated tool.</p>
        <RouterLink to="/market-browser" class="btn">Go to Browser</RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.home-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

h1 {
  color: #333;
  text-align: center;
}

p {
  color: #666;
  text-align: center;
  font-size: 1.1rem;
}

.features {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  margin-top: 2rem;
}

.feature {
  padding: 2rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.feature h2 {
  color: #42b883;
  margin-top: 0;
}

.feature p {
  color: #666;
  text-align: left;
}

.btn {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background-color: #42b883;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  transition: background-color 0.3s ease;
  margin-top: 1rem;
}

.btn:hover {
  background-color: #369870;
}
</style>
