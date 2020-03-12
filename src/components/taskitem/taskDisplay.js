import React from 'react';
import './taskitem.scss';
import FontAwesome from 'react-fontawesome';



const  taskDisplay = ({completeTask, active, task, minutes, hours, id}) => {

    return ( 
        <React.Fragment key={id}>
                        
            {/* CIRCLE/CHECK ICON  */}
            <div 
                className="checkIcon" 
                onClick={() => completeTask(id)}
            > 
                <FontAwesome name="circle-thin" />
                {active ? 
                    ''
                    : 
                    <div className="taskCheck">
                        <FontAwesome name="check" />
                    </div>
                }
            </div>
            
            {/* TASK TEXT */}
            <div className={`
                    displayDiv 
                    ${active ? '':'inactiveText'}`
                } >
                    <div className='displayText'> 
                        {task}
                    </div>
                </div>

            {/* TASK TIME */}
            <div 
                className={`
                    taskTime 
                    ${active ? '':'inactiveText'}
                `}
            >   {/* If hours or mins empty pad w/ 0s */}
                { !hours && minutes ? '0': <span className='hoursSpan'>{hours}</span> }
                { hours || minutes ? <span>:</span> : '' }
                { !minutes && hours ? '00' : <span>{minutes}</span> }
            </div>
        </React.Fragment>
);
}
 
export default  taskDisplay;