<script setup>
import NavBar from './components/NavBar.vue'
import { onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const routes = ['/', '/capacity', '/tasks', '/rest-mood', '/intake', '/history']

function handleKeydown(e) {
  if (!e.altKey) return
  const current = routes.indexOf(router.currentRoute.value.path)
  if (e.key === 'ArrowRight') {
    e.preventDefault()
    router.push(routes[(current + 1) % routes.length])
  }
  if (e.key === 'ArrowLeft') {
    e.preventDefault()
    router.push(routes[(current - 1 + routes.length) % routes.length])
  }
    const num = parseInt(e.key)
  if (!isNaN(num) && num >= 1 && num <= routes.length) {
    e.preventDefault()
    router.push(routes[num - 1])
  }

}

onMounted(() => window.addEventListener('keydown', handleKeydown))
onUnmounted(() => window.removeEventListener('keydown', handleKeydown))
</script>

<template>
  <NavBar />
  <RouterView />
</template>

