import React from 'react';


const exitAlert = ({exitUpdate, clickedDate: {month, day, year}, title, hideExitAlert }) =>  {
    return (
        <div className="alertModal">
            <div className="alertBox">
                <div className="alertMsg">
                    {`Leave task list ` +
                        `'${title}' - ${month+1}/${day}/${year} without saving?`}
                </div>

                <div className="dbButtons">
                    <button 
                        type="button" 
                        onClick = { hideExitAlert }
                    > 
                        Cancel 
                    </button>

                    <button 
                        type="button" 
                        onClick = { exitUpdate }
                    > 
                        Continue
                    </button> 
                </div>
                  
            
            </div>
        </div> 
    );
}
 
export default exitAlert;