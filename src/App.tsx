import './App.css';

import { useRef, useState } from 'react';
import { Button, Label, TextInput, FileInput } from 'flowbite-react';

import { useS3Client } from './hooks/myS3Client';
import { useApi } from './hooks/useApi';
import CircleSpinner from './components/circleSpinner';

function App() {
  const [inputText, setInputText] = useState('');
  const [textFieldInvalid, setTextFieldInvalid] = useState(false);
  const [inputFile, setInputFile] = useState<File | null>(null);
  const [fileFieldInvalid, setFileFieldInvalid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const { uploadFile } = useS3Client();
  const { addItemToDb } = useApi();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputTextChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.value != '') {
      setTextFieldInvalid(false);
    }
    setInputText(() => event.target.value);
  };

  const handleInputFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFileFieldInvalid(false);
    if (event.target.files != null) {
      const file = event.target.files[0];
      setInputFile(file);
    } else {
      setInputFile(null);
    }
  };

  const validateInputs = () => {
    if (inputText == '') {
      setTextFieldInvalid(true);
      return false; 
    }
    if (inputFile == null) {
      setFileFieldInvalid(true);
      return false; 
    }
    const extension = inputFile.name.substring(inputFile.name.length - 4);
    if (extension !== '.txt') {
      setFileFieldInvalid(true);
      return false;
    }
    return true;
  }

  const handleInputSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(() => true);
    
    if (!validateInputs()) {
      setIsLoading(() => false);
      return;
    }


    const bucketName = import.meta.env.VITE_AWS_BUCKET_NAME;
    try {
      await uploadFile(inputFile!);
    } catch (error) {
      setStatusMessage('Error uploading the file');
      setIsLoading(false);
      return;
    }
    try {
      await addItemToDb(inputText, `${bucketName}/${inputFile!.name}`);
    } catch (error) {
      setStatusMessage('Error uploading input information to the DB');
      setIsLoading(false);
      return;
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setInputText('');
    setInputFile(null);
    setIsLoading(() => false);
    setStatusMessage('Successfully uploaded inputs!');
    setTimeout(() => {
      setStatusMessage('');
    }, 5000);
  };

  return (
    <>
      <div className='container h-full mx-auto px-4 flex flex-col align-center justify-center'>
        <form
          onSubmit={handleInputSubmit}
          className='flex mx-auto max-w-md flex-col gap-4'>
          <div>
            <div className='mb-2 block'>
              <Label
                htmlFor='inputText'
                value='Input text'
              />
            </div>
            <TextInput
              color={textFieldInvalid ? 'failure' : '' }
              value={inputText}
              onChange={handleInputTextChange}
              id='inputText'
              type='text'
              placeholder=''
              helperText={textFieldInvalid &&
                <>
                  Please add Input text
                </>
              }
            />
          </div>
          <div>
            <div className='mb-2 block'>
              <Label
                htmlFor='inputFile'
                value='Input file'
              />
            </div>
            <FileInput
              color={fileFieldInvalid ? 'failure' : '' }
              id='file'
              ref={fileInputRef}
              onChange={handleInputFileChange}
              helperText={fileFieldInvalid &&
                <>
                  Please add Input file, must be a .txt file
                </>
              }
            />
          </div>
          <Button type='submit'>{isLoading ? <CircleSpinner /> : 'Submit'}</Button>
          <p className='w-full text-center'>{statusMessage}</p>
        </form>
      </div>
    </>
  );
}

export default App;
