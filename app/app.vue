<script setup lang="ts">
useHead({
  title: 'Beautify Event Stream',
  titleTemplate: '%s - SSE Debugger & Viewer',
  meta: [
    { name: 'description', content: 'Visualize, format, and debug Server-Sent Events (SSE). Support for Vercel AI SDK, JSON auto-formatting, and standard EventStreams.' },
    { name: 'keywords', content: 'SSE, Server-Sent Events, EventSource, Vercel AI SDK, Debugger, Viewer, JSON Formatter, Stream' },
    { property: 'og:type', content: 'website' },
    { property: 'og:title', content: 'Beautify Event Stream - Online SSE Viewer' },
    { property: 'og:description', content: 'The best tool to visualize and debug AI streams and SSE events.' },
    { name: 'twitter:card', content: 'summary_large_image' }
  ]
})
</script>

<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
