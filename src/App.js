import React, { useState, useEffect } from "react";
// eslint-disable-next-line
import { Layout, Button, Form, Input, message, Modal, Row } from "antd";
import { UserOutlined } from "@ant-design/icons";
import EditableTable from "./components/Table";
import "bootstrap/dist/css/bootstrap.min.css";
import "./style.scss";
import axios from "axios";
import api from "./components/Api";

const RegistrationForm = ({ onFinish }) => {
  const [form] = Form.useForm();

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const handleRegistration = async (values) => {
    try {
      const response = await axios.post(api + "/register", values);
      message.success(response.data.message);
      onFinish();
    } catch (error) {
      message.error(error.response.data.error);
    }
  };

  return (
    <Form
      form={form}
      name="registrationForm"
      onFinish={handleRegistration}
      onFinishFailed={onFinishFailed}
    >
      <Form.Item
        name="username"
        rules={[{ required: true, message: "Please input your username!" }]}
      >
        <Input prefix={<UserOutlined />} placeholder="Username" />
      </Form.Item>

      <Form.Item
        name="password"
        rules={[{ required: true, message: "Please input your password!" }]}
      >
        <Input.Password prefix={<UserOutlined />} placeholder="Password" />
      </Form.Item>

      
    </Form>
  );
};

const LoginForm = ({ onFinish }) => {
  const [form] = Form.useForm();
  const [modalVisible, setModalVisible] = useState(false);

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const handleLogin = async (values) => {
    try {
      // eslint-disable-next-line
      const response = await axios.post(api + "/login", values);
      console.log(values);
      console.log('clicked');
      localStorage.setItem("isLoggedIn", "true");
      onFinish();
    } catch (error) {
      message.error(error.response.data.error);
    }
  };

  const openRegistrationModal = () => {
    setModalVisible(true);
  };

  const closeRegistrationModal = () => {
    setModalVisible(false);
  };

  return (
    <>
      <Form
        form={form}
        name="loginForm"
        onFinish={handleLogin}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          name="username"
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Input prefix={<UserOutlined />} placeholder="Username" />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password prefix={<UserOutlined />} placeholder="Password" />
        </Form.Item>
        <Row justify="space-between">
          <Form.Item>
            <Button
              className="mx-lg-auto d-flex"
              type="primary"
              htmlType="submit"
            >
              Log in
            </Button>
          </Form.Item>
          <Form.Item>
            <Button
              className="mx-lg-auto d-flex"
              type="default"
              onClick={openRegistrationModal}
            >
              Register
            </Button>
          </Form.Item>
        </Row>
      </Form>
      <Modal
        title="Registration"
        open={modalVisible}
        onCancel={closeRegistrationModal}
        footer={null}
      >
        <RegistrationForm onFinish={closeRegistrationModal} />
      </Modal>
    </>
  );
};

function App() {
  const { Header, Content } = Layout;
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const loggedInStatus = localStorage.getItem("isLoggedIn");
    if (loggedInStatus === "true") {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.setItem("isLoggedIn", "false");
  };

  return (
    <Layout className="main_container">
      {!isLoggedIn ? (
        <div className="container h-100">
          <div className="row h-100 align-items-center">
            <div style={{ padding: "20px" }} className="col-lg-4 mx-lg-auto">
              <h1 className="text-center">Admin Form</h1>
              <LoginForm onFinish={() => setIsLoggedIn(true)} />
            </div>
          </div>
        </div>
      ) : (
        <Layout>
          <Layout className="layout_cust">
            <Header className="app-header d-flex align-items-center justify-content-between">
              <Button type="primary" className="logout" onClick={handleLogout}>
                Logout
              </Button>
            </Header>
            <Content className="app-content">
              <EditableTable />
            </Content>
          </Layout>
        </Layout>
      )}
    </Layout>
  );
}

export default App;
