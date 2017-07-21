import React, {Component} from 'react';
import firebase from 'firebase';

let config = {
    apiKey: "AIzaSyA5beESjVk3FtFq5JBJlffoVz4Zrwy3Lyg",
    authDomain: "usurvey-7b575.firebaseapp.com",
    databaseURL: "https://usurvey-7b575.firebaseio.com",
    projectId: "usurvey-7b575",
    storageBucket: "usurvey-7b575.appspot.com",
    messagingSenderId: "41541665454"
};
firebase.initializeApp(config);

class Authen extends Component {
    state = {
        email: '',
        password: '',
        err: '',
        isLoggedIn: false,
    };

    login = () => {
        const email = this.state.email;
        const password = this.state.password;

        const auth = firebase.auth();

        const promise = auth.signInWithEmailAndPassword(email, password);

        promise.then(user => {
            let message = 'Welcome, you are now logged in!';
            this.setState({err: message, isLoggedIn: true});
        });

        promise.catch(e => {
            let err = e.message;
            this.setState({err});
        })
    };

    signup = () => {
        const email = this.state.email;
        const password = this.state.password;

        const auth = firebase.auth();

        const promise = auth.createUserWithEmailAndPassword(email, password);

        promise
            .then(user => {
                let err = `Welcome ${user.email}`;
                firebase.database().ref(`users/${user.uid}`).set({
                    email: user.email,
                });
                this.setState({err});
            })
            .catch(e => {
                let err = e.message;
                this.setState({err});
            });
    };

    logout = () => {
        let promise = firebase.auth().signOut();
        promise.then(() => {
            let message = 'You are now logged out!';
            this.setState({err: message, isLoggedIn: false});
        }).catch(err => {
            this.setState({err: err.message});
        });
    };

    // Signs in with popup
    google = () => {
        let provider = new firebase.auth.GoogleAuthProvider();

        // Use redirect instead of Popup for better mobile experience
        let promise = firebase.auth().signInWithPopup(provider);

        promise.then(result => {
            let user = result.user;
            firebase.database().ref(`users/${user.uid}`).set({
                email: user.email,
                name: user.displayName,
            });
            this.setState({err: 'You are now sign in via Google', isLoggedIn: true});
        });

        promise.catch(e => {
            let msg = e.message;
            this.setState({err: msg});
        })
    };

    // Signs in with redirect
    googleRedirect = () => {
        let provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithRedirect(provider);

        firebase.auth().getRedirectResult().then( result => {
            let user = result.user;
            firebase.database().ref(`users/${user.uid}`).set({
                email: user.email,
                name: user.displayName,
            });
            this.setState({err: 'You are now sign in via Google', isLoggedIn: true});

        }).catch(err => {
            let msg = err.message;
            this.setState({err: msg});
        });
    };

    render(){
        return(
            <div>
                <input
                    id="email"
                    onChange={(e) => {this.setState({email: e.target.value})}}
                    type="email"
                    placeholder="Enter your email"
                /> <br/>
                <input
                    id="pass"
                    onChange={(e) => {this.setState({password: e.target.value})}}
                    type="password"
                    placeholder="Enter your password"
                /> <br/>
                <p>{this.state.err}</p>
                <button onClick={this.login}>Login</button>
                <button onClick={this.signup}>Sign Up</button>
                <button
                    id="logout"
                    onClick={this.logout}
                    className={this.state.isLoggedIn ? '' : 'hide'}>Logout</button>
                <br/>
                <button
                    onClick={this.googleRedirect}
                    id="google" className="google"
                >Sign In with Google</button>
            </div>
        );
    }
}

export default Authen;