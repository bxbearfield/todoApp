import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

// DATABASE
import { firebaseAU } from '../../firebase';
import SignOutAlert from '../../widgets/alert/signOutAlert';

import '../taskitem/taskitem.scss'


class Header extends Component {
    state = { 
        signOutAlert: false
    }

    showAlert = () => {
        let {signOutAlert} = this.state;
        this.setState({ 
            signOutAlert: signOutAlert ? false : true });
            
    }

    hide_signOutAlert = () => {
        this.setState({ signOutAlert: false });
    }
    
    signOut = () => {
        firebaseAU.signOut().then(()=>{
            this.props.history.push("/log-in") 
        })
    }
    renderAlert = () => (
        this.state.signOutAlert ?
            <SignOutAlert 
                user = {this.props.user.email}
                showAlert = { this.showAlert } 
                signOut = { this.signOut }
            /> :""
    )
    render() {
        return ( 
            <header className="header">
                {this.props.user ? 
                    <React.Fragment>
                        <div className="welcomeMsg">
                            {`Welcome, ${this.props.user.email}!`}
                        </div>

                        <div className="logBtns">
                            <button onClick = {this.showAlert}> 
                                Sign Out
                            </button>
                        </div>

                        {this.renderAlert()}
                    </React.Fragment> : ''}
            </header>
        );
    }
}
 
export default withRouter(Header);