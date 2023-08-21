import { MouseEvent } from "react"
import { DDRProps } from "./type"

const DDR = (props: Partial<DDRProps>) => { 
    
    props.acceptRatio
    function onClick(event: MouseEvent) { 
       event.clientX
    }
    return <div onClick={onClick }></div>
}

export default DDR