import React from 'react';
import { Switch } from 'react-router-dom';

//COMPONENTS
import Home from './components/home/home';
import UserAuth from './widgets/authentication/authentication';
import Layout from './hocs/layout/layout';
import PrivateRoute from './components/AuthRoutes/privateRoute';
import PublicRoute from './components/AuthRoutes/publicRoute';

const Routes = props => {
    const {user} = props;
    return ( 
        <Layout user={user}>
             <Switch>
                {/* Add routes from most specific to least specific */}
                <PublicRoute {...props}  path="/log-in" restricted={true} exact component={UserAuth}/>
                <PrivateRoute {...props} path="/" exact component={Home}/>
            </Switch>
        </Layout>
       
     );
}
 
export default Routes;

