import React, { Component } from 'react';


class alert extends Component {
    state = { 
        radioValue: 'once',
        weekdays: [
            'Sunday', 
            'Monday', 
            'Tuesday', 
            'Wednesday', 
            'Thursday', 
            'Friday', 
            'Saturday'
        ]
     }

     updateRadio = radioValue => {
         this.setState({ radioValue });
     }

    render() { 
        const 
            { 
                callDatabase, 
                hideAlert,
                clickedDate: {
                    day, 
                    month, 
                    year 
                } 
            } = this.props,

            { 
                radioValue, 
                weekdays 
            } = this.state,
            attrs = {
                type: "radio", 
                name: "alert", 
                onChange: e => this.updateRadio(e.target.value)
            },
            getMonth = new Date(month).getMonth(),
            weekday = weekdays[new Date(year, month, day).getDay()]
        ;
        return (
            <div className="alertModal">
                 <div className="alertBox">
                    <div className="alertMsg">
                        Save changes to task list?
                    </div>

                    <div>
                        <input {...attrs} value="once" defaultChecked /> Current date <br></br>
                        <div>or Every:</div>
                        <input {...attrs} value="all"/> Day <br></br>
                        <input {...attrs} value={weekday}/> Week <br></br>
                        <input {...attrs} value="weekday"/> Weekday <br></br>
                        <input {...attrs} value="weekend"/> Weekend <br></br>
                        <input {...attrs} value={day}/> Month <br></br>
                        <input {...attrs} value={getMonth}/> Year <br></br>
                    </div>

                  
                    <div className="dbButtons">
                        <button type="button" onClick = { hideAlert }>Cancel</button>
                        <button type="button" onClick = { () => callDatabase(radioValue) }> Save </button>   
                    </div>
                </div>
            </div> 
        );
    }
}
 
export default alert;
