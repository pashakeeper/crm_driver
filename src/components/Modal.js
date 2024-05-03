import React from 'react';
import { Modal, Form, Input, Select, DatePicker, Space, Button } from 'antd';
import InputMask from "react-input-mask";
import moment from 'moment';
import { SaveOutlined } from '@ant-design/icons';
const ModalForm = ({visible, onCancel, onOk, form, isModalOpen, handleOk, handleCancel, handleOkForm}) => {
    return (
        <Modal title="Edit table Data" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} footer={[
            <Button key="back" onClick={handleCancel}>
                Cancel
            </Button>,
            <Button key="save" type="primary" onClick={handleOkForm} icon={<SaveOutlined />}>
                Save
            </Button>,
        ]}>
            <Form form={form} layout="vertical" name="form_in_modal" initialValues={{ remember: true }}>
                <Form.Item
                    name="truckNumber"
                    label="Truck Number"
                    rules={[{ required: false, message: 'Please input the truck number!' }]}
                >
                    <Input key="truckNumber" />
                </Form.Item>
                <Form.Item
                    name="status"
                    label="Status"
                    rules={[{ required: false, message: 'Please input the Status!' }]}
                >
                    <Select
                        key="status"
                        defaultValue={'Chose status for truck'}
                        style={{ width: '100%' }}
                        options={[
                            { value: 'Working', label: 'Working' },
                            { value: 'OnHold', label: 'OnHold' },
                            { value: 'Stoped', label: 'Stoped' },
                        ]}
                    />
                </Form.Item>
                <Form.Item
                    name="whenWillBeThere"
                    label="When Will Be There"
                    rules={[{ required: false, message: 'Please input the When Will Be There!' }]}
                >
                    <Space direction="vertical" size={12}>
                        <DatePicker
                            key="whenWillBeThere"
                            showTime
                            onChange={(value, dateString) => {
                                console.log('Selected Time: ', value);
                                console.log('Formatted Selected Time: ', dateString);
                                const formattedDate = value.format('YYYY-MM-DD HH:mm:ss');
                                form.setFieldsValue({ whenWillBeThere: formattedDate });
                                console.log('Selected Time on Ok: ', formattedDate);
                            }}
                            onOk={(value) => {
                                const formattedDate = value.format('YYYY-MM-DD HH:mm:ss');
                                form.setFieldsValue({ whenWillBeThere: formattedDate });
                                console.log('Selected Time on Ok: ', formattedDate);
                            }}
                        />
                    </Space>
                </Form.Item>
                <Form.Item
                    name="driverName"
                    label="Driver name"
                    rules={[{ required: false, message: 'Please input the Driver name!' }]}
                >
                    <Input key="driverName" />
                </Form.Item>
                <Form.Item
                    name="cellPhone"
                    label="Phone Number"
                    rules={[{ required: false, message: 'Please input the Driver name!' }]}
                >
                    <InputMask
                        key="cellPhone"
                        mask={'999-999-999'}
                        autoComplete="off"
                        className='ant-input css-dev-only-do-not-override-11xg00t ant-input-outlined'
                    >
                    </InputMask>
                </Form.Item>
                <Form.Item
                    name="cityStateZip"
                    label="ZipCode"
                // rules={[{ required: false, message: 'Please input the Driver name!' }]}
                >
                    <Input key="cityStateZip" />
                </Form.Item>
                {/* Добавьте другие поля формы здесь */}
            </Form>
        </Modal>
    );
};

export default ModalForm;