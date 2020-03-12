import React, { Component } from 'react';
import FontAwesome from 'react-fontawesome';

//DATABASE
import { firebaseDB } from '../../firebase';

//COMPONENTS
import TaskItem from '../taskitem/taskitem';
import TaskManager from '../taskManager/taskManager';
import FormField from '../../widgets/forms/FormFields';
import AddUser from '../addUser/addUser';
import Alert from '../../widgets/alert/alert';
import DeleteRepAlert from '../../widgets/alert/deleteRepAlert';
import DeleteListAlert from '../../widgets/alert/deleteListAlert';
import ResaveAlert from '../../widgets/alert/resaveAlert';
import ExitAlert from '../../widgets/alert/exitAlert';

//CSS
import  '../taskitem/taskitem.scss';

class TaskList extends Component {

    state = {
        tasks: this.props.tasks,
        filteredTasks: 'all',
        users: [],
        allUsers: [],
        show_SaveAlert: false,
        show_DeleteListAlert: false,
        show_DeleteRepAlert: false,
        show_ResaveAlert: false,
        formData: {
            title: {
                element:'textarea',
                value: this.props.title || 'things to do...',
                containerConfig: {
                    className: 'taskText editTaskWrapper'
                },
                config:{
                    className: 'textAlignCenter',
                    maxLength: '60',
                    spellCheck: false,
                    placeholder: '"create a title"'
                }
            },
            task:{
                element:'input',
                value: '',
                containerConfig: {
                    className: 'taskInputDiv'
                },
                config:{
                    className:'taskInput',
                    type:'text',
                    placeholder:'I need to...',
                    autoFocus: true,
                    onKeyUp: e => {
                        if (e.keyCode === 13) {
                            this.submitTaskForm()
                        }
                    }
                }
            },
            hours:{
                element:'select',
                value: '',
                containerConfig: {
                    className: 'hoursDiv'
                },
                config:{
                    className:'hours',
                    //Fontawesome unicode works
                    // mostly with standard icons
                    placeholder:'\uf017', 
                    options: () => { 
                        // Returns 0-12 array with padding
                        let hours = [];
                        for (let i = 1; i <= 12; i++) {
                            let hour = '' + i;
                            hours.push(hour);
                        }
                        return hours
                    }
                }
            },
            minutes:{
                element:'select',
                value: '',
                containerConfig: {
                    className: 'minutesDiv'
                },
                config:{
                    className:'minutes',
                    //Fontawesome unicode works 
                    //mostly with standard icons
                    placeholder:'\uf017', 
                    options: () => { 
                        // Returns 0-59 array with padding
                        let minutes = [];
                        for (let i = 0; i < 60; i++) {
                            let minute = '' + i;
                            while (minute.length < 2){
                                minute = '0' + minute;
                            }
                            minutes.push(minute);
                        }
                        return minutes
                    }    
                }
            }
        }
    }
 // ---------------------------------------------  TASK EDIT ------------------------------------------------>
    submitTaskForm = () => {
        let 
            {
                formData: {
                    task: {value: task}, 
                    hours: {value: hours}, 
                    minutes: {value: minutes}
                }, 
                users 
            } = this.state,
            rendoNum = Math.random() * Math.random()
        ;

        if(task.trim().length) {
            this.setState({
                tasks: [...this.state.tasks,
                    {
                        id: rendoNum,
                        task,
                        hours,
                        minutes,
                        users, 
                        active: true,
                        focused: false,
                        edit: false
                    }
                ]
            });
            this.clearFields();
        } 
    }

    clearFields = () => {
        let { formData } = this.state;
        this.setState({ 
            formData: {...formData, 
                task: {...formData.task, value: ''},
                hours: {...formData.hours, value: ''},
                minutes: {...formData.minutes, value: ''}
            } 
        });
    }
    
    removeTask = i => {
       let tasks = JSON.parse(JSON.stringify(this.state.tasks));
       tasks.splice(i, 1);
       setTimeout(() => this.setState({ tasks }), 0); 
    }
     
    completeTask = id => {
        // Add check if task active, remove check if task not active
        let tasks = JSON.parse(JSON.stringify(this.state.tasks));
        tasks[id].active = tasks[id].active ? false : true; 
        setTimeout(() => this.setState({ tasks }),0)
    }

    componentWillReceiveProps (nextProps){
        let {formData} = this.state,
            {tasks, title} = nextProps;

        // If task list unsaved do not 
        // update prop values in state
        if (nextProps.saved){
            return this.setState({ 
                tasks,
                formData: {...formData,
                    title: {...formData.title, 
                        value: title || 'things to do...'}
                }

            })
        }
    }

