import React from 'react';
import './Sidebar.css';
import { AliwangwangFilled, HomeOutlined, BookOutlined, EditOutlined, UserOutlined, LogoutOutlined, MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import { Menu, Button } from 'antd';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

function Sidebar({ collapsed, toggleCollapsed }) {
  const { logout } = useAuth();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = async () => {
    await logout();
  };

  const menuItems = [
    {
      key: "home",
      icon: <HomeOutlined />,
      label: <Link to="/home">Home</Link>,
    },
    {
      key: "library",
      icon: <BookOutlined />,
      label: <Link to="/library">Library</Link>,
    },
    {
      key: "notes",
      icon: <EditOutlined />,
      label: <Link to="/notes">Notes</Link>,
    },
    {
      key: "account",
      icon: <UserOutlined />,
      label: <Link to="/account">Account</Link>,
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Logout",
      className: "logout-item",
      onClick: handleLogout, // Azione al click
    },
  ];

  return (
    <>
      {/* Collapse button*/}
      <div className="collapse-btn-container">
        <Button 
          className="collapse-btn" 
          type="text" 
          onClick={toggleCollapsed} 
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />} 
        />
      </div>
      {/* LOGO */}
      <div className="logo">
        <div className="logo-icon">
          <AliwangwangFilled />
        </div>
        {!collapsed && user && <p className="user-name">{user.name}</p>}
      </div>
      {/* MENU LIST */}
      <Menu className="menu" theme="dark" items={menuItems} />;
    </>
  );
}

export default Sidebar;