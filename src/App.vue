<template>
  <div class="c">
    <ComponentNode v-model:data="data" @update:data="t" />
  </div>
</template>

<script src="./app.ts" lang="ts"></script>
<style scoped>
  .c {
    padding: 30px;
  }
</style>
