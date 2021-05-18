import React, { useState, useEffect } from 'react';
import { ListGroup } from 'react-bootstrap';
import { fetchChats } from '../../modules/chat';


export default function ChatConversations(props) {
  const [conversationIndex, setConversationIndex] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [chatRecipients, setChatRecipients] = useState([]);

  // get chats on load
  useEffect(() => {
    async function fetchData() {
      const result = await fetchChats(props.currId);
      setConversations(result.chats);
      // get other user names
      const otherUser = result.chats.map((chat, i) => {
        if(chat.users[0]._id.toString() === props.currId) {
          console.log('Chat users', chat.users)
          return chat.users[1].displayName
        } else {
          return chat.users[0].displayName;
        }
      })
      console.log('Other user names', otherUser);
      setChatRecipients(otherUser);
    }
    fetchData();
  }, [props.currId]);
  // select conversation
  function selectConv(idx, cid) {
    setConversationIndex(idx);
    props.setSelectedConversation(true);
    props.setSelectedChatId(cid.toString());
  }
  return (
    <ListGroup variant="flush">
      {conversations.map((conversation, i) => (
        <ListGroup.Item
        key={i}
        action
        onClick={() => selectConv(i, conversation._id)}
        active={i === conversationIndex ? true : false}
        >
        {chatRecipients[i]}
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
}
