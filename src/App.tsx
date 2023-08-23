
import { useState } from 'react'
import './App.css'
import DDR from './components/ddr'
import { TransformProps } from './components/ddr/type'

function App() {
  const [transform,setTransform]=useState<TransformProps>({x:100,y:100,width:100,height:100,rotation:0})
  return (
    <>
      <DDR  onChange={(_,t)=> setTransform(t)} value={transform} parent={true} grid={[10,10]} >
        <div style={{ background: 'red', width: '100%', height: '100%' }}>
          x={transform.x},y={transform.y},w={transform.width},h={transform.height},r={transform.rotation}
        </div>
      </DDR>
    
      
    </>
  )
}

export default App
