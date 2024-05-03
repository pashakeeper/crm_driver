import React, {useState, useEffect} from 'react';
import {Layout, Menu, Button, Form, Input, message} from 'antd';
import {
    UserOutlined,
    VideoCameraOutlined,
    UploadOutlined,
    MenuUnfoldOutlined,
    MenuFoldOutlined
} from '@ant-design/icons';
import EditableTable from './components/Table';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./style.scss";
const LoginForm = ({onFinish}) => {
    const [form] = Form.useForm();

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <Form
            form={form}
            name="loginForm"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
        >
            <Form.Item
                name="username"
                rules={[{required: true, message: 'Please input your username!'}]}
            >
                <Input prefix={<UserOutlined/>} placeholder="Username"/>
            </Form.Item>

            <Form.Item
                name="password"
                rules={[{required: true, message: 'Please input your password!'}]}
            >
                <Input.Password prefix={<UserOutlined/>} placeholder="Password"/>
            </Form.Item>

            <Form.Item>
                <Button className="mx-lg-auto d-flex" type="primary" htmlType="submit">Log in</Button>
            </Form.Item>
        </Form>
    );
};

function App() {
    const {Header, Sider, Content} = Layout;
    const [collapsed, setCollapsed] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const loggedInStatus = localStorage.getItem('isLoggedIn');
        if (loggedInStatus === 'true') {
            setIsLoggedIn(true);
        }
    }, []);

    const handleLogin = ({username, password}) => {
        if (username === 'admin' && password === 'admin') {
            setIsLoggedIn(true);
            localStorage.setItem('isLoggedIn', 'true');
        } else {
            message.error('Неверные учетные данные!');
        }
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        localStorage.setItem('isLoggedIn', 'false');
    };

    return (
        <Layout className='main_container'>
            {!isLoggedIn ? (
                <div className="container h-100">
                    <div className="row h-100 align-items-center">
                        <div style={{padding: '20px'}} className="col-lg-4 mx-lg-auto">
                            <h1 className="text-center">Admin Form</h1>
                            <LoginForm onFinish={handleLogin}/>
                        </div>
                    </div>
                </div>
            ) : (
                // Ako je korisnik prijavljen, prikazuje se glavna stranica
                <Layout>
                    <Sider trigger={null} collapsible collapsed={!collapsed}>
                        <div className="demo-logo-vertical"/>
                        <Menu
                            theme="dark"
                            className='main_menu'
                            mode="inline"
                            defaultSelectedKeys={['1']}
                            items={[
                                {
                                    key: '1',
                                    icon: <UserOutlined/>,
                                    label: 'nav 1',
                                },
                                {
                                    key: '2',
                                    icon: <VideoCameraOutlined/>,
                                    label: 'nav 2',
                                },
                                {
                                    key: '3',
                                    icon: <UploadOutlined/>,
                                    label: 'nav 3',
                                },
                            ]}
                        />
                    </Sider>
                    <Layout className='layout_cust'>
                        <Header className="app-header d-flex align-items-center justify-content-between">
                            <Button
                                className='trigger'
                                type="text"
                                icon={collapsed ? <MenuUnfoldOutlined/> : <MenuFoldOutlined/>}
                                onClick={() => setCollapsed(!collapsed)}
                            />
                            <Button type="primary" className="logout" onClick={handleLogout}>Logout</Button>
                        </Header>
                        <Content className="app-content">
                            <EditableTable/>
                        </Content>
                    </Layout>
                </Layout>
            )}
        </Layout>
    );
}

export default App;
