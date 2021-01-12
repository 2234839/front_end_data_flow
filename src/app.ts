import { EndpointOptions } from "@jsplumb/community/types/core";
import {
  computed,
  defineComponent,
  onMounted,
  onUnmounted,
  ref,
  watch,
  watchEffect,
} from "vue";
import { jsplumb } from "./lib/data-flow/editor/jsplumb";
//@ts-expect-error
import ComponentNode from "./lib/data-flow/editor/component/component.vue";
import {
  InPut,
  Flow,
  toClass,
  SearchComponent,
  Transform,
  OutPut,
} from "./lib/data-flow/Node";
export default defineComponent({
  name: "App",
  setup() {
    const StoreName = "[位置信息]";
    const DataStoreName = "[DataStoreName]";
    const data = ref(SearchComponent);
    const code = localStorage.getItem(DataStoreName);
    if (code === null) {
    } else {
      // data = plainToClass(JSON.parse(code));
    }
    const boxList = computed(() => {
      return [
        ...data.value.props,
        ...data.value.body.filter((el) => !(el instanceof Flow)),
      ] as (InPut | Transform | OutPut)[];
    });
    const flowList = computed(() => {
      return [...data.value.body.filter((el) => el instanceof Flow)] as Flow[];
    });
    onMounted(() => {
      jsplumb.ready(() => {
        watch(
          () => data.value,
          () => {
            setTimeout(() => {
              const common: EndpointOptions = {
                connector: "Straight", //直线
                // connector: "Flowchart",//折线
                // connector: "StateMachine",//折线
                // connector: "Bezier", //曲线
                maxConnections: -1,
              };
              const instance = jsplumb.newInstance({ container: "d-c" });
              // instance.reset();
              console.log("初始化 jsplumb");
              instance.bind("beforeDrop", function (info: any) {
                console.log("[info]", info);
                data.value.pushBody(
                  toClass({
                    __type: "Flow",
                    start: info.sourceId,
                    end: info.targetId,
                  }),
                );
                return true; // 链接会自动建立
              });
              console.log("[flowList.value]", flowList.value);
              console.log("[boxList.value]", boxList.value);
              load位置信息();
              const warpBoxList = boxList.value.map((el) => {
                const anchor = (() => {
                  if (el instanceof InPut) {
                    return ["TopRight", "BottomRight"] as const;
                  } else if (el instanceof Transform) {
                    return ["Left", "Right"] as const;
                  } else if (el instanceof OutPut) {
                    return ["TopLeft", "BottomLeft"] as const;
                  }
                  return ["TopRight", "BottomRight"] as const;
                })();
                instance.removeAllEndpoints(el.__id);
                return {
                  el,
                  inEndpoint: instance.addEndpoint(
                    el.__id,
                    {
                      anchor: anchor[0],
                      paintStyle: { fill: "#48f483" },
                      isTarget: true,
                      isSource: false,
                    },
                    common,
                  ),
                  outEndpoint: instance.addEndpoint(
                    el.__id,
                    {
                      anchor: anchor[1],
                      isSource: true,
                      isTarget: false,
                    },
                    common,
                  ),
                };
              });
              function getBoxByID(id: string) {
                const box = data.value.findById(id)!;
                return warpBoxList.find((el) => el.el === box);
              }
              flowList.value.forEach((el) => {
                instance.connect({
                  source: getBoxByID(el.getStartId())?.outEndpoint,
                  target: getBoxByID(el.getEndId())?.inEndpoint,
                  overlays: [
                    ["Arrow", { width: 6, length: 10, location: 0.13 }],
                    ["Arrow", { width: 6, length: 10, location: 0.3 }],
                    ["Arrow", { width: 6, length: 10, location: 0.6 }],
                    ["Arrow", { width: 6, length: 10, location: 0.84 }],
                  ],
                  /** 不可以拆下来 */
                  detachable: false,
                });
              });
            }, 500);
          },
          { immediate: true },
        );
      });
    });
    function load位置信息() {
      const code = localStorage.getItem(StoreName);
      if (code === null) {
      } else {
        const data = JSON.parse(code) as ReturnType<typeof save>;
        data.forEach((item) => {
          const el = document.getElementById(item.id);
          if (el === null) {
            console.error("查找元素失败", item);
          } else {
            Object.assign(el.style, item);
          }
        });
      }
    }
    function save() {
      const 位置信息 = boxList.value.map((item) => {
        const el = document.getElementById(item.__id);
        return { id: item.__id, left: el?.style.left!, top: el?.style.top! };
      });
      localStorage.setItem(StoreName, JSON.stringify(位置信息));
      localStorage.setItem(DataStoreName, JSON.stringify(data));
      // console.log("[JSON.stringify(data)]", JSON.stringify(data, null, 4));
      return 位置信息;
    }
    const timer = setInterval(() => {
      // save();
      console.log("[自动保存]");
    }, 5000);
    onUnmounted(() => {
      clearInterval(timer);
    });

    function t(params: any) {
      console.log("[params]", params);
    }
    return { boxList, flowList, data, t };
  },
  components: { ComponentNode },
});
