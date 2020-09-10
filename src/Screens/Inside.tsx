import React, { useEffect, useState } from 'react';
import HeaderWithUser from '../Components/HeaderWithUser';
import { Row, Col, Form, Spinner, Alert } from 'react-bootstrap';
import UserContainer from '../Containers/UserContainer';
import RegistrationDetails from '../Components/RegistrationDetails';

interface RegDetailsProps {
  username: string;
  callsign: string;
  icpassport: string;
}
export default function Inside() {
  const user = UserContainer.useContainer();

  let [isLoading, setIsLoading] = useState(false);
  let [error, setError] = useState('');

  let [regDetails, setRegDetails] = useState<RegDetailsProps | null>(null);

  useEffect(() => {
    async function getReg() {
      try {
        setIsLoading(true);
        let reg = await user.getRegistration();
        if (reg !== false) {
          setRegDetails(reg);
        } else {
          throw new Error(`Couldn't get registrations!`);
        }
      } catch (e) {
        setError(e.message);
      } finally {
        setIsLoading(false);
      }
    }

    getReg();
  }, []);

  return (
    <>
      <HeaderWithUser title="Inside" />
      <Row>
        <Col>You're inside now!</Col>
      </Row>
      <hr />
      <h3>Your Submission</h3>
      {error ? <Alert variant="danger">{error}</Alert> : null}
      {isLoading ? (
        <Spinner animation="border" />
      ) : (
        <Row>
          <Col>
            <Form.Group>
              {regDetails !== null ? (
                <RegistrationDetails
                  username={regDetails.username}
                  callsign={regDetails.callsign}
                  icpassport={regDetails.icpassport}
                />
              ) : (
                'You have no submissions.'
              )}
            </Form.Group>
          </Col>
        </Row>
      )}
    </>
  );
}
