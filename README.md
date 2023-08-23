## Usage

- react(hooks)
  ` npm  install yoyoo-ddr-react --save`
- vue2
  ` npm  install yoyoo-ddr --save`
- vue3
  ` npm  install yoyoo-ddr-vue3 --save`

## Documents

- [yoyoo-ddr-react](https://github.com/zuimeiaj/yoyoo-ddr)

## Demo

```tsx
// app.tsx
import DDR from 'yoyoo-ddr-react'
import 'yoyoo-ddr-react/dist/style.css'
import { TransformProps } from 'yoyoo-ddr-react/dist/type'
function App() {
  const [transform, setTransform] = useState<TransformProps>({ x: 100, y: 100, width: 100, height: 100, rotation: 0 })
  return (
    <>
      <DDR onChange={(_, t) => setTransform(t)} value={transform} parent={true} grid={[10, 10]}>
        <div style={{ background: 'red', width: '100%', height: '100%' }}>
          x={transform.x},y={transform.y},w={transform.width},h={transform.height},r={transform.rotation}
        </div>
      </DDR>
    </>
  )
}
```
