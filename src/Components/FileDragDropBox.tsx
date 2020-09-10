import React, { useState, useRef, useEffect } from 'react';
import { Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload } from '@fortawesome/free-solid-svg-icons';

interface Props {
  multiFile: boolean;
  acceptedFileTypes: Array<string>;
  setFilteredFiles(f: File | null): void;
}
export default function FileDragDropBox({
  multiFile,
  acceptedFileTypes,
  setFilteredFiles
}: Props) {
  let [files, setFiles] = useState<FileList | null>(null);
  let inputFileRef = useRef<HTMLInputElement | null>(null);

  let [overClass, setOverClass] = useState('');

  let [error, setError] = useState('');

  function stopDefault(evt: React.DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();
  }

  function checkMultiFileOK(droppedFiles: FileList | null) {
    if (multiFile === false) {
      if (droppedFiles) {
        if (droppedFiles.length > 1) {
          setError('Only 1 file please!');
          return false;
        }
      }
    }
    return true;
  }
  function checkFileTypeOK(droppedFiles: FileList | null) {
    if (droppedFiles) {
      let fileArray = Array.from(droppedFiles);
      for (let f of fileArray) {
        if (acceptedFileTypes) {
          if (!acceptedFileTypes.includes(f.type)) {
            setError('Unaccepted file type!');
            return false;
          }
        }
      }
    }
    return true;
  }
  function handleDrop(evt: React.DragEvent<HTMLDivElement>) {
    stopDefault(evt);
    setOverClass('');

    setFiles(evt.dataTransfer.files);
  }

  function checkFiles() {
    setError('');
    if (!checkMultiFileOK(files)) {
      setFiles(null);
      return false;
    }

    if (!checkFileTypeOK(files)) {
      setFiles(null);
      return false;
    }

    setFilteredFiles(files ? files[0] : null);
  }

  useEffect(() => {
    if (files) {
      checkFiles();
    }
  }, [files]);

  function handleDragOver(evt: React.DragEvent<HTMLDivElement>) {
    setOverClass('over');
    stopDefault(evt);
  }

  function handleDragLeave(evt: React.DragEvent<HTMLDivElement>) {
    setOverClass('');
    stopDefault(evt);
  }

  function handleClick() {
    if (inputFileRef.current) {
      inputFileRef.current.click();
    }
  }

  return (
    <>
      {error ? (
        <Alert variant="danger" className="center">
          {error}
        </Alert>
      ) : null}
      <div
        className={`drag-drop-box ${overClass}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
        data-testid="file-drop-box"
      >
        <FontAwesomeIcon icon={faUpload} size="5x" />
        <span>
          <b>Click or Drop your file here</b>
        </span>
        <input
          type="file"
          ref={inputFileRef}
          multiple
          onChange={(evt: React.ChangeEvent<HTMLInputElement>) =>
            setFiles(evt.target.files ? evt.target.files : null)
          }
          data-testid="file-field"
        />
      </div>
    </>
  );
}
