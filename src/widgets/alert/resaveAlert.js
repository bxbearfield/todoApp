import React from 'react';


const resaveAlert = ({
    callDatabase, 
    clickedDate, 
    hideAlert,  
    repeatKey, 
    title }) =>  {
    const { month, day, year} = clickedDate;
    return (
        <div className="alertModal">
            <div className="alertBox">
                <div className="alertMsg">
                    {repeatKey ? 
                        `Save changes to all repeating task list(s) ` +
                            `'${title}'?`
                        :
                        `Save changes to task list ` +
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
                        onClick = { ()=>callDatabase('') }
                    > 
                        Save 
                    </button> 
                </div>
            </div>
        </div> 
    );
}
 
export default resaveAlert;