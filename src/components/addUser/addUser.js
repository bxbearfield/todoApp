import React, { Component } from 'react';
import FontAwesome from 'react-fontawesome';

//DATABASE
import { firebaseDB } from '../../firebase';

//COMPONENTS
import SetLabel from '../setLabel/setLabel';
import FormField from '../../widgets/forms/FormFields';

class addUser extends Component {
    state = {
        users: [],
        label: '#e4e0e0',
        open: false,
        formData: {
            addUser:{
                element:'input',
                value: '',
                config:{
                    className:'userInput',
                    type:'text',
                    placeholder:'Enter name',
                    autoFocus: true,
                    onKeyUp: e => {
                        if (e.keyCode === 13 && 
                            e.target.value.trim().length) {
                        this.addUserLabel();}
                    }
                },
                containerConfig: {
                    className: 'userInputDiv'
                }
            }
        }
    }

    componentWillMount() {
        firebaseDB.ref('users/demo/taskUsers').once('value')
        .then(snapshot => {
            this.setState({ 
                users: snapshot.val()
            }, ()=> this.props.updateAllUsers(this.state.users))
        })
        .catch( error => console.log(error));
    }
    componentDidUpdate(prevProps, prevState) {
        let { users } = this.state;
        return prevState.users !== null && 
            JSON.stringify(prevState.users) !== JSON.stringify(users) ?
            firebaseDB.ref('users/demo/taskUsers').set(users) : ''
   }

    addUserLabel = () => { 
        // Adds user and label to 'users' down box
        let { label, formData, users } = this.state;
        let updateUsers = [...(users || []), 
            {
                name: formData.addUser.value, 
                label, 
                selected: false
            }
        ];
        updateUsers.sort((a,b)=>(
           a.name.toUpperCase() > b.name.toUpperCase() ? 1 : -1
        ))
        
        if (label !== '#e4e0e0') {
            this.setState({
                label: '#e4e0e0',
                users: updateUsers,
                formData: { ...formData,
                    addUser: {...formData.addUser,
                        value: ''
                    }
                }
            },
            // Update allUsers in tasklist with 
            //setState callback so state is available
            ()=> this.props.updateAllUsers(this.state.users)
        )} else {
                alert("Please select a label")
        }
    }
  
    setLabel = label =>{
        // Recieves color selection 
        // via props from setLabel
        this.setState({ label })
    }

    selectUser = id => {
        // Select and deselect users
        let users = JSON.parse(JSON.stringify(this.state.users));
        users[id].selected ?
            users[id].selected = false 
            : 
            users[id].selected = true;
        this.setState({  users });
        setTimeout(()=> this.addSelectedUsers(),0);
    }

    addSelectedUsers = () => { 
        // Adds all selected users to task state
        // Called from selectUser()
        const {users} = this.state;
        let selectedUsers = users.filter((user)=>{
                return user.selected
            })
        this.props.addUsers(selectedUsers);
    }

    deleteUser = (e,id) => {
        e.stopPropagation();
        let users = JSON.parse(JSON.stringify(this.state.users));
        users.splice(id, 1);
        this.setState({ users });
    }

    showHideAddUser = () => {
        this.setState({
            open: this.state.open ? false : true
        })
    }

    renderUsers = () => ( // Maps users currently added to user/label list
        this.state.users.map( (user,i) => (
            <div 
                className = {`
                    userDivs 
                    ${ user.selected ? 'highlightBlue' : '' } 
                    ${ i === 0 ? 'firstUserDiv' : '' }
                `} 
                onClick = { ()=> this.selectUser(i) }
                key = { i + 'addUser' }
            >
                <span style = { {color: user.label} }>
                    <FontAwesome name="circle" />
                </span>

                <span 
                    className = {`
                        userNames 
                        ${ user.selected ? 'white' : '' }
                    `} 
                >
                    { user.name }
                </span>

                <span 
                    className="userRemove"
                    onClick = { e => this.deleteUser(e,i) } 
                >
                    <FontAwesome name="times" />
                </span>
            </div>
        ))
    )

    updateForm = (newValue, id) => { 
        // Update formData state called from FormFields
        let { formData } = this.state;
        this.setState({ 
            formData : {...formData,
                [id]: {...formData[id],
                     value: newValue
                }
            } 
        });
    }

    render () {
        const {open, formData, label, users} = this.state;
        return(
            // For the users icon and addUser form/list
            <div className="userIconDiv">
                <span 
                    onClick = { this.showHideAddUser } 
                    onKeyUp = { e => {
                        if (e.keyCode === 32 || 
                            e.keyCode === 13) 
                        this.showHideAddUser()} }
                    tabIndex="0"
                >
                    <FontAwesome name="users"/>
                </span>
                
                {/* Changed conditional 'hidden' class to auto focus */}
                {open ?
                    <div className = 'addUserDiv'>
                        <div className="addUserFormDiv">
                            <FormField
                                id = { 'addUser' }
                                formData = { formData.addUser }
                                updateForm = { (e,id) => this.updateForm(e,id) }
                            />

                            <SetLabel 
                                setLabel = { this.setLabel } 
                                label = { label } 
                                addUserLabel = { this.addUserLabel }
                            />
                        </div>
                    
                        { users !== null ? this.renderUsers() : null }
                    </div>
                    :
                    null
                }
            </div>
        )

    }
    

}

export default addUser;