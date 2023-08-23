import { DDRProps } from "./type"
import { useDDRBehavior } from "./behavior"
import  './index.style.less';

const DDR = (initProps: Partial<DDRProps>) => { 
    
    const { setMouseDownHandler, behavior, domWrapper } = useDDRBehavior(initProps)

    
    // 使用经过默认值处理的props
    const props = behavior.options.props

   
    return <div ref={domWrapper} className={behavior.getClassNames()} style={behavior.getNewStyle()} onTouchStart={setMouseDownHandler as any} onMouseDown={setMouseDownHandler as any}>
        
        {initProps.children}

        {
            props.resizable &&  <div className='resize-handler-wrapper'>
            {props.resizeHandler.map((item) => {
              return <span data-resizetype={item} key={item} style={behavior.getNewHandler(item)} className={`resize-handler ${item}`} />;
            })}
                
          </div>
        }

        {props.rotatable && <span style={behavior.getRotateHandler()} data-type='rotate' className='rotate-handler' />}
    </div>
}

export default DDR