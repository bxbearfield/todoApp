import React, { Component } from 'react';
import { firebaseAU } from '../../firebase';

import styles from './auth.module.css';
import FormField from '../forms/FormFields';

class userAuth extends Component {
    state = {
        registerError: '',
        loading: false, 
        formData: {
            email:{
                element:'input',
                value: '',
                containerConfig: {
                    className: 'emailInputDiv'
                },
                config:{
                    className:'emailInput',
                    type:'text',
                    placeholder:'Enter your email',
                    autoFocus: true,
                    onBlur: (e)=>{this.updateForm(e.target.value,'email',true)}
                },
                validation: {
                    required: true,
                    email: true
                },
                valid: false,
                blur: false,
                errorMsg: '',
                errStyle: styles.err_msg
            },

            password:{
                element:'input',
                value: '',
                containerConfig: {
                    className: 'passwordInputDiv'
                },
                config:{
                    className:'passwordInput',
                    type:'password',
                    placeholder:'Enter your password',
                    autoFocus: false,
                    onBlur: (e)=>{this.updateForm(e.target.value,'password',true)}
                },
                validation: {
                    required: true,
                    passoword: true
                },
                valid: false,
                blur: false,
                errorMsg: '',
                errStyle: styles.err_msg
            }
        }
     }

    // Update formData state from controlled form
    updateForm = (newValue, fieldId, blur) => { 
        let formData = {...this.state.formData};
        let field = formData[fieldId];
        field.value = newValue;
        if (blur) {
            let validData = this.validate(field);
            field.valid = validData.valid;
            field.errorMsg = validData.errMsg;
            // console.log(validData);
        }
        field.blur = blur;
        formData[fieldId] = field;
        this.setState({ formData });
    }
    
    validate = field => {
        let error = { 
            valid:true, 
            errMsg: null
        }; 

        if (field.validation.passoword) {
            const valid = field.value.length >= 6;
            const errMsg = 'Password must contain at least six characters';
            error = !valid ? {valid, errMsg} : error;
        }

        if (field.validation.email) {
            const valid = /\S+@\S+\.\S+/.test(field.value);
            const errMsg = 'Please enter a valid email';
            error = !valid ? {valid, errMsg} : error;
        }

        if (field.validation.required) {
            const valid = field.value.trim() !=='';
            const errMsg = 'This field is required';
            error = !valid ? {valid, errMsg} : error;
        }

        return error
    }

    submitForm = (e, button) =>{
        const { formData } = this.state;
        let submit = {};
        let validForm = true;

        for (let key in formData){
            submit[key] = formData[key].value;
            validForm = formData[key].valid && validForm;
        };

        if (validForm) {
            this.setState({ loading: true, registerError: ''});
            if ( button === 'register') {
                firebaseAU.createUserWithEmailAndPassword(
                    submit.email, submit.password
                ).then (() => {
                    this.props.history.push('/')
                }).catch (error => {
                    this.setState({ 
                        loading: false, 
                        registerError: error.message
                    });
                })
            } else if (button === 'login') {
                firebaseAU.signInWithEmailAndPassword(
                    submit.email, submit.password
                ).then (() => {
                    this.props.history.push('/')
                }).catch (error => {
                    this.setState({ 
                        loading: false, 
                        registerError: error.message
                    });
                })
            }
        };
    }

    buttons = () => {
       return this.state.loading ?
            <div className="loading">...Loading</div>
            :
            <React.Fragment>
                <button onClick={e => this.submitForm(e, 'register')}>Register Now</button>
                <button onClick={e => this.submitForm(e, 'login')}>Sign In</button>
            </React.Fragment>
        ;
    }

    registerError = () => {
        let {registerError} = this.state;
        return registerError.length ? 
            <div className="regErr">
                {registerError}
            </div> 
        : ''
    }

    render() { 
        const {email, password} = this.state.formData;
        return ( 
            <div className={styles.userAuthWrapper}>
                <h2>Sign In / Register</h2> 
                <FormField
                    id={'email'}
                    formData={email}
                    updateForm={(e,id) => this.updateForm(e,id)}
                />
                <FormField
                    id={'password'}
                    formData={password}
                    updateForm={(e,id) => this.updateForm(e,id)}
                />
                {this.buttons()}
                {this.registerError()}
            </div>
         );
    }
}
 
export default userAuth;