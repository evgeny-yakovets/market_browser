<template>
  <nav class="navigation">
    <div class="nav-container">
      <h1 class="nav-logo">Market Browser</h1>
      <ul class="nav-links">
        <li>
          <RouterLink to="/" :class="{ active: route.path === '/' }">
            Home
          </RouterLink>
        </li>
        <li>
          <RouterLink
            to="/market-browser"
            :class="{ active: route.path === '/market-browser' }"
          >
            Market Link Browser
          </RouterLink>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<style scoped>
.navigation {
  background-color: #333;
  padding: 0;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-logo {
  color: white;
  margin: 0;
  font-size: 1.5rem;
}

.nav-links {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 2rem;
}

.nav-links a {
  color: #ccc;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.nav-links a:hover {
  color: white;
  background-color: #555;
}

.nav-links a.active {
  color: white;
  background-color: #42b883;
}
</style>