    componentDidUpdate(prevProps,prevState) {
        const 
            { 
                clickedDate,
                listKey, 
                saved,  
                saveTaskList, 
                tasks: origTasks,
                unsaveTaskList 
            } = this.props,
            { 
                tasks, 
                formData: {
                    title: {
                        value: title
                    }
                } 
            } = this.state,
            {
                tasks: prevTasks, 
                formData: { 
                    title: {
                        value: prevTitle
                    }
                } 
            } = prevState,
            sameDate = 
                JSON.stringify(prevProps.clickedDate)===
                JSON.stringify(clickedDate),
            sameList = prevProps.listKey === listKey 
        ;
            
        let unequalLists = ()=> {
            // Compares 5 keys of two arrays of objects
            if (tasks.length === prevTasks.length) {
                return prevTasks.some( (prevTask, i) => {
                    let currTask = tasks[i];
                    let reqProps = 
                        ['task', 'minutes', 'hours', 'users', 'active'];

                    return reqProps.some( reqProp => (
                        JSON.stringify(prevTask[reqProp]) !== 
                        JSON.stringify(currTask[reqProp])
                    )
                )
            })} else if (tasks.length !== prevTasks.length) {return true}
        }
        let originalList = ()=> {
            // Checks if list is back to saved list
            if (tasks.length === origTasks.length) {
                return origTasks.every( (origTask, i) => {
                        let currTask = tasks[i];
                        let reqProps = 
                            ['task', 'minutes', 'hours', 'users', 'active'];

                        return reqProps.every( reqProp => (
                            JSON.stringify(origTask[reqProp]) === 
                            JSON.stringify(currTask[reqProp])
                        ))
                    })
                }
            }
        ;
        if (saved && //Do not unsave if unsaved
            (sameList && sameDate) &&
            (unequalLists() || prevTitle !== title)) {
                unsaveTaskList();
        } else if (!saved && originalList() && this.props.title === title ){
            saveTaskList();
        }
    }
 // --------------------------------------  DATABASE Requests: Save/Delete ------------------------------------------------>
    callDatabase = radioVal => {
        const
            {  
                clickedDate,
                listKey,
                repeatKey,
                updateDB,  
                user  
            } = this.props, 
            {  
                day, 
                month,
                year
            } = clickedDate,
            { 
                allUsers,
                tasks,  
                formData: {
                    title: {
                        value: title
                    }
                }
            } = this.state,
            id = listKey || firebaseDB.ref().push().key
        ;
        if (radioVal !== '' && radioVal !== "once") {
            firebaseDB.ref(`users/${user}/repeat/${radioVal}`).push()
            .set({
                title,
                allUsers,
                tasks,
                repeat: true,
                start: [ year, month, day ],
                end: ''
            });
        } else if (repeatKey) {
            firebaseDB.ref(`users/${user}/repeat/${repeatKey}/${listKey}`)
            .update({
                title,
                allUsers,
                tasks
            });
        } else {
            firebaseDB.ref(`users/${user}/${year}/${month}/${day}/${id}`)
            .set({
                title,
                allUsers,
                tasks
            });
        }
        setTimeout(()=> {updateDB(tasks, clickedDate, listKey, title)}, 0);
        this.hideAlert();
    }

    deleteTaskList = radioVal => {
        const 
            { year, month, day } = this.props.clickedDate,
            { listKey, hideTaskList, repeatKey, user, exitUpdate } = this.props,
            { show_DeleteRepAlert, show_DeleteListAlert } = this.state
        ;
        if (show_DeleteListAlert) {
            if (listKey) {
                firebaseDB
                .ref(`users/${user}/${year}/${month}/${day}/${listKey}`)
                .set(null);
            } else {
                exitUpdate();
            }
        }
        else if (show_DeleteRepAlert) {
            if (radioVal === 'all'){
                firebaseDB
                .ref(`users/${user}/repeat/${repeatKey}/${listKey}`)
                .set(null);
            } else if (radioVal === 'endDate') {
                firebaseDB
                .ref(`users/${user}/repeat/${repeatKey}/${listKey}/end`)
                .set([year, month, day]);
            }
        } 
        hideTaskList();
    }
 // ----------------------------------------------  Alerts -------------------------------------------------------->

    show_SaveAlert = () =>{
        this.setState({ show_SaveAlert: true });
    }

    show_DeleteListAlert = () =>{
        this.setState({ show_DeleteListAlert: true });
    }

    show_DeleteRepAlert = () =>{
        this.setState({ show_DeleteRepAlert: true });
    }
    
    show_ResaveAlert = () =>{
        this.setState({ show_ResaveAlert: true });
    }

    hideAlert = () => {
        this.setState({ 
            show_DeleteListAlert: false,
            show_DeleteRepAlert: false,
            show_ResaveAlert: false,
            show_SaveAlert: false
        });
    }
    
    alert = () =>{
        let { 
                show_DeleteListAlert, 
                show_DeleteRepAlert, 
                show_SaveAlert, 
                show_ResaveAlert, 
                formData: {title: {value: title}}
            } = this.state,
            {
                clickedDate, 
                exitList, 
                exitUpdate, 
                hideExitAlert, 
                repeatKey
            } = this.props;

        if (show_SaveAlert){
           return <Alert 
                callDatabase = { this.callDatabase }
                clickedDate = { clickedDate }
                hideAlert = { this.hideAlert }
            />
        } else if (show_ResaveAlert){
            return <ResaveAlert 
                clickedDate = { clickedDate }
                title = { title }
                repeatKey = { repeatKey }
                hideAlert = { this.hideAlert }
                callDatabase = { this.callDatabase }
            />
        } else if (show_DeleteRepAlert){
            return <DeleteRepAlert 
                clickedDate = { clickedDate }
                repeatKey = { repeatKey }
                hideAlert = { this.hideAlert }
                deleteTaskList = { this.deleteTaskList }
            />
        } else if (exitList){
            return <ExitAlert 
                clickedDate = { clickedDate }
                exitUpdate = { exitUpdate }
                hideExitAlert = { hideExitAlert }
                title = { title }
                callDatabase = { this.callDatabase }
            />
        } else if (show_DeleteListAlert){
            return <DeleteListAlert
                clickedDate = { clickedDate }
                title = { title }
                hideAlert = { this.hideAlert }
                callDatabase = { this.callDatabase }
                deleteTaskList = { this.deleteTaskList }
            />
        }
    }

   // --------------------------------  TASK MANAGER BOTTOM BAR ------------------------------------------------> 
    filterTasks = filter => {
        this.setState({
            filteredTasks: filter
        })
    }

    showTaskManager = () => {
        return ( this.state.tasks.length ? 
            <TaskManager 
                saved= { this.props.saved }
                listKey = { this.props.listKey }
                filterTasks = { this.filterTasks } 
                showCompleteOption = { this.showCompleteOption }
                showActiveOption = { this.showActiveOption }
                show_SaveAlert = { this.show_SaveAlert }
                show_DeleteRepAlert = { this.show_DeleteRepAlert }
                show_ResaveAlert = { this.show_ResaveAlert }
                show_DeleteListAlert = { this.show_DeleteListAlert}
                repeatKey = { this.props.repeatKey || false }
            /> 
            : 
            ""
        )
    }

    showCompleteOption = () => { 
        return this.state.tasks.some( task => {
            return !task.active
        })
    }

    showActiveOption = () => { 
        return this.state.tasks.some( task => {
            return task.active
        })
    }
     // --------------------------------  DRAG AND DROP ------------------------------------------------------------> 

    dragDrop = (droppedItem, droppedOnId) => {
        let drugTask; 
        let tasks = JSON.parse(JSON.stringify(this.state.tasks));
        setTimeout( () => {drugTask = tasks.splice(droppedItem, 1)}, 20);
        setTimeout( () => {tasks.splice(droppedOnId, 0, drugTask[0])}, 25);
        setTimeout( () => {this.setState({ tasks });},30);  
    }
     // --------------------------------  Task FORM Fxs --------------------------------------------------------------------> 

    updateForm = (newValue, field) => { 
        // Update formData state from controlled form
        let formData = this.state.formData;
        this.setState({ 
            formData: { ...formData,
                [field]: {...formData[field],
                    value: newValue
                }
            } 
        });
    }
    
    updateTask = (newValue, id, formField) =>{
        // Save edited updates to state tasks
        let tasks = JSON.parse(JSON.stringify(this.state.tasks));
        tasks[id][formField] = newValue;
        setTimeout(()=>this.setState({ tasks }),0);
    }

    addUsers = users => {
        // Add selected user(s) from user 
        // dropdown box to users state
        this.setState({ users });
    }

    updateAllUsers = newUsers => {
        //To show remaining users available to add to task
        this.setState({ allUsers: newUsers });
    }
    addMoreUsers = (taskId, newUser) => {
        // Add additional users to existing task
        let tasks = JSON.parse(JSON.stringify(this.state.tasks));
        let users = tasks[taskId].users;
        users ?
            tasks[taskId].users.push(newUser)
            :
            tasks[taskId].users = [newUser];
        tasks[taskId].users.sort((a,b)=>(
            a.name.toUpperCase() < b.name.toUpperCase() ? -1 : 1
        ))
        this.setState({ tasks });
    }
    removeAssignedUser = (taskId, userId) => {
        //Removes user from specific task
        let tasks = JSON.parse(JSON.stringify(this.state.tasks));
        tasks[taskId].users.splice(userId, 1);
        setTimeout(()=>this.setState({ tasks }),0);
    }

    focusedIn = id => {
        let tasks = JSON.parse(JSON.stringify(this.state.tasks));
        tasks.map((task,i)=>{
            return (
                i === id ? task.focused = true : task.focused = false, 
                i !== id ? task.edit = false : ''
            )
        })
        this.setState({ tasks });
    }

    editTask = id => {
        let tasks = JSON.parse(JSON.stringify(this.state.tasks));
        tasks.map( (task,i) => {
            return i === id ? 
                task.edit ? task.edit = false : task.edit = true
                :
                task.edit = false;
        })
        setTimeout(()=>this.setState({ tasks }),0);
    }
    
    

    render() {
        // Filters for Task Manager
        let allTasks;
        if (this.state.filteredTasks === 'all') {
             allTasks = this.state.tasks.map( (task, i) => {
                return(
                    <TaskItem 
                        key = { task.id } 
                        id = { i }
                        taskObj = { task }
                        dragDrop = { this.dragDrop }
                        editTask = { this.editTask }
                        removeTask = { this.removeTask }
                        completeTask = { this.completeTask }
                        allUsers = { this.state.allUsers }
                        addMoreUsers = { this.addMoreUsers }
                        focusedIn = { this.focusedIn }
                        updateTask = { this.updateTask }
                        removeAssignedUser = { this.removeAssignedUser }
                    />
                )
            })}
        else if (this.state.filteredTasks === 'active') {
            allTasks = this.state.tasks.reduce((activeTasks, task, i)=> {
                //Reduce accepts array name as first argument
                if (task.active) {
                    activeTasks.push(
                        <TaskItem 
                            key = { task.id } 
                            id = { i }
                            taskObj = { task }
                            dragDrop = { this.dragDrop }
                            editTask = { this.editTask }
                            removeTask = { this.removeTask }
                            completeTask = { this.completeTask }
                            allUsers = { this.state.allUsers }
                            addMoreUsers = { this.addMoreUsers }
                            focusedIn = { this.focusedIn }
                            updateTask = { this.updateTask }
                            removeAssignedUser = { this.removeAssignedUser }
                        />
                    )
                }
                return activeTasks;
            },[]);
        }
        else if (this.state.filteredTasks === 'inactive') {
            allTasks = this.state.tasks.reduce( (inactiveTasks, task, i) => {
                if (!task.active) {
                    inactiveTasks.push(
                        <TaskItem 
                            key = { task.id } 
                            id = { i }
                            taskObj = { task }
                            dragDrop = { this.dragDrop }
                            editTask = { this.editTask }
                            removeTask = { this.removeTask }
                            completeTask = { this.completeTask }
                            allUsers = { this.state.allUsers }
                            addMoreUsers = { this.addMoreUsers }
                            focusedIn = { this.focusedIn }
                            updateTask = { this.updateTask }
                            removeAssignedUser = { this.removeAssignedUser }
                        />
                    )
                }
                return inactiveTasks;
            },[]);
        }

        const 
            {title, task, hours, minutes} = this.state.formData,
            {day, month, year} = this.props.clickedDate;
        return(
            <div className="taskList" >
                <div className="taskListTitle">
                    <FormField
                        id = { 'title' }
                        formData = { title }
                        updateForm = { (e,id) => this.updateForm(e,id) }
                    />
                </div>
                <div className="taskListDate">
                    {month+1 +'/'+day+'/'+year}
                </div>

                <div className="addTask">
                    <div 
                        className="arrowIcon"
                        onClick = { this.submitTaskForm } 
                    >
                        <FontAwesome name="arrow-down"/>
                    </div>
                    
                    <div className="addTaskFields" >
                        <FormField
                            id = { 'task'}
                            formData = { task }
                            updateForm = { (e,id) => this.updateForm(e,id) }
                        />

                        <FormField
                            id = { 'hours' }
                            formData = { hours }
                            updateForm = { (e,id) => this.updateForm(e,id) }
                        />

                        <FormField
                            id = { 'minutes' }
                            formData = { minutes }
                            updateForm = { (e,id) => this.updateForm(e,id) }
                        />
                    </div>
                    
                    <AddUser 
                        addUsers = { (selectedUsers) => this.addUsers(selectedUsers) }
                        updateAllUsers = { users=> this.updateAllUsers(users) }
                    />
                </div>

                { allTasks }
                { this.showTaskManager() }
                { this.alert() }
            </div>
        )

    }
}
export default TaskList; 

