import React, { Component } from 'react';


class deleteRepAlert extends Component {
    state = { 
        radioValue: 'all'
     }

     updateRadio = radioValue => {
         this.setState({ radioValue });
     }

    render() { 
        const 
            {hideAlert, deleteTaskList } = this.props,
            {radioValue} = this.state;
        return (
            <div className="alertModal">
                 <div className="alertBox">
                    <div className="alertMsg">
                        Delete recurring tasks?
                    </div>
                    <div>
                        <input 
                            defaultChecked 
                            onChange={ e => 
                                this.updateRadio(e.target.value)} 
                            type="radio" name="alert" value="all" 
                        /> All <br></br>

                        <input 
                            type="radio" name="alert" value="endDate" 
                            onChange={ e => 
                                this.updateRadio(e.target.value)}
                        /> This date forward <br></br>

                    </div>

                    <div className="dbButtons">
                        <button type="button" onClick = { hideAlert }> 
                            Cancel 
                        </button>

                        <button 
                            type="button" 
                            onClick = {() => deleteTaskList(radioValue)}
                        >
                            Delete 
                        </button>  
                    </div>
                     
                
                </div>
            </div> 
        );
    }
}
 
export default deleteRepAlert;