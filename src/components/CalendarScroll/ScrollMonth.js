import React from 'react';
import FontAwesome from 'react-fontawesome';



const ScrollMonth = props => {
    const {setMonth, monthId, selectMonth, month} = props;
    return ( 
        <div 
            className= {`monthDiv ${setMonth === monthId ? 'selectedMonth' : ''}`}  
            onClick= {() => selectMonth(monthId)} 
            tabIndex= "0"
        >
            <div>{ month }</div>
            <div><FontAwesome name='calendar' /></div>
        </div>
    );

}
 
export default ScrollMonth;