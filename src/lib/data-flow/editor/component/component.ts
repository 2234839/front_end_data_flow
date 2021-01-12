import { computed, defineComponent, inject, watchEffect } from "vue";
import {
  InPut,
  Component,
  Flow,
  OutPut,
  Transform,
  toClass,
  实体obj,
} from "../../Node";
//@ts-expect-error
import Node from "../node.vue";
export default defineComponent({
  props: {
    data: {
      default: new Component(),
      type: Component,
    },
  },
  emits: ["update:data"],
  name: "ComponentNode",
  setup(props, ctx) {
    let data = computed(() => props.data);
    const boxList = computed(
      () => [...data.value.props, ...data.value.body] as InPut[],
    );
    const InputList = computed(() =>
      data.value.body.filter((el) => el instanceof InPut),
    );
    const TransformList = computed(() =>
      data.value.body.filter((el) => el instanceof Transform),
    );
    const outputList = computed(() =>
      data.value.body.filter((el) => el instanceof OutPut),
    );
    function isComponent(item: any) {
      return item instanceof Component;
    }

    function addBody(el: 实体obj) {
      const newData = toClass(data.value);
      newData.body.push(el);
      ctx.emit("update:data", newData);
    }
    function addInput() {
      addBody(new InPut());
    }
    function addOutput() {
      addBody(new OutPut());
    }
    function addTransform() {
      addBody(new Transform());
    }
    return {
      boxList,
      isComponent,

      InputList,
      TransformList,
      outputList,

      addInput,
      addOutput,
      addTransform,
    };
  },
  components: { Node, Component },
});
