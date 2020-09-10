import { createContainer } from 'unstated-next';
import { useState, useEffect } from 'react';

enum KeyStore {
  IS_AUTH = 'isAuth',
  USERNAME = 'username',
  CALLSIGN = 'callsign',
  REGISTRATION_DETAILS = 'registration_details'
}

function useUser() {
  let [isAuth, setIsAuth] = useState(false);
  let [username, setUsername] = useState('');
  let [callsign, setCallSign] = useState('');
  let [registrationDetails, setRegistrationDetails] = useState({});

  useEffect(() => {
    function hydrate() {
      let isAuth = sessionStorage.getItem(KeyStore.IS_AUTH);
      let username = sessionStorage.getItem(KeyStore.USERNAME);
      let callsign = sessionStorage.getItem(KeyStore.CALLSIGN);

      setIsAuth(isAuth === 'Y');
      setUsername(username || 'Stranger');
      setCallSign(callsign || '');
    }
    console.log('init useUser');
    hydrate();
  }, []);

  interface FakeFetchResponse {
    ok: boolean;
  }
  async function waitFor(ms: number): Promise<FakeFetchResponse> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({
          ok: true
        });
      }, ms);
    });
  }

  function storeUserInSession(_isAuth: boolean, _username: string): void {
    setIsAuth(_isAuth);
    setUsername(_username);

    sessionStorage.setItem(KeyStore.IS_AUTH, _isAuth ? 'Y' : 'N');
    sessionStorage.setItem(KeyStore.USERNAME, _username);
  }
  async function login(_username: string): Promise<void | false> {
    try {
      let res = await waitFor(1000);
      if (res.ok) {
        storeUserInSession(true, _username);
      } else {
        throw new Error('Login error!');
      }
    } catch (e) {
      console.error(e.message);
      return false;
    }
  }

  function isUserAuthenticated(): boolean {
    return isAuth;
  }

  async function convertPhotoBase64(
    photo: Blob
  ): Promise<string | ArrayBuffer | null> {
    return new Promise((resolve, reject) => {
      let reader = new FileReader();
      reader.readAsDataURL(photo);
      reader.onloadend = function () {
        resolve(reader.result);
      };
    });
  }
  interface RegistrationInfo {
    username: string;
    callsign: string;
    icpassport: File | null;
  }
  async function register({
    username,
    callsign,
    icpassport
  }: RegistrationInfo) {
    try {
      // simulate some fetch action
      let res = await waitFor(1000);
      if (res.ok) {
        let photoBase64;
        if (icpassport) {
          photoBase64 = await convertPhotoBase64(icpassport);
        }
        let newRegDetails = JSON.stringify({
          username,
          callsign,
          icpassport: photoBase64
        });

        setIsAuth(true);
        setUsername(username);
        setCallSign(callsign);
        // setIcpassport(photoBase64);
        setRegistrationDetails(newRegDetails);

        sessionStorage.setItem(KeyStore.IS_AUTH, 'Y');
        sessionStorage.setItem(KeyStore.USERNAME, username);
        sessionStorage.setItem(KeyStore.CALLSIGN, callsign);
        // sessionStorage.setItem(keyStore_icpassport, photoBase64);
        sessionStorage.setItem(KeyStore.REGISTRATION_DETAILS, newRegDetails);
        return true;
      } else {
        console.log(res);
        throw new Error(`Couldn't register!`);
      }
    } catch (e) {
      console.error(e.message);
      return false;
    }
  }

  async function getRegistration() {
    try {
      let res = await waitFor(1000);
      if (res.ok) {
        let regDetails = sessionStorage.getItem(KeyStore.REGISTRATION_DETAILS);
        let details = JSON.parse(regDetails ? regDetails : '');
        setRegistrationDetails(details);
        return details;
      } else {
        throw new Error(`Couldn't get registration details!`);
      }
    } catch (e) {
      console.error(e.message);
      return false;
    }
  }

  return {
    isUserAuthenticated,
    username,
    login,
    register,
    getRegistration
  };
}
const UserContainer = createContainer(useUser);
export default UserContainer;
