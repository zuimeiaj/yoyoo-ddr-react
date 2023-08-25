<p align='center'>
  <img style="150px" height="150px" src="https://github.com/zuimeiaj/yoyoo-ddr/blob/master/src/assets/vue-drag-resize-rotate.jpg"/>
</p>

<p align='center'>
Draggable, rotatable and resizable components 
</p>

### [English document](https://github.com/zuimeiaj/yoyoo-ddr/blob/master/ENGLISH-DOC.md)

### 安装-vue 2 [![NPM Version](https://img.shields.io/npm/v/yoyoo-ddr-vue2.svg?style=flat)](https://www.npmjs.com/package/yoyoo-ddr-vue2)

```
npm i yoyoo-ddr-vue2 --save
```

### 安装-vue 3 [![NPM Version](https://img.shields.io/npm/v/yoyoo-ddr-vue3-ts.svg?style=flat)](https://www.npmjs.com/package/yoyoo-ddr-vue3-ts)

```
npm i yoyoo-ddr-vue3-ts --save
```

- 注意：使用 ts 和 vue3.x 重构，之前的 yoyoo-ddr-vue3 是根据 vue2 的语法做了些兼容，不再维护了

### 安装-react [![NPM Version](https://img.shields.io/npm/v/yoyoo-ddr-react.svg?style=flat)](https://www.npmjs.com/package/yoyoo-ddr-react)

```
npm i yoyoo-ddr-react --save
```

### 使用

[Example](https://zuimeiaj.github.io/ddr/#/twowaybind)

```ts
import DDR from 'yoyoo-ddr-vue3-ts'
import 'yoyoo-ddr-vue3-ts/dist/style.css'
import { defineComponent, ref } from 'vue'
import { TransformProps } from './yoyoo-ddr-vue3-ts/dist/type'

export default defineComponent({
  setup() {
    const t = ref<TransformProps>({ x: 100, y: 100, width: 100, height: 100, rotation: 0 })
    return () => {
      return (
        <div style={'width:100%;height:100%'}>
          <DDR
            axis="x"
            minHeight={20}
            minWidth={20}
            maxWidth={200}
            maxHeight={200}
            parent={true}
            grid={[10, 10]}
            v-model:value={t.value}
          >
            <div style={{ width: '100%', height: '100%', background: 'red' }}>
              <div>x= {t.value.x}</div>
              <div>y= {t.value.y}</div>
              <div>w= {t.value.width}</div>
              <div>h= {t.value.height}</div>
            </div>
          </DDR>
          <button onClick={() => (t.value.x += 100)}> to right</button>
        </div>
      )
    }
  },
})
```

### 特色

- 轻量级，无任何依赖
- 可配置拖拽、旋转、缩放、网格对齐、限制父元素内移动、固定坐标轴移动、等比例缩放

### 注意事项

- 容器如果使用了 overflow scroll 也会导致组件拖拽时的位置错误

### 属性

| 名称          | 类型     | 默认值                                    | 描述                                                                                 |
| ------------- | -------- | ----------------------------------------- | ------------------------------------------------------------------------------------ |
| draggable     | boolean  | true                                      | 是否可拖拽                                                                           |
| rotatable     | boolean  | true                                      | 是否可旋转                                                                           |
| resizable     | boolean  | true                                      | 是否可缩放                                                                           |
| active        | boolean  | true                                      | 是否可用，                                                                           |
| acceptRatio   | boolean  | false                                     | 纵横比，单词拼写错误。但是发现太晚了,所以就这样吧                                    |
| parent        | boolean  | false                                     | 限制在父容器内拖拽，支持拖动和缩放，旋转角度大于 0 不会判断                          |
| resizeHandler | Array    | ['tl','tm','tr','r','br','bm','l','bl']   | 定义缩放控制点                                                                       |
| handlerSize   | number   | 11                                        | 定义缩放控制点                                                                       |
| minWidth      | number   | 1                                         | 可缩放的最小宽度                                                                     |
| minHeight     | number   | 1                                         | 可缩放最小高度                                                                       |
| maxWidth      | number   | 100000000                                 | 可缩放最大宽度                                                                       |
| maxHeight     | number   | 100000000                                 | 可缩放最大高度                                                                       |
| value         | Object   | {x:0,y:0,width:100,height:100,rotation:0} | 位置，注意该参数并不是双向绑定的不支持 v-model，但能响应 value 的更新                |
| grid          | Array    | [1,1]                                     | 格式[x,y]，支持拖动和缩放对齐。只能为整数                                            |
| axis          | String   | 'xy'                                      | 指定坐标轴拖动，默认 xy 都可以拖动，仅支持拖动                                       |
| zoom          | Number   | 1                                         | 父容器缩放，当拖拽元素的父元素使用 transform：scale 后，应该同步给此属性             |
| id            | string   | undefined                                 | 数组方式渲染时增加的参数，提高性能                                                   |
| beforeActive  | Function | ()=> false                                | 数组方式渲染时增加的参数，当元素被点击时会调用该函数并传入 id                        |
| renderContent | Function | ()=> VNode                                | 数组方式渲染时增加的参数，用于渲染自定义子节点，如果是单个组件使用直接用 slot 就行了 |
| prevent       | boolean  | true                                      | 是否阻止默认事件，默认为 true                                                        |
| stop          | boolean  | true                                      | 是否阻止事件冒泡，默认为 true                                                        |

### 自定义 class 样式

- 拖动状态： `ddr-ready-drag` 鼠标按下,准备拖动时的 class。`ddr-dragging` 拖动时的 class
- 缩放状态： `ddr-ready-resize` 鼠标按下，准备缩放时的 class。`ddr-resizing` 缩放时的 class
- 旋转状态： `ddr-ready-rotate` 鼠标按下，准备旋转时的 class。`ddr-rotating` 旋转时的 class
- 选中状态： `active` 组件选中时的 class

### 事件

拖拽、旋转、缩放时会触发一系列事件，该事件都会传入两个参数，第一个参数为原始的事件对象，第二个参数为当前组件的位置信息。

| name        | args                          |
| ----------- | ----------------------------- |
| dragstart   | (event,transform)=>{} :void 0 |
| drag        | (event,transform)=>{} :void 0 |
| dragend     | (event,transform)=>{} :void 0 |
| rotatestart | (event,transform)=>{} :void 0 |
| rotate      | (event,transform)=>{} :void 0 |
| rotateend   | (event,transform)=>{} :void 0 |
| resizestart | (event,transform)=>{} :void 0 |
| resize      | (event,transform)=>{} :void 0 |
| resizeend   | (event,transform)=>{} :void 0 |

### 链接

- [在线演示](https://zuimeiaj.github.io/ddr/)

- [更新日志](https://github.com/zuimeiaj/yoyoo-ddr/blob/master/CHANGELOG.md)

### 联系我

如果在使用该组件时遇到问题，可以加 QQ(2498683974)联系我。欢迎提出宝贵意见和建议

### License

The MIT License (MIT). Please see [License File](https://github.com/zuimeiaj/yoyoo-ddr/blob/master/LICENSE) for more information.
