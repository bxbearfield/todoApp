import React, { Component } from 'react';
import FontAwesome from 'react-fontawesome';

import ScrollMonth from './ScrollMonth';

const renderCalendars = props => {
    const months = [
        'January','February','March','April','May','June',
        'July','August','September','October','November','December'
    ]
    return months.map( (month, i) => {
        return (
            <ScrollMonth
                key = { i }
                setMonth = { props.calMonth }
                month = { month }
                monthId = { i }
                selectMonth = { props.selectMonth }
            />
        )
    })
}


class CalScroll extends Component {
    state = {  }
    componentDidMount(){
        this.monthsDiv.scrollTo(0, (new Date().getMonth() +1) * 95);
    }
    render() { 
        const {minusYear, addYear, calYear} = this.props
        return ( 
            <div className='calendarScroll'>
                <div className="yearDiv">
                    <FontAwesome name="caret-left" onClick={minusYear} />
                    { calYear }
                    <FontAwesome name="caret-right"onClick={addYear} />
                </div>
                
                <div className="monthsDiv" ref={(div)=>this.monthsDiv=div} >
                    {renderCalendars(this.props)}
                </div>
            </div>
         );
    }
}
 
// export default CalendarScroll;

 
export default CalScroll;