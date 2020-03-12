import React, {Component} from 'react';
import { firebaseDB } from '../../firebase';

import FontAwesome from 'react-fontawesome';

class CalendarDate extends Component {
    state = { 
        taskLists: [],
        repeatLists: []
    }
    
    componentWillMount() {
        //Two DB listeners for changes to repeated lists and for individual lists
        const { calYear, calMonth, day, user } = this.props;
        const weekday = ['Sunday', 'Monday', 'Tuesday', 
        'Wednesday', 'Thursday', 'Friday', 'Saturday'][new Date(calYear, calMonth, day).getDay()];
        const ref1 = firebaseDB.ref(`users/${user}/repeat`);
        const ref2 = firebaseDB.ref(`users/${user}/${calYear}/${calMonth}/${day}`);

        ref1.on('value', snapshot => {
            let repeatListDB = snapshot.val();
            const repeatLists = []; 
            for (let key in repeatListDB) {
                if (
                    key === calMonth || 
                    key === day + '' || 
                    key === weekday ||
                    key === 'all' ||
                    (
                        key === 'weekend' && 
                        (
                            weekday === 'Saturday' || 
                            weekday === 'Sunday' 
                        )
                    ) ||
                    (
                        key === 'weekday' && 
                        (
                            weekday === 'Monday' || 
                            weekday === 'Tuesday' ||
                            weekday === 'Wednesday' ||
                            weekday === 'Thursday' ||
                            weekday === 'Friday'
                        )
                    )) {
                    for (let list in repeatListDB[key]) {
                        repeatLists.push({
                            id: list,
                            title: repeatListDB[key][list].title,
                            tasks: repeatListDB[key][list].tasks,
                            start: repeatListDB[key][list].start,
                            end: repeatListDB[key][list].end,
                            repeat: key
                        });
                    }
                }
            };
            setTimeout(()=>this.setState({ repeatLists }), 0);
        });

        ref2.on('value', snapshot => {
            let 
                taskLists = [],
                taskListsDB = snapshot.val(),
                list;
            for (list in taskListsDB) {
                taskLists.push({
                    id: list,
                    title: taskListsDB[list].title,
                    tasks: taskListsDB[list].tasks
                });
            };
            setTimeout(()=>this.setState({ taskLists }), 0);
        });
    }
    
    renderTaskListIcons = () => {
        const 
            { calYear: year, calMonth: month, day, listKey } = this.props,
            {taskLists, repeatLists} = this.state,
            totalLists = [...repeatLists, ...taskLists]
        ;
        
        return totalLists.filter( list => {
            const 
                { start, end } = list,
                startRep = start ? 
                    new Date(...start).valueOf() : 0,
                endRep = end ? 
                    new Date(...end).valueOf() : false,
                dateShown = new Date(year, month, day).valueOf()
            ;
            return list !== null && 
                dateShown >= startRep &&
                (dateShown < endRep || !endRep)})
            .map((list, i)=>{
                const {clickedDate: {
                    day: clickDay, 
                    month: clickMonth, 
                    year: clickYear
                }} = this.props;   
                const clickedList = 
                    listKey === list.id && 
                    clickDay === day &&
                    clickMonth === month &&
                    clickYear === year  ? 
                        'clickedList' : '';
                return (
                    <div 
                        className = {`listTitle`}
                        key = { i } 
                        onClick = { e => {
                            const { tasks, id, title, repeat } = list;
                            e.stopPropagation(); 
                            this.props.updateTasks(tasks, { day, month, year}, id, title, repeat);
                        }}
                    >
                        <FontAwesome name="clipboard" className = {clickedList} />
                        {` - ${list.title}`}
                    </div>
                )
            })
    }

    render() { 
        const {
            clickedDate: {
                day: clickDay, 
                month: clickMonth, 
                year: clickYear
            }, 
            calYear, 
            calMonth, 
            day
        } = this.props,
        selectedDate = clickDay === day &&
            clickMonth === calMonth &&
            clickYear === calYear ? 
            'selectedDate' : '',
        todaysDate = calMonth === new Date().getMonth() && 
            day === new Date().getDate() &&
            calYear === new Date().getFullYear() ? 
            'todaysDate' : '';

        return ( 
            <div  
                className = {`dateDiv ${selectedDate}`} 
                onClick = {() => {
                    const year = calYear, month = calMonth; 
                    this.props.updateTasks([],{ day, month, year}, '', '','')
                }}
                tabIndex = "0"
            >
                <div className = {todaysDate}>
                    { day }
                </div>
                
                { this.state.taskLists ? 
                    this.renderTaskListIcons() : ''  
                }
            </div>
        );
    }
}
 
export default CalendarDate;