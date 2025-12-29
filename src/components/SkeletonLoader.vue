<template>
  <div class="bg-gray-200 animate-pulse rounded" :class="class" />
</template>

<script setup lang="ts">
interface Props {
  class?: string
}

defineProps<Props>()
</script>
