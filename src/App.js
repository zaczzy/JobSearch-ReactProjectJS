import './App.css';
import { useState } from 'react';
import Navigation from './components/Navigation';
import HomePage from './components/HomePage';
import LoginForm from './components/LoginForm';
import RegistrationForm from './components/RegistrationForm';
import ProfilePage from './components/profile/ProfilePage';
import Logout from './components/Logout';
import ContactsPage from './components/contacts/ContactsPage';
import ChatPage from './components/chat/ChatPage';
import SearchPage from './components/SearchPage';
import ResetPassword from './components/ResetPassword';
import ChangePassword from './components/ChangePassword';
import StreamsList from './components/stream/StreamsList';
import Deactivate from './components/Deactivate';
// import VideoChat from './components/stream/VideoChat';
import PostPage from './components/post/PostPage';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';


function App() {
  const [currId, setCurrId] = useState('');


  const [page, setPage] = useState('home');
  //<VideoChat currId={currId} />
  return (
    <div className="App">
      <Router>
        <Navigation activeUser={currId} activePage={page} changePage={setPage} />
        <Switch>
          <Route exact path="/">
            <HomePage currId={currId} />
          </Route>
          <Route path="/profile">
            <ProfilePage currId={currId} setCurrId={setCurrId} />
          </Route>
          <Route path="/contacts">
            <ContactsPage currId={currId} />
          </Route>
          <Route path="/chats">
            <ChatPage currId={currId} />
          </Route>
          <Route path="/search">
            <SearchPage currId={currId} />
          </Route>
          <Route path="/posts">
            <PostPage currId={currId} />
          </Route>
          <Route path="/stream">
            <StreamsList currId={currId} />
          </Route>
          <Route path="/register">
            <RegistrationForm currId={currId} />
          </Route>
          <Route path="/login">
            <LoginForm currId={currId} setCurrId={setCurrId} />
          </Route>
          <Route path="/resetPassword">
            <ResetPassword currId={currId} />
          </Route>
          <Route path="/changePassword">
            <ChangePassword currId={currId} />
          </Route>
          <Route path="/deactivate">
            <Deactivate currId={currId} setCurrId={setCurrId} />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
