var React = require('react');
var assign = require('lodash-node/modern/objects/assign');
var UserActions = require('../user/UserActions');
var UserStore = require('../user/UserStore');
var RouterStore = require('../router/RouterStore');

var debug = require('debug')('app:LoginPage');

var LoginPage = React.createClass({
  getInitialState: function() {
    return assign(this.getUserStoreState(), this.getRouterStoreState());
  },

  componentDidMount: function () {
    debug('componentDidMount');
    UserStore.addWatch(this.handleUserStoreChange);
    RouterStore.addWatch(this.handleRouterStoreChange);
  },

  componentWillUnmount: function () {
    debug('componentWillUnmount');
    UserStore.removeWatch(this.handleUserStoreChange);
    RouterStore.removeWatch(this.handleRouterStoreChange);
  },

  handleUserStoreChange: function() {
    debug('handleUserStoreChange');
    this.setState(this.getUserStoreState());
  },

  getUserStoreState: function() {
    return {
      loggingIn: UserStore.get('loggingIn'),
      errorMessage: UserStore.errorMessage()
    };
  },

  handleRouterStoreChange: function(keys, oldState, newState) {
    // Don't trigger a re-render on route change
    // or it will error trying to update an unmounted component
    if (keys !== 'redirectUri') {
      return;
    }

    debug('handleRouterStoreChange');
    this.setState(this.getRouterStoreState());
  },

  getRouterStoreState: function() {
    return {
      redirectUri: RouterStore.redirectAfterLoginUri()
    };
  },

  render: function() {
    debug('render');
    return (
      <div>
        {this.renderRedirectMessage()}
        <p>Hint: demo/demo</p>
        <form>
          <p><input ref="username" placeholder="username"/></p>
          <p><input ref="password" placeholder="password"/></p>
          <p>{this.renderButton()}</p>
        </form>
        <p>{this.state.errorMessage}</p>
      </div>
    );
  },

  renderButton: function() {
    var disabled;
    var text = 'Login';

    if (this.state.loggingIn) {
      disabled = true;
      text = 'Logging in...';
    }

    return (
      <button onClick={this.handleLogin} disabled={disabled}>{text}</button>
    );
  },

  renderRedirectMessage: function() {
    var uri = this.state.redirectUri;
    if (!uri) {
      return null;
    }

    return (
      <p>
        {'After logging in you will be redirected to '}
        <strong>{uri}</strong>
      </p>
    );
  },

  handleLogin: function(e) {
    debug('handleLogin');
    e.preventDefault();
    var username = this.refs.username.getDOMNode().value;
    var password = this.refs.password.getDOMNode().value;
    UserActions.login(username, password);
  }
});

module.exports = LoginPage;
