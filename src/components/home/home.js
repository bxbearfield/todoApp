import React, { Component } from 'react';

// COMPONENTS
import CalendarScroll from '../CalendarScroll/CalendarScroll';
import TaskList from '../tasklist/tasklist';
import Calendar from '../Calendar/Calendar';

// CSS, FONTAWESOME
import  '../taskitem/taskitem.scss';
import FontAwesome from 'react-fontawesome';


class Home extends Component {
    //State holds current mm/yyyy and clicked mm/dd/yyyy
    state = { 
        showTaskList: false,
        saved: true,
        exitList: false,
        tasks: [],
        listKey: '',
        repeatKey: '',
        title: '',
        calYear: new Date().getFullYear(),
        calMonth: new Date().getMonth(),
        clickedDate: {
            day: new Date().getDate(),
            month:  new Date().getMonth(),
            year: new Date().getFullYear()
        },
        clickedList:{
            clickedDate:{},
            tasks: [],
            listKey: '',
            repeatKey: '',
            title: ''
        }
    }

    addYear = () => {
        let { calYear } = this.state;
        this.setState({ calYear: ++calYear});
    }

    minusYear = () => {
        let { calYear } = this.state;
        this.setState({ calYear: --calYear });
    }

    selectMonth = calMonth => {
        this.setState({ calMonth });
    }

    updateTasks = (tasks= [], clickedDate = {}, listKey='', title='', repeatKey='') => {
       const {
           saved, 
           listKey: currKey, 
           clickedDate: currDate} = this.state,
           sameDate = 
                JSON.stringify(clickedDate) === 
                JSON.stringify(currDate),
            sameLists = listKey === currKey;

        if (!saved && (!sameLists || !sameDate)) {
            //Only show exit box if other list or other date clicked
            this.setState({ 
                exitList: true, 
                clickedList: { 
                    clickedDate,
                    tasks,
                    listKey,
                    repeatKey,
                    title
                } 
            });
        }
        else if (
            (!sameLists && saved) || 
            (sameLists && !sameDate && saved)){
            return this.updatebyDB(tasks, clickedDate, listKey, title, repeatKey)
        }
    }

    updatebyDB = (tasks, clickedDate, listKey, title, repeatKey) => {
        this.setState({ 
            tasks,
            listKey, 
            title,
            showTaskList: tasks.length ? true : false, 
            clickedDate, 
            saved: true,
            repeatKey,
            clickedList: {...this.state.clickedList, 
                clickedDate: {}
            }

        }) 
    }

    exitUpdate = () => {
        let {
            tasks, clickedDate, listKey, 
            title, repeatKey
        } = this.state.clickedList;
        this.setState({ 
            tasks,
            listKey, 
            title,
            showTaskList:  tasks.length ? true : false, 
            clickedDate: clickedDate.month ? 
                clickedDate : {...this.state.clickedDate}, 
            saved: true,
            repeatKey,
            exitList: false
        }); 
    }

    unsaveTaskList = () => {
       this.setState({ saved: false })
    }
    saveTaskList = () => {
        this.setState({ saved: true })
     }

    hideTaskList = () => {
        this.setState({
            showTaskList: false,
            tasks: [],
            listKey: '',
            title: '' 
        });
    }
    
    hideExitAlert = () => {
        this.setState({ exitList: false  });
    }

    taskPane = () => {
        const { 
            showTaskList, 
            tasks, 
            listKey,
            title,
            saved, 
            repeatKey,
            exitList,
            clickedDate, 
            clickedDate: {day,month,year}} = this.state;

        return showTaskList ? 
            <TaskList
                tasks = { tasks }
                listKey = { listKey  }
                title = { title }
                saved = { saved }
                user = { this.props.user.uid }
                repeatKey = { repeatKey }
                exitList = { exitList }
                clickedDate = { clickedDate }
                unsaveTaskList = { this.unsaveTaskList }
                saveTaskList = { this.saveTaskList }
                updateDB = { this.updatebyDB }
                exitUpdate = { this.exitUpdate }
                hideTaskList = { this.hideTaskList }
                hideExitAlert = { this.hideExitAlert }
            /> 
            :
            <div className="landingPane">
                <div> Create New Tasklist </div>
                <div> 
                    {`${month + 1}/${day}/${year}`} 
                </div>
                <FontAwesome name="plus" 
                    onClick={ e => {
                        e.stopPropagation(); 
                        this.setState({ showTaskList: true });
                    }}
                />
            </div>

    }
   render() {
       const {
           calYear, 
           calMonth,
           clickedDate,
           listKey
        } = this.state;
       return(
           <div className='home'> 
                <CalendarScroll 
                    calYear = { calYear }
                    calMonth = { calMonth }
                    selectMonth = { this.selectMonth }
                    addYear = { this.addYear }
                    minusYear = { this.minusYear }
                />
                <div className="flexTaskCal">
                    <div className="todoWrapper">
                        { this.taskPane() }
                    </div>
                    <Calendar
                        calYear = { calYear }
                        calMonth = { calMonth }
                        listKey = { listKey }
                        clickedDate = { clickedDate }
                        selectDate = { this.selectDate }
                        updateTasks = { this.updateTasks }
                        updatePane = { this.updatePane }
                        user = { this.props.user.uid }
                    />
                </div>
           </div>
            
        )
    }
}
export default Home;
