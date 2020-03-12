import React, { Component } from 'react';

class FormFields extends Component {
   
    state ={
        ghostDivHeight: '',
        ghostDivWidth: '',
        cursor: ''
    }
    
    componentDidMount (){
        this.updateHeight();
    }

    componentDidUpdate (){
        let { cursor } = this.state;
        return this.textarea ? 
            this.textarea.setSelectionRange(cursor, cursor) : ''
    }

    updateHeight = () => {
        if (this.ghostDiv !== undefined) {
            this.setState({ 
                ghostDivHeight: this.ghostDiv.clientHeight,
                ghostDivWidth: this.ghostDiv.clientWidth
            });
        }
    }
    
    handleCursor = () => {
        //Controlled inputs move cursor position
        this.setState({ 
            cursor: this.textarea.selectionStart
        });
    }
    
   renderTemplate = () => {
       // Use onChange to update the field's 
       // value in state for controlled form
        let formTemplate;
        let {formData, id, updateForm} = this.props;
        let {config, value, element, errorMsg, errStyle} = formData;

        switch(element){
            case('input'):
                formTemplate = 
                    <React.Fragment>
                        <input 
                            {...config}
                            value={value}
                            onChange={e => updateForm(e.target.value, id)} 
                        />
                        {errorMsg && errorMsg.length ?
                            <div className={errStyle}>{errorMsg}</div>
                            :
                            null
                        }
                    </React.Fragment>
            break;
            case('textarea'):
                formTemplate = 
                    <div className="ghostEditDiv">
                        <div 
                            className="ghostDiv" 
                            ref={div => this.ghostDiv = div} 
                            aria-hidden="true"
                        >
                            {value}
                        </div>
                        <textarea 
                            {...config}
                            value={value}
                            ref= { textarea => this.textarea = textarea }
                            onChange={e => {
                                this.updateHeight(e);
                                this.handleCursor();
                                updateForm(e.target.value, id, formData.id); 
                            }} 
                            onClick = {this.handleCursor}
                            style={{ 
                                height: this.state.ghostDivHeight, 
                                width: this.state.ghostDivWidth
                            }}
                        />
                    </div>
            break;
            case('select'):
                formTemplate = 
                    <select 
                        className={config.className}
                        value={value}
                        onChange={e => updateForm(e.target.value, id)}
                    >
                        {/* For selects with a placeholder. Auto select, 
                            disable through keyboard and click, 
                            hide from drop down */}
                        {config.placeholder !== '' ? 
                            <option value="" defaultValue disabled hidden>
                                {config.placeholder}
                            </option>
                            :
                            null
                        }
                        {config.options().map((option, i) =>{
                            return (
                                <option key={i} value={option}>
                                    {option} 
                                </option>
                            )
                        })}
                    </select>
                
            break;
            default: formTemplate = null;
        }
        return formTemplate;
    }
 
    render() {
        let { containerConfig } = this.props.formData;
        
        return(
            <div {...containerConfig}>
                {this.renderTemplate()}
            </div>
            
        )
    }
}

export default FormFields;