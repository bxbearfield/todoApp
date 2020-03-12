import React, { Component } from 'react';
import '../taskitem.scss';
import FontAwesome from 'react-fontawesome';
import FormField from '../../../widgets/forms/FormFields';

import AddMoreUsers from '../editTask/addMoreUsers';

class editTask extends Component {
    state = { 
        editUsers: false,
        formData: {
            task: {
                element:'textarea',
                value: this.props.task,
                config:{
                    className: this.props.active ? '':'inactiveText',
                    maxLength: '150',
                    autoFocus: true,
                    spellCheck: false
                },
                containerConfig: {
                    className: 'taskText editTaskWrapper'
                }
            },
            hours:{
                element:'select',
                value: this.props.hours,
                containerConfig: {
                    className: 'hoursDiv'
                },
                config:{
                    className:'hoursDiv editTime',
                    placeholder:'\uf017', //Fontawesome unicode works mostly with standard icons
                    options: () => { // Returns 0-12 array with padding
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
                value: this.props.minutes,
                containerConfig: {
                    className: 'minutesDiv'
                },
                config:{
                    className:'minutes editTime',
                    placeholder:'\uf017', //Fontawesome unicode works mostly with standard icons
                    options: () => { // Returns 0-59 array with padding
                        let minutes = [];
                        for (let i = 0; i < 60; i++) {
                            let minute = '' + i;
                            while (minute.length < 2) {
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
    
    editUsers = () => {
        let users = this.state.editUsers;
        if (this.props.allUsers)
            this.setState({ 
                editUsers: users ?  
                    false : true 
                });
    }

    componentWillReceiveProps(newProps) {
        let { formData } = this.state;
        let { task, hours, minutes  } = this.state.formData;
        this.setState({ 
            formData: {...formData,
                task: {...task, 
                    value: newProps.task},
                hours: {...hours, 
                    value: newProps.hours},
                minutes: {...minutes, 
                    value: newProps.minutes}
            }  
        });
    }

    render() { 
        const {formData, editUsers} = this.state;
        const {id, allUsers, users, addMoreUsers} = this.props;

        return (  
            <React.Fragment>
                <div className="checkIcon editUsers"> 
                    <div>
                        <FontAwesome name="circle-thin"/>
                    </div>

                    <div 
                        onClick={this.editUsers}
                            className="editUserIcon"
                    >
                        <FontAwesome name="user-plus"/>
                    </div>

                    {editUsers ?
                        <div 
                            onMouseLeave={()=> this.setState({ editUsers: false })} 
                            className="addMoreUsersDiv"
                        >
                            {allUsers.length > users.length ?
                                <AddMoreUsers
                                    allUsers = { allUsers }
                                    users = { users }
                                    addMoreUsers = { addMoreUsers }
                                    id = { id }
                                />
                                :
                                "All users added"
                            }
                        </div>
                        :
                        null
                    }
                </div>

                <FormField
                    id={'task'}
                    formData={formData.task}
                    updateForm={(e,id) => this.props.updateForm(e,id)}
                />

                <div className='taskTime'>
                    <FormField
                        id={'hours'}
                        formData={formData.hours}
                        updateForm={(e,id) => this.props.updateForm(e,id)}
                    />
                    
                    <FormField
                        id={'minutes'}
                        formData={formData.minutes}
                        updateForm={(e,id) => this.props.updateForm(e,id)}
                    />
                </div>
            </React.Fragment>
        );
    }
}
 
export default editTask;