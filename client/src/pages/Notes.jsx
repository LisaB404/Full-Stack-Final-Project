import React, { useState } from "react";
import { Layout } from "antd";
import Sidebar from "../components/Sidebar/Sidebar";

const { Sider, Content } = Layout;

function Notes() {
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
          <div className="container">
            <h2 className="title">
              <span className="gradient-text">Your Notes</span>
            </h2>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}

export default Notes;
