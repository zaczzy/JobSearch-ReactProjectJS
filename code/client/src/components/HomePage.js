import { Layout } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';
// import splash_logo from '../splash_logo.png';
const { Content } = Layout;

function HomePage(props) {

  return (
    <Content>
      <div className="site-layout-content">
        <div className="home-content">
          <div className="home-text">
            <h1>Welcome!</h1>
            <img src="/splash_logo.png" alt="logo" />
            <p>
              Welcome to <em>Splash</em>. To log in, click{' '}
              <Link to="/login">here</Link>. To register click{' '}
              <Link to="/register">here</Link>.
            </p>
          </div>
          <div>
          </div>
        </div>
      </div>
    </Content>
  );
}

export default HomePage;
