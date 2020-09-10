import React from 'react';
import UserContainer from '../Containers/UserContainer';
import BoldedButtons from './BoldedButtons';
import { useHistory } from 'react-router-dom';

export default function UserLoginCard() {
  const user = UserContainer.useContainer();
  const history = useHistory();

  async function handleLogout() {
    // user.logout();
  }

  return (
    <div className="user-login-div">
      <div className="user-login-card" data-testid="login-card">
        {user.isUserAuthenticated() ? (
          <>
            <span className="greeting">
              Hi, <span className="name">{user.username}</span>!
            </span>
            <BoldedButtons
              text="logout"
              toUpper={true}
              clickFunc={handleLogout}
              variant="danger"
            />
          </>
        ) : (
          <BoldedButtons
            text="login"
            toUpper={true}
            clickFunc={() => history.push('/login')}
          />
        )}
      </div>
    </div>
  );
}
