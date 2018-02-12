<template>
  <div class="main__container">
    <app-header/>
    <nuxt/>
  </div>
</template>

<script>
  import AppHeader from '~/components/AppHeader.vue'

  export default {
    components: {
      AppHeader
    },
  }
</script>

<style>
  .main__container {
    height: 100vh;
    display: flex;
    flex-direction: column;
  }
</style>
