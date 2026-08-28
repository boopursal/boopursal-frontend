import React, { Component } from 'react';
import { FuseUtils } from '@fuse';
import { matchRoutes } from 'react-router-config';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import AppContext from 'app/AppContext';

class FuseAuthorization extends Component {

    constructor(props, context) {
        super(props);
        const { routes } = context;
        this.state = {
            accessGranted: true,
            routes
        };
    }

    componentDidMount() {
        if (!this.state.accessGranted) {
            this.redirectRoute();
        }
    }

    componentDidUpdate() {
        if (!this.state.accessGranted) {
            this.redirectRoute();
        }
    }

    static getDerivedStateFromProps(props, state) {

        const { location, userRole } = props;
        const { pathname } = location;

        const matched = matchRoutes(state.routes, pathname)[0];


        return {
            accessGranted: matched ? FuseUtils.hasPermission(matched.route.auth, userRole) : true
        }
    }

    shouldComponentUpdate(nextProps, nextState) {

        return nextState.accessGranted !== this.state.accessGranted;
    }

    redirectRoute() {
        const { location, userRole, history, user } = this.props;
        const { pathname, state } = location;

        let redirectPath = '';

        if (userRole === 'ROLE_ADMIN' || userRole === 'ROLE_ACHETEUR' || userRole === 'ROLE_FOURNISSEUR') {
            redirectPath = '/dashboard';
        } else if (userRole === 'ROLE_FOURNISSEUR_PRE') {
            redirectPath = '/onboarding/fournisseur';
        } else if (userRole === 'ROLE_ACHETEUR_PRE') {
            redirectPath = '/onboarding/acheteur';
        } else {
            redirectPath = (user && user.data && user.data.redirect) || (user && user.redirect) || '/';
        }

        const redirectUrl = (state && state.redirectUrl) ? state.redirectUrl : redirectPath;

        /*
        User is guest
        Redirect to Login Page
        */
        if (!userRole || userRole.length === 0) {
            history.push({
                pathname: '/login',
                state: { redirectUrl: pathname }
            });
        }
        /*
        User is member
        User must be on unAuthorized page or just logged in
        Redirect to dashboard or redirectUrl
        */
        else {
            history.push({
                pathname: redirectUrl || '/'
            });
        }
    }

    render() {
        return this.state.accessGranted ?
            <React.Fragment>{this.props.children}</React.Fragment>
            : null;
    }
}

function mapStateToProps({ auth }) {

    return {
        userRole: auth.user.role,
        user: auth.user
    }
}

FuseAuthorization.contextType = AppContext;

export default withRouter(connect(mapStateToProps)(FuseAuthorization));
