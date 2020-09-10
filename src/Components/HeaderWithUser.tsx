import React from 'react';
import UserLoginCard from './UserLoginCard';
import { Row, Col } from 'react-bootstrap';

interface Props {
  title: string;
}
export default function HeaderWithUser({ title }: Props) {
  return (
    <Row className="header">
      <Col>
        <h1>{title}</h1>
      </Col>
      <Col>
        <UserLoginCard />
      </Col>
    </Row>
  );
}
