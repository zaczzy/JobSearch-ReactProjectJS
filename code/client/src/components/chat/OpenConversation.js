import React, { useState, useEffect, useCallback } from 'react';
import { Form, InputGroup, Button } from 'react-bootstrap';
import { fetchSendChat, fetchChatWithUser, fetchSendUpload } from '../../modules/chat';
import MicIcon from '@material-ui/icons/Mic';
import ImageIcon from '@material-ui/icons/Image';
import FileUpload from '../post/FileUpload';
import host from '../../host-config';
// import { sendMessage } from '../modules/socket';
// import openSocket from 'socket.io-client';

export default function OpenConversation(props) {
  // state
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([]);
  const [currUserIdx, setCurrUserIdx] = useState(0);
  const [otherUserName, setOtherUserName] = useState('');
  const [upload, setUpload] = useState(false);
  const [type, setType] = useState(0);
  const [appendImgs, setAppendImgs] = useState([]);

  const setRef = useCallback(node => {
    if (node) {
      node.scrollIntoView({ smooth: true })
    }
  }, [])

  // chat update func
  function getUpdatedChat() {
    fetchChatWithUser(props.currId, props.selectedChatId)
    .then(chatRes => {
      const chat = chatRes.chat;
      // set currUserIdx
      if(chat.users[0]._id.toString() === props.currId) {
        setCurrUserIdx(0);
        setOtherUserName(chat.users[1].displayName);
      } else {
        setCurrUserIdx(1);
        setOtherUserName(chat.users[0].displayName);
      }

      // set messages
      setMessages(chat.messages);
    })
  }

  useEffect(() => {
    if(appendImgs && appendImgs.length > 0) {
      let url = appendImgs[0];
      fetchSendUpload(props.currId, props.selectedChatId, url, type)
      .then(uploadRes => {
        console.log('Upload returned', uploadRes)
        setAppendImgs([])
      })
    }

  }, [appendImgs])

  // update chat window on chat switch
  useEffect(() => {
    getUpdatedChat();
    const interval = setInterval(() => getUpdatedChat(), 2000);
    return () => {
      // Clean up the interval
      clearInterval(interval);
    };
  }, [props.selectedChatId]);

  function handleSubmit(e) {
    e.preventDefault();
    console.log('Input is', inputText);
    fetchSendChat(props.currId, props.selectedChatId, inputText)
    .then(result => {
      // if received, update chat
      if(result.receipt){
        getUpdatedChat();
      }
    })
    // clear input box
    setInputText('');
  }

  function handleInputText(e) {
    setInputText(e.target.value)
    setUpload(false)
  }

  function handleMediaSelect(type, upload) {
    setUpload(true);
    setType(type);
  }

  return (
    <div className="d-flex flex-column flex-grow-1">
      <div className="flex-grow-1 overflow-auto">
        <div className="d-flex flex-column align-items-start justify-content-end px-3">
          {messages.map((message, index) => {
            const lastMessage = messages.length - 1 === index
            return (
              <div
                ref={lastMessage ? setRef : null}
                key={index}
                className={`my-1 d-flex flex-column ${message.from === currUserIdx ? 'align-self-end align-items-end' : 'align-items-start'}`}
              >
              {message.text ? (
                <div
                  className={`rounded px-2 py-1 ${message.from === currUserIdx ? 'bg-primary text-white' : 'border'}`}>
                  {message.text}
                  </div>
              ) : (
                <>
                {message.imageURL ? (
                  <img src={host+message.imageURL} width="300" height="200" alt="" />
                ) : (
                  <audio controls>
                    <source src={host+message.audioURL} />
                  </audio>
                )}
                </>
              )}
                <div className={`text-muted small ${message.from === currUserIdx ? 'text-right' : ''}`}>
                  {message.from === currUserIdx ? 'You' : otherUserName}
                </div>
              </div>
            )
          })}
        </div>
      </div>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="m-1">
          <InputGroup style={{width: '600px'}}>
            <InputGroup.Prepend>
              <Button variant="outline-secondary" onClick={() => handleMediaSelect(0, true)}>
                <ImageIcon color="primary" fontSize="default" />
              </Button>
              <Button variant="outline-secondary" onClick={() => handleMediaSelect(3, true)}>
                <MicIcon color="primary" fontSize="default" />
              </Button>
            </InputGroup.Prepend>
            <Form.Control
              as="textarea"
              required
              value={inputText}
              onChange={e => handleInputText(e)}
              style={{ height: '75px' ,resize: 'none' }}
            />
            <InputGroup.Append>
              <Button type="submit">Send</Button>
            </InputGroup.Append>
          </InputGroup>
        </Form.Group>
      </Form>
      {upload && <FileUpload setAppendImgs={setAppendImgs} type={type} />}
    </div>
  );
}
