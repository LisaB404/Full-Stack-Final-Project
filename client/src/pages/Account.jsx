import React, { useState } from "react";
import { Layout } from "antd";
import Sidebar from "../components/Sidebar/Sidebar";
import './Account.css'
const { Sider, Content } = Layout;

function Account() {
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Layout>
      <Sider
        className="sider"
        collapsed={collapsed}
        collapsible
        trigger={null}
        width={180}
        collapsedWidth={60}
      >
        <Sidebar collapsed={collapsed} toggleCollapsed={toggleCollapsed} />
      </Sider>
      <Layout>
        <Content className="content">
          <div className="account-container">
            <h2 className="title">
              <span className="gradient-text">Your Account</span>
            </h2>
            <div className="account-info">
            <p>Username: </p>
            <p>Email: </p>
            <p>Password: </p>
            </div>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}

export default Account;
