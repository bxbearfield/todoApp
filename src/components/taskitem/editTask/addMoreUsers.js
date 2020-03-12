import React from 'react';
import '../taskitem.scss';
import FontAwesome from 'react-fontawesome';

const addMoreUsers = ({allUsers, users, addMoreUsers, id}) => (
     allUsers.filter(user => (
        !users.some(currentUser => (
            currentUser.name === user.name
        ))
    )).map((optUser, i)=>(
        <div key={i} className="optionalUser" >
            <span 
                className="optUserLabel"
                style={{color: optUser.label}}
            >
                <FontAwesome 
                    onClick={ e => {
                        e.stopPropagation(); 
                        addMoreUsers(id, optUser);}} 
                    name="plus" 
                /> 
            </span>
            
            <span className="optUserName">
                { optUser.name }
            </span>
        </div> 
    ))
)
 
export default addMoreUsers;