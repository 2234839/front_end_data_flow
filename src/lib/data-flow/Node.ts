function uuid(): string {
  var s = [] as any;
  var hexDigits = "0123456789abcdef";
  for (var i = 0; i < 12; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  return `id_${Date.now()}_${s.join("")}`;
}

export class InPut {
  __type = "InPut";
  __id = uuid();

  name = "";
}
export class Transform {
  __type = "Transform";
  __id = uuid();

  name = "";
}
export class OutPut {
  __type = "OutPut";
  __id = uuid();

  name = "";
}
export class Flow {
  __type = "Flow";
  __id = uuid();

  start = "" as { __id: string } | string;
  getStartId() {
    if (typeof this.start === "string") {
      return this.start;
    } else {
      return this.start.__id;
    }
  }

  end = "" as { __id: string } | string;

  getEndId() {
    if (typeof this.end === "string") {
      return this.end;
    } else {
      return this.end.__id;
    }
  }
}
export type 实体obj = { __type: string; __id: string };
export class Component extends OutPut {
  findBoxByName(name: string) {
    return this.props.find((el) => el.name === name);
  }
  findById(id: string) {
    return [...this.props, ...this.body].find((el) => el.__id === id);
  }
  __type = "Component" as const;
  __id = uuid();
  name = "";

  props = [] as InPut[];

  body = [] as 实体obj[];
  pushBody(p: 实体obj) {
    this.body.push(p);
  }
}
const typeList = {
  Flow: Flow,
  InPut: InPut,
  Component: Component,
  Transform: Transform,
  OutPut: OutPut,
};
type NonFunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends Function ? never : K;
}[keyof T];
type NonFunctionProperties<T> = Pick<T, NonFunctionPropertyNames<T>>;
export function toClass<T extends { __type: keyof typeof typeList }>(
  obj: T &
    NonFunctionProperties<
      Omit<InstanceType<typeof typeList[T["__type"]]>, "__id">
    >,
): InstanceType<typeof typeList[T["__type"]]> {
  if ("__type" in obj) {
    const el = new typeList[obj.__type as keyof typeof typeList]() as any;

    Object.keys(obj).forEach((key) => {
      //@ts-expect-error
      const props = obj[key];
      if (Array.isArray(props)) {
        el[key] = props.map(toClass);
      } else if (typeof props === "object") {
        el[key] = toClass(props);
      } else {
        el[key] = props;
      }
    });
    if ("__id" in el === false) {
      el.__id = uuid();
    }
    return el;
  } else {
    return obj;
  }
}

export const SearchComponent = new Component();
SearchComponent.props = [];

const searchText = toClass({
  __type: "InPut",
  name: "searchText",
});
const defaultSearchText = toClass({
  __type: "InPut",
  name: "prop:defaultSearchText",
});

const 搜索API = toClass({ __type: "Transform", name: "搜索API" });

const searchText_V = toClass({
  __type: "OutPut",
  name: "<searchText/>",
});
const emitResultList = toClass({
  __type: "OutPut",
  name: "emit:resultList",
});
const emitSearchText = toClass({
  __type: "OutPut",
  name: "emit:SearchText",
});
const resultList_V = toClass({
  __type: "Component",
  name: "<resultList/>",
  props: [],
  body: [
    toClass({
      __type: "InPut",
      name: "prop:list",
    }),
  ],
});
// const inputBox = newInput();
SearchComponent.body = [
  defaultSearchText,
  searchText,

  搜索API,

  emitResultList,
  emitSearchText,
  searchText_V,
  resultList_V,

  // 下面两条 flow 表示了双向绑定
  toClass({ __type: "Flow", start: defaultSearchText, end: searchText }),
  toClass({ __type: "Flow", start: searchText_V, end: searchText }),
  toClass({ __type: "Flow", start: searchText, end: searchText_V }),

  toClass({ __type: "Flow", start: searchText, end: 搜索API }),
  toClass({ __type: "Flow", start: 搜索API, end: resultList_V }),

  toClass({ __type: "Flow", start: 搜索API, end: emitResultList }),
  toClass({ __type: "Flow", start: searchText_V, end: emitSearchText }),
  // 代表了搜索请求
  // plainToClass({ __type: "Flow", start: searchText, end: inputBox }),
];
