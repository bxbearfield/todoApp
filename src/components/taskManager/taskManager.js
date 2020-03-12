import React, { Component } from 'react';
// import FontAwesome from 'react-fontawesome';

class TaskManager extends Component {
    state={
        filters: {
            all: true,
            active: false,
            completed: false
        }
    }
    clicked = id => {
        let { filters } = this.state;
        let newFilters = {};
        for (let filter in filters) {
            filter+'' === id ? 
                newFilters[filter] = true
                :
                newFilters[filter] = false;
        };
        this.setState({ filters: newFilters });
    }
    render() {
        const { 
            showCompleteOption, 
            filterTasks,
            showActiveOption,
            listKey, 
            repeatKey,
            saved,
            show_SaveAlert, 
            show_DeleteRepAlert, 
            show_ResaveAlert,
            show_DeleteListAlert } = this.props;

        const {all, completed, active} = this.state.filters;
        return (
            <React.Fragment>
                <div className="taskManager">

                    <span>Task Manager</span>

                    <div className="taskOptions">
                        <div 
                            className={`taskOption ${ all ? 'clicked':''}`} 
                            onClick={()=> {filterTasks('all'); this.clicked('all')}} 
                        >
                            All
                        </div>

                        <div 
                            {...showActiveOption() ?
                                {className: `taskOption ${ active ? 'clicked':''}`,
                                onClick: ()=> {filterTasks('active'); this.clicked('active')}} 
                                :
                                {className: `taskOption inactive`}
                            }
                        >
                            Active
                        </div>

                        <div 
                            {...showCompleteOption() ?
                                {className: `taskOption ${ completed ? 'clicked':''}`,
                                onClick: ()=> {filterTasks('inactive'); this.clicked('completed')}} 
                                :
                                {className: `taskOption inactive`}
                            }
                        >
                           Completed
                        </div>

                    </div>
                </div>

                <div className="saveDeleteBtns">
                    <button 
                        disabled={ saved ? true : false} 
                        onClick={listKey ? show_ResaveAlert : show_SaveAlert}
                    > 
                        {saved ? 'Saved' : 'Save'}
                    </button>
                    
                    <button 
                        onClick={repeatKey && listKey.length ? 
                            show_DeleteRepAlert : show_DeleteListAlert
                        }
                    >
                        Delete
                    </button>
                </div>
            </React.Fragment>
        )
    }
}

export default TaskManager;