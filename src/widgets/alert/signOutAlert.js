import React from 'react';


const signOutAlert = ({showAlert, signOut, user}) =>  {
    return (
        <div className="alertModal signOut">
            <div className="alertBox">
                <div className="alertMsg">
                    {`Sign out user: ${user}?`}
                </div>

                <div className="dbButtons">
                    <button 
                        type="button" 
                        onClick = { showAlert }
                    > 
                        Cancel 
                    </button>

                    <button 
                        type="button" 
                        onClick = { ()=> {showAlert(); signOut();} }
                    > 
                        Continue
                    </button> 
                </div>
                  
            
            </div>
        </div> 
    );
}
 
export default signOutAlert