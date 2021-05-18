import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Image, Button, Nav } from 'react-bootstrap';
import { fetchUserProfile, fetchSetAvatar } from '../../modules/user';
import { logout } from '../../modules/logout';
import { LinkContainer } from 'react-router-bootstrap';
import AvatarUpload from './AvatarUpload';
import host from '../../host-config';
import { useHistory } from 'react-router-dom';
import MyPosts from './MyPosts';

export default function ProfilePage(props) {
  const [currUser, setCurrUser] = useState('');
  const [currAvatar, setAvatar] = useState(null);
  const [avatarSrc, setAvatarSrc] = useState(null);
  const history = useHistory();

  useEffect(async () => {
      if(props.currId) {
        const userRes = await fetchUserProfile(props.currId);
        setCurrUser(userRes.profile);
        if (userRes.profile.profilePic) {
          setAvatarSrc(host + userRes.profile.profilePic);
        }
      }
  }, [props.currId])

  useEffect(async () => {
    if (currAvatar) {
      console.log(currAvatar);
      const res = await fetchSetAvatar(currAvatar);
      console.log(res);
      if (res === "success") {
        setAvatarSrc(host + currAvatar);
      }
    }
  }, [currAvatar])

  function doLogout(e) {
    logout(props.currId)
    .then(result => {
      if(result.message === "Successfully logged out") {
        props.setCurrId('')
        history.push('/login');
      }
    })
  }

  return (
    <Container fluid style={{height: '100%'}}>
      <Row>
        <Col sm={4}>
        {currUser &&
          <>
            {/* <Image src={currUser.profilePic} rounded fluid/> */}
            <Image src={avatarSrc ? avatarSrc : "/stockImg.jpeg"} rounded fluid />
            <h2 style={{padding:'20px 20px 20px 20px'}}>{currUser.displayName}</h2>
            <p>Joined on {currUser.createdAt.toString().substring(0, 10)}</p>
            <LinkContainer to="/changePassword">
                <Nav.Link>Change Password</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/deactivate">
                <Nav.Link>Deactivate Account</Nav.Link>
            </LinkContainer>
            <Button onClick={doLogout}>Logout</Button>
            <AvatarUpload setAvatar={setAvatar} />
          </>
        }

        </Col>
        <Col>
          {/* Your posts */}
          <MyPosts currId={props.currId}/>
        </Col>
      </Row>
    </Container>
  );
}
