import React, { useState } from 'react'
import ChatSidebar from './ChatSidebar';
import OpenConversation from './OpenConversation';

export default function ChatPage(props) {
  // state
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [selectedChatId, setSelectedChatId] = useState(null);
  // <div className="d-flex" style={{ height: '90vh' }}>
  return (
    <div className="d-flex" style={{ height: '92vh' }}>
      <ChatSidebar currId={props.currId}
        setSelectedConversation={setSelectedConversation}
        setSelectedChatId={setSelectedChatId} />
      {selectedConversation &&
        <OpenConversation currId={props.currId}
        selectedChatId={selectedChatId}
        />}
    </div>
  );
}
