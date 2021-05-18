import React, { useState } from 'react';
import { Tab, Modal, Button } from 'react-bootstrap';
import ChatConversations from './ChatConversations';
import NewConversationModal from './NewConversationModal';

export default function ChatSidebar(props) {
  // state hooks
  const [modalOpen, setModalOpen] = useState(false);
//
  function closeModal() {
    setModalOpen(false);
  }

  return (
    <div style={ {width: '250px'} } className="d-flex flex-column">
      <Tab.Container>
        <Tab.Content className="border-right overflow-auto flex-grow-1">
          <ChatConversations currId={props.currId}
          setSelectedConversation={props.setSelectedConversation}
          setSelectedChatId={props.setSelectedChatId}
          />
        </Tab.Content>
        <Tab.Content className='py-2'>  {/*y-directional padding of 2px*/}
          <Button className="rounded-0" onClick={() => setModalOpen(true)}>
            New Conversation
          </Button>
        </Tab.Content>
      </Tab.Container>
      <Modal show={modalOpen} onHide={closeModal}>
        <NewConversationModal closeModal={closeModal} currId={props.currId}/>
      </Modal>
    </div>
  );
}
