import React, { useState, useRef, useEffect } from 'react';
import { Form, Spinner, Alert, Toast, Row, Col } from 'react-bootstrap';
import FileDragDropBox from '../Components/FileDragDropBox';
import BoldedButtons from '../Components/BoldedButtons';
import UserContainer from '../Containers/UserContainer';
import { Link } from 'react-router-dom';

import logo from '../Assets/regov.jpg';

export default function Register() {
  const user = UserContainer.useContainer();

  let [username, setUsername] = useState('');
  let [callsign, setCallsign] = useState('');
  let [icpassportFile, setIcpassportFile] = useState<File | null>(null);
  let [isLoading, setIsLoading] = useState(false);

  let [formValidated, setFormValidated] = useState(false);
  let [error, setError] = useState(false);
  let [success, setSuccess] = useState(false);

  let [showToast, setShowToast] = useState(false);
  let toastRef = useRef<HTMLDivElement>(null);

  function handleUsernameChange(evt: React.ChangeEvent<HTMLInputElement>) {
    // only allow letters
    let _username = evt.target.value.replace(/[^a-zA-Z ]/, '');
    setUsername(_username);
  }

  function handleCallSignChange(evt: React.ChangeEvent<HTMLInputElement>) {
    setCallsign(evt.target.value);
  }

  function createPhotoObjectUrl(file: File | null) {
    setIcpassportFile(file);
  }

  function checkFormOK() {
    setFormValidated(true);
    if (!username || !callsign || !icpassportFile) {
      return false;
    }
    return true;
  }

  async function handleRegister() {
    if (!checkFormOK()) {
      return false;
    }
    setIsLoading(true);
    setSuccess(false);
    setError(false);
    let info = {
      username,
      callsign,
      icpassport: icpassportFile
    };
    if (await user.register(info)) {
      setSuccess(true);
      setShowToast(true);
    } else {
      setError(true);
    }
    setIsLoading(false);
  }

  useEffect(() => {
    if (showToast) {
      if (toastRef.current) {
        toastRef.current.focus();
      }
    }
  }, [showToast]);

  return (
    <>
      <h1>Register</h1>
      <h5>Please provide your details below</h5>
      <Row>
        <Col>
          <Toast
            className="toast"
            show={showToast}
            onClose={() => setShowToast(false)}
            ref={toastRef}
          >
            <Toast.Header>
              <img src={logo} alt="Logo" className="toast-logo" />
              <strong>Regov</strong>
            </Toast.Header>
            <Toast.Body>
              You've successfully registered!{' '}
              <Link to="/inside">Let's go inside!</Link>
            </Toast.Body>
          </Toast>
          <Form>
            <Form.Group>
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                value={username}
                onChange={handleUsernameChange}
                placeholder="Enter your desired username"
                isInvalid={formValidated && username === ''}
                data-testid="username-field"
              />
              <Form.Control.Feedback type="invalid">
                Please provide a username!
              </Form.Control.Feedback>
              <Form.Text>Only letters allowed</Form.Text>
            </Form.Group>
            <Form.Group>
              <Form.Label>Callsign</Form.Label>
              <Form.Control
                type="text"
                value={callsign}
                onChange={handleCallSignChange}
                placeholder="What your mates call you"
                isInvalid={formValidated && callsign === ''}
              />
              <Form.Control.Feedback type="invalid">
                Please provide a callsign!
              </Form.Control.Feedback>
              <Form.Text>You can put whatever here</Form.Text>
            </Form.Group>
            <Form.Group>
              <Form.Label>IC/Passport photo</Form.Label>
              <FileDragDropBox
                multiFile={false}
                acceptedFileTypes={['image/gif', 'image/jpeg', 'image/png']}
                setFilteredFiles={createPhotoObjectUrl}
              />
              {icpassportFile ? (
                <div className="icpassport-preview">
                  <img
                    src={URL.createObjectURL(icpassportFile)}
                    alt="Placeholder"
                    data-testid="file-preview"
                  />
                </div>
              ) : null}
              <Form.Control
                type="text"
                style={{ display: 'none' }}
                isInvalid={formValidated && icpassportFile === null}
              />
              <Form.Control.Feedback type="invalid">
                Please provide a IC/Passport photo!
              </Form.Control.Feedback>
              <Form.Text>
                Please make sure any letters or images are clearly seen in the
                photo
              </Form.Text>
            </Form.Group>
            {error ? (
              <Alert variant="danger" className="center">
                You could not register!
              </Alert>
            ) : null}
            {success ? (
              <>
                <Alert variant="success" className="center">
                  You have successfully registered!{' '}
                  <Link to="/inside">Lets go inside!</Link>
                </Alert>
              </>
            ) : null}
            {isLoading ? (
              <Spinner animation="border" />
            ) : success ? null : (
              <BoldedButtons
                text="register"
                toUpper={true}
                clickFunc={handleRegister}
              />
            )}
          </Form>
        </Col>
      </Row>
    </>
  );
}
