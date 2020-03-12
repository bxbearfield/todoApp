import React, { Component } from 'react';

import Header from '../../components/header/header';

import '../../components/taskitem/taskitem.scss'

class Layout extends Component {
    state = {  }
    render() { 
        return (  
            <div>
                <Header user={this.props.user}/>
                {this.props.children}
            </div>
        );
    }
}
 
export default Layout;