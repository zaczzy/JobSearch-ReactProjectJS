// import { Menu, Layout } from 'antd';
import { Navbar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
// const { Header } = Layout;

function Navigation(props) {
  const { activeUser, activePage, changePage } = props;

  return (
    <div className="Navigation">
      <Navbar bg="light" variant="light" style={{height:'8vh'}}>
        <LinkContainer to="/">
          <Navbar.Brand>Splash</Navbar.Brand>
        </LinkContainer>
        <Nav className="mr-auto">
          {activeUser ? (
            <>
              <LinkContainer to="/profile">
                <Nav.Link>Profile</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/contacts">
                <Nav.Link>Contacts</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/chats">
                <Nav.Link>Chats</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/search">
                <Nav.Link>Search</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/posts">
                <Nav.Link>Posts</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/stream">
                <Nav.Link>Streams</Nav.Link>
              </LinkContainer>
            </>
          ) : (
            <>
              <LinkContainer to="/login">
                <Nav.Link>Login</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/register">
                <Nav.Link>Register</Nav.Link>
              </LinkContainer>
            </>
          )}

        </Nav>

      </Navbar>
    </div>
  );
}

export default Navigation;
