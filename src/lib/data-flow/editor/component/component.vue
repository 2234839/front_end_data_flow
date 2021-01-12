<template>
  <div id="d-c" class="c">
    <div>
      <button @click="addInput()">添加一个 input</button>
      <button @click="addTransform()">添加一个 Transform</button>
      <button @click="addOutput()">添加一个 Output</button>
    </div>
    <div class="c-input c-col">
      <h3>Input</h3>
      <div
        :id="item.__id"
        class="c-box"
        v-for="item in InputList"
        :key="item.__id"
      >
        <ComponentNode v-if="isComponent(item)" :data="item" />
        <input v-else type="text" v-model="item.name" />
      </div>
    </div>
    <div class="c-transform c-col">
      <h3>transform</h3>

      <div
        :id="item.__id"
        class="c-box"
        v-for="item in TransformList"
        :key="item.__id"
      >
        <ComponentNode v-if="isComponent(item)" :data="item" />
        <input v-else type="text" v-model="item.name" />
      </div>
    </div>
    <div class="c-output c-col">
      <h3>output</h3>
      <div
        :id="item.__id"
        class="c-box"
        v-for="item in outputList"
        :key="item.__id"
      >
        <ComponentNode v-if="isComponent(item)" :data="item" />
        <input v-else type="text" v-model="item.name" />
      </div>
    </div>
  </div>
</template>

<script src="./component.ts" lang="ts"></script>
<style scoped>
  .c {
    display: flex;
    /* flex-wrap: wrap; */
  }
  .c-col {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .c-box {
    min-height: 50px;
    min-width: 60px;
    border: 1px solid #333;
    margin: 2px;
    /* position: absolute; */
    user-select: none;
    margin: 60px 30px;
  }
</style>
