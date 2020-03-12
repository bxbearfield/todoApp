import React from 'react';


const deleteListAlert = ({clickedDate, deleteTaskList, hideAlert, title }) =>  {
    const { day, month, year} = clickedDate;
    return (
        <div className="alertModal">
            <div className="alertBox">
                <div className="alertMsg">
                    {`Delete task list ` +
                    `'${title}' - ${month+1}/${day}/${year}?`}
                </div>

                <div className="dbButtons">
                    <button 
                        type="button" 
                        onClick = { hideAlert }
                    > 
                        Cancel 
                    </button>

                    <button 
                        type="button" 
                        onClick = { deleteTaskList }
                    > 
                        Ok
                    </button> 
                </div>
                  
            
            </div>
        </div> 
    );
}
 
export default deleteListAlert;