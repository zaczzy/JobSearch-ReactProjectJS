import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Tabs, Tab } from 'react-bootstrap';
import ContactInfo from './ContactInfo';
import FollowerInfo from './FollowerInfo';
import ContactSearch from './ContactSearch'
import { fetchFollowed, fetchFollowers } from '../../modules/user';

export default function ContactsPage(props) {
  // state
  const [contacts, setContacts] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [lastAction, setLastAction] = useState('');
  // fetch contacts on load
  useEffect(() => {
    async function fetchData() {
      const result = await fetchFollowed(props.currId);
      setContacts(Array.from(result));
      const followRes = await fetchFollowers(props.currId);
      setFollowers(Array.from(followRes));
    }
    fetchData();
  }, [lastAction, props.currId])
  return (
    <Container>
      <Row>
        <Col sm={4}>
          <ContactSearch currId={props.currId} setLastAction={setLastAction} />
        </Col>
        <Col sm={8}>
        <Tabs defaultActiveKey="followed" id="tab-example">
          <Tab eventKey="followed" title="Followed">
            {contacts.map(contact => (
              <ContactInfo key={contact._id}
                contact={contact}
                currId={props.currId}
                setLastAction={setLastAction}
              />
            ))}
          </Tab>
          <Tab eventKey="followers" title="Followers">
            {followers.map(contact => (
              <FollowerInfo key={contact._id}
                contact={contact}
                currId={props.currId}
                setLastAction={setLastAction}
              />
            ))}
          </Tab>
        </Tabs>
        </Col>
      </Row>
    </Container>
  );
}
