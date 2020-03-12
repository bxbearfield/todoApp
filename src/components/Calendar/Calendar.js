import React from 'react';
import '../taskitem/taskitem.scss';

import CalendarDate from './CalendarDate';


const renderCalendar = props => {
    let weekdays = ['Sunday', 'Monday', 'Tuesday', 
        'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    let days = weekdays.map( weekday => {
        return (
            <div key={weekday} className="weekday">
                { weekday }
            </div>
        )
    });
    let { calMonth, calYear, clickedDate, selectDate, updateTasks, updatePane, listKey, user} = props,

    // # of days in set month
    monthLen = new Date(calYear, calMonth + 1, 0).getDate(),

    // Day Sun-Sat set month begins
    firstDay = new Date(calYear, calMonth, 1).getDay(),

    // # of days in month before set month
    lastMonLen = new Date(calYear, calMonth, 0).getDate(),

    boxes = [...days],
    numBoxes = firstDay + monthLen > 35 ? 44 : 37,
    // Counters
    i = 0, 
    j = 1, 
    m = 1,
    l = lastMonLen - firstDay + 1;
     
    for (i; i < numBoxes; i++) {
        // Show box with date vs inactive date based 
        // on day of the week the month starts.
        if (i >= firstDay && j <= monthLen){
            boxes.push(
                <CalendarDate
                    key = { `${calYear}/${calMonth}/${j}` }
                    id = { i }
                    day = { j }
                    calMonth = { calMonth }
                    calYear = { calYear }
                    clickedDate = { clickedDate }
                    selectDate = { selectDate }
                    updateTasks = { updateTasks }
                    updatePane = { updatePane }
                    user = { user }
                    listKey = { listKey }
                />
            ); j++ 
        } else if (i < firstDay) {
            boxes.push(
                <div key={i} className="calPadding">
                    { l }
                </div>
            ); l++
        } else if (i > monthLen + firstDay + 1) {
            boxes.push(
                <div key={i} className="calPadding">
                    { m }
                </div>
            ); m++
        }    
    }
    return boxes;
}

const TaskCalendar = props => { 
    
    return (
        <div className="calendar">
            <div className="dates">
                { renderCalendar(props) }
            </div> 
        </div>
    );
    
}
 
export default TaskCalendar;