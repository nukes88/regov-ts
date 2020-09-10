import React, { useState } from 'react';
import { Spinner, Button, Alert, Form } from 'react-bootstrap';
import UserContainer from '../Containers/UserContainer';
import { Redirect, Link } from 'react-router-dom';
import BoldedButton from '../Components/BoldedButtons';

export default function Login() {
  const user = UserContainer.useContainer();

  let [isLoading, setIsLoading] = useState(false);
  let [error, setError] = useState('');
  let [username, setUsername] = useState('');

  async function handleLogin() {
    try {
      setError('');
      setIsLoading(true);
      if (!(await user.login(username))) {
        throw new Error('Could not login! Have you registered?');
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  }

  function handleUsernameChange(evt: React.ChangeEvent<HTMLInputElement>) {
    let _username = evt.target.value.replace(/[^a-zA-Z ]/, '');
    setUsername(_username);
  }

  function handleKeyDown(evt: React.KeyboardEvent) {
    if (evt.key === 'Enter') {
      handleLogin();
    }
  }

  if (user.isUserAuthenticated()) {
    return <Redirect to="/inside" />;
  }

  return (
    <>
      <h1>Login</h1>
      <Form.Group>
        <Form.Label>Username</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter your username"
          onChange={handleUsernameChange}
          value={username}
          onKeyDown={handleKeyDown}
        />
        <Form.Text>HINT: We already know your password</Form.Text>
      </Form.Group>
      <Alert>
        No account? Register <Link to="/register">Here</Link>!
      </Alert>
      {error !== '' ? <Alert variant="danger">{error}</Alert> : null}
      {isLoading ? (
        <Spinner animation="border" />
      ) : (
        <BoldedButton
          text="login"
          clickFunc={handleLogin}
          toUpper={true}
          data-testid="register-button"
        />
      )}
    </>
  );
}
