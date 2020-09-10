import React from 'react';
import { Button } from 'react-bootstrap';

interface Props {
  clickFunc(): void;
  text: string;
  toUpper: boolean;
  variant?: string;
}
export default function BoldedButton({
  clickFunc,
  text,
  toUpper,
  variant
}: Props) {
  let displayText = toUpper ? text.toUpperCase() : text;

  return (
    <Button onClick={clickFunc} variant={variant}>
      <b>{displayText}</b>
    </Button>
  );
}
