import React, { Component } from 'react';
import FontAwesome from 'react-fontawesome';

class setLabel extends Component{
    state = {
        labels: [
            {color: 'red', selected: false},
            {color: 'orange', selected: false},
            {color: 'yellow', selected: false},
            {color: 'green', selected: false},
            {color: 'blue', selected: false},
            {color: 'purple', selected: false},
            {color: 'fuchsia', selected: false},
            {color: 'gray', selected: false},
            {color: 'black', selected: false}
        ],
        labelOpen: false

    }

    renderLabels = () => {
        let labels = this.state.labels.map( (label, i) => {
            return (
                <div 
                    className={ // Removes highlight state from previous label selection
                        `eachLabelDiv 
                        ${this.props.label !== '#e4e0e0' && label.selected ? 'highlightBlue' : ''} 
                        `} 
                    style={{color: label.color}}
                    onClick={() => this.selectLabel(i)}
                    onKeyUp={(e) => { 
                        if(e.keyCode === 32) {
                            this.selectLabel(i);
                        } 
                        else if (e.keyCode === 13) {
                            this.showHideLabels();
                        }}}
                    key={i}
                    tabIndex="0"
                >
                    <FontAwesome name="circle" />
                </div>
            )
        })
        return labels;
    }

    selectLabel = (id) => {  
        let labelsObj = JSON.parse(JSON.stringify(this.state.labels));
        let labels = labelsObj.map( (label,i) => {
            i === id ? 
                label.selected = true 
                : 
                label.selected = false;
            return label;
        })
        setTimeout(()=>
        this.setState(
            { labels }, 
            ()=>this.props.setLabel(labels[id].color)
        ), 0);
    }

    showHideLabels = () => {
        this.setState({
            labelOpen: this.state.labelOpen ? false : true
        })
    }

    render () {
        return(
            <span>
                <button 
                    style={{color: this.props.label}} 
                    onClick={this.showHideLabels} 
                >
                    <FontAwesome name="circle"/>
                </button>

                <div 
                    className={`
                        labelDiv 
                        ${this.state.labelOpen ? '': 'hidden'}
                    `} 
                    onMouseLeave={ this.showHideLabels } 
                    tabIndex="0" // onBlur won't work on divs without tab index
                >
                    {this.renderLabels()}
                </div>
            </span>
        )
    }

}

export default setLabel;
