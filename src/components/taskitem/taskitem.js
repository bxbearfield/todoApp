import React, { Component } from 'react';
import './taskitem.scss';
import FontAwesome from 'react-fontawesome';
import propTypes from 'prop-types';

import EditTask from './editTask/editTask';
import TaskDisplay from './taskDisplay';
import DisplayUsers from './displayUsers';


class TaskItem extends Component {
    state = {
        dragging: false,
        hovering: false
    }

    dragHide = () => {
        setTimeout( () => {
            this.setState({
                dragging: true
            })
        },0);
    }

    dragEnd = () => { 
        //Show task drag ends by removing conditional class
        this.setState({ dragging: false });   
    }

    dragHover = () => { 
        // Show task drag ends by removing 
        // conditional class for highlight
        this.setState({ hovering: true });   
    }

    dragUnhover = () => {
        this.setState({ hovering: false });
    }

    displayUsers = () => {
        const { active,  edit, users } = this.props.taskObj,
        {removeAssignedUser, id} = this.props;

        return users.map( (user,i) => {
            return (
                <DisplayUsers
                    key={user.name + i}
                    userId={i}
                    taskId={id}
                    label={user.label}
                    name={user.name}
                    edit={edit}
                    active={active}
                    removeAssignedUser={removeAssignedUser}
                />
            )
        })
    }
    
    updateForm = (newValue, id) => { 
        // Update formData state in 
        // tasklist called from FormFields
        this.props.updateTask( newValue, this.props.id, id );
    }

    render() {
        const { dragging, hovering } = this.state,

        { editTask,  dragDrop, removeTask, id,
            allUsers,  focusedIn,  addMoreUsers } = this.props,

        { task, hours, minutes, active,
              edit, users, focused} = this.props.taskObj;

        return (
            <div 
                className={`
                    task 
                    ${ dragging ? 'hidden':'' } 
                    ${ hovering ? 'highlightAqua':'' } 
                `} 
                onDragStart={ e => { 
                    // Dragging state to false
                    focusedIn( id );
                    this.dragHide(); 
                    this.setState({ edit: false  });
                    e.dataTransfer.setData("id", id); 
                }}
                onDrop={ e => {
                    let droppedId = 
                        e.dataTransfer.getData("id");
                    this.dragUnhover();
                    dragDrop(droppedId, id);
                
                }}
                onDragOver={ e => { 
                    e.preventDefault(); 
                    this.dragHover(); 
                }}
                // Allow drag if not in edit mode
                draggable={ edit ? false : true } 

                // Remove 'hidden' class
                onDragEnd={ this.dragEnd } 

                // Allow drop
                onDragEnter={ e => e.preventDefault() } 

                onDragLeave={ this.dragUnhover }
                
                // If div's first click, focus state true
                onClick={ () => {if (!focused) focusedIn(id) }}  
            > 
                <div className="taskItem">
                    {edit && active ?
                        <EditTask 
                            task={ task }
                            allUsers={ allUsers }
                            // Database doesn't store empty arrays
                            users={ users || [] } 
                            addMoreUsers={ addMoreUsers }
                            hours={ hours }
                            minutes={ minutes }
                            active={ active }
                            id={ id }
                            updateForm={ this.updateForm }
                        />
                        :
                        <TaskDisplay
                            active={ active }
                            task={ task }
                            minutes={ minutes }
                            hours={ hours }
                            id={ id }
                            completeTask={ this.props.completeTask }
                        />
                    }
                    

                    {/* PENCIL ICON in each task (on hover) */}
                    <div 
                        className={`
                            pencilIcon
                            ${ active ? '' : 'hidden' }
                        `}
                        onClick={ () => editTask(id) }
                    >
                        <FontAwesome name="pencil" />
                    </div>
                        

                    {/* X ICON in each task (on hover) */}
                    <div 
                        className="closeIcon" 
                        onClick={ () => removeTask(id) }
                    >
                            <FontAwesome name="times" />
                    </div>
                    
                </div>

                {/* TASK ASSIGNED USERS Do not return a div 
                    if no users have been chosen */}    
                {users && users.length ? 
                    <div 
                        className={`
                            assignedUsers 
                            ${active ? '':'inactiveText'}
                        `}
                    >
                            {this.displayUsers()}
                    </div> 
                    :
                    null
                }
            </div>
        )
    }
}

TaskItem.propTypes = {
    task: propTypes.string,
    active: propTypes.bool,
    minutes: propTypes.string,
    hours: propTypes.string
}

export default TaskItem;