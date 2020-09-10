import React from 'react';
import UserContainer from '../Containers/UserContainer';
import { Row, Col } from 'react-bootstrap';
import HeaderWithUser from '../Components/HeaderWithUser';
import { Link } from 'react-router-dom';

export default function Main() {
  const user = UserContainer.useContainer();

  return (
    <>
      <HeaderWithUser title="Main" />
      <Row>
        <Col>
          Welcome, {user.username}!
          <br />
          {user.isUserAuthenticated() ? (
            <>
              You've logged in! Check out the <Link to="/inside">Inside</Link>{' '}
              page!
            </>
          ) : (
            <>
              Click on LOGIN to begin!
              <br />
              If you've already registered, you can login using the username
              you've chosen.
            </>
          )}
        </Col>
      </Row>
    </>
  );
}
