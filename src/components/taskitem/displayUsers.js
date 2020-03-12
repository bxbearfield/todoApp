import React from 'react';
import './taskitem.scss';
import FontAwesome from 'react-fontawesome';

const displayUsers = ({
    userId, 
    taskId, 
    active, 
    edit, 
    label, 
    name, 
    removeAssignedUser
}) => {
    return ( 
        <span className="assignedUser" >
            <span 
                className="assignedLabel"
                style={
                    !active ? 
                        {color: '#e4e0e0'} : {color: label}
                }
            >
                {edit ?
                    <FontAwesome 
                        className="removeUserIcon"
                        onClick={ () => removeAssignedUser(taskId, userId)} 
                        name="times" 
                    />
                    :
                    <FontAwesome name="circle" />
                }
            </span>
            
            <span className="assignedName">
                {name}
            </span>
        </span>
     );
} 
 
export default displayUsers;