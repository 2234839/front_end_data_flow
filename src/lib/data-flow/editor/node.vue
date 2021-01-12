<template>
  <div
    class="c"
    @mousedown="onDragstart"
    @mouseleave="selected = false"
    @mouseup="selected = false"
    @mousemove="onDragover"
    :style="{ left: position.x + 'px', top: position.y + 'px' }"
  >
    <slot />
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref, reactive } from "vue";

  export default defineComponent({
    setup(props, ctx) {
      const selected = ref(false);
      const position = reactive({ x: 0, y: 0 });

      const startPosition = reactive({ x: 0, y: 0 });

      function onDragstart(e: MouseEvent) {
        selected.value = true;
        startPosition.x = e.clientX - (e.target! as HTMLElement).offsetLeft;
        startPosition.y = e.clientY - (e.target! as HTMLElement).offsetTop;
      }
      function onDragover(e: MouseEvent) {
        // if (selected.value) {
        //   position.x = e.clientX - startPosition.x;
        //   position.y = e.clientY - startPosition.y;
        // }
      }
      return { position, onDragstart, onDragover, selected };
    },
  });
</script>

<style scoped>
  .c {
    min-height: 50px;
    min-width: 60px;
    border: 1px solid #333;
    margin: 2px;
    position: absolute;
    user-select: none;
  }
</style>
