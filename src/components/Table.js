import React, { useEffect, useState } from 'react';
import { Table, Button, Row, Form, Input, Modal, Select, DatePicker, Space, Tag, Tooltip } from 'antd';
import {SkinFilled} from '@ant-design/icons';
import InputMask from "react-input-mask";
import { EditOutlined, SaveOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';
import TableSearch from './Search';
import StatusTag from './Tag';
import api from './Api';

const EditableTable = () => {
    const [trucks, setTrucks] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTruck, setEditingTruck] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [filterValue, setFilterValue] = useState('');
    const [form] = Form.useForm();
    // eslint-disable-next-line
    const [newTruck, setNewTruck] = useState({});
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [deletingTruckId, setDeletingTruckId] = useState(null);
    const [destinationValue, setDestinationValue] = useState('');
    const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
    const [currentComment, setCurrentComment] = useState('');
    const { TextArea } = Input;

    const textTool = "To open comment CLICK!"



    // const [currentPage, setCurrentPage] = useState(1);
    // const [pageSize, setPageSize] = useState(55);


    const startEdit = (record) => {
        setEditingTruck(record);
        setIsModalOpen(true);
    };
    useEffect(() => {

        const storedDestination = localStorage.getItem('destination');
        if (storedDestination) {
            setDestinationValue(storedDestination);
        }
        fetchData();
    }, []);
    const fetchData = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(api + '/trucks');
            const trucksWithCoordinates = await Promise.all(response.data.map(async truck => {
                return { ...truck };
            }));
            setTrucks(trucksWithCoordinates);
            setIsLoading(false);

        } catch (error) {
            console.error('Error fetching data:', error);
            setIsLoading(false);
        }
    };
    const handleDestinationChange = (value) => {
        localStorage.setItem('destination', value);
        setDestinationValue(value);
        const updatedTrucks = trucks.map(truck => {
            return {
                ...truck,
                Destination: value
            };
        });
        setTrucks(updatedTrucks);
        updatedTrucks.forEach(async truck => {
            const distance = await calculateDistance(truck.CityStateZip, value);
            const updatedTruck = { ...truck, distance: distance ? Math.round(distance) : null };
            setTrucks(prevTrucks => prevTrucks.map(prevTruck => prevTruck.ID === updatedTruck.ID ? updatedTruck : prevTruck));
        });
    };
    const handleSearch = ({ truckNumber, status, name, phoneNumber }) => {
        setFilterValue({ truckNumber, status, name, phoneNumber });
    };
    const filteredTrucks = trucks.filter(truck => {
        const truckNumberMatch = !filterValue.truckNumber || truck.TruckNumber.toLowerCase().includes(filterValue.truckNumber.toLowerCase());
        const statusMatch = !filterValue.status || truck.Status.toLowerCase().includes(filterValue.status.toLowerCase());
        const nameMatch = !filterValue.name || truck.DriverName.toLowerCase().includes(filterValue.name.toLowerCase());
        const phoneNumberMatch = !filterValue.phoneNumber || 
            truck.CellPhone.toLowerCase().includes(filterValue.phoneNumber.toLowerCase()) || 
            truck.contactphone.toLowerCase().includes(filterValue.phoneNumber.toLowerCase());
        return truckNumberMatch && statusMatch && nameMatch && phoneNumberMatch;
    });
    const geocodeAddress = async (address) => {
        try {
            const response = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=pk.eyJ1IjoiY29ubmVjdDEwMDUwMCIsImEiOiJjbHo4aHVmaHgwMTVtMm5xeW1uNWp5dWo1In0.FmATHzAdINyxJwRyglqxlA`);
            const features = response.data.features;
            if (features.length > 0) {
                const coordinates = features[0].center;
                return coordinates;
            } else {
                console.error('No coordinates found for the address:', address);
                return null;
            }
        } catch (error) {
            console.error('Error geocoding address:', error);
            return null;
        }
    };
    const calculateDistance = async (origin, destination) => {
        try {
            const originCoordinates = await geocodeAddress(origin);
            const destinationCoordinates = await geocodeAddress(destination);

            if (originCoordinates && destinationCoordinates) {
                const response = await axios.get(`https://api.mapbox.com/directions/v5/mapbox/driving/${originCoordinates[0]},${originCoordinates[1]};${destinationCoordinates[0]},${destinationCoordinates[1]}?access_token=pk.eyJ1IjoiY29ubmVjdDEwMDUwMCIsImEiOiJjbHo4aHVmaHgwMTVtMm5xeW1uNWp5dWo1In0.FmATHzAdINyxJwRyglqxlA`);
                const distance = response.data.routes[0].distance / 1609.34;
                return distance;
            } else {
                return null;
            }
        } catch (error) {
            console.error('Error calculating distance:', error);
            return null;
        }
    };
    const handleOkForm = async () => {
        try {
            const values = await form.validateFields();
            console.log('Success:', values);
            const updatedValues = {
                ...values,
                isActive: false,
            };
            if (editingTruck) {
                setIsLoading(true);
                axios.put(api + `/trucks/${editingTruck.ID}`, updatedValues)
                    .then(response => {
                        console.log(response.data);
                        setIsModalOpen(false);
                        setIsLoading(false);
                        setEditingTruck(null);
                        form.resetFields();
                        fetchData();
                    })
                    .catch(error => {
                        console.error('There was an error!', error);
                    });
            }
        } catch (errorInfo) {
            console.log('Failed:', errorInfo);
        }

    };
    const handleCreate = async () => {
        try {
            const values = await form.validateFields();
            setIsLoading(true);
            axios.post(api + '/trucks', values)
                .then(response => {
                    console.log(response.data);
                    setIsModalOpen(false);
                    setIsLoading(false);
                    form.resetFields();
                    fetchData(); // Обновляем данные после создания новой записи
                })
                .catch(error => {
                    console.error('There was an error!', error);
                    setIsLoading(false);
                });
        } catch (errorInfo) {
            console.log('Failed:', errorInfo);
        }
    }

    const showDeleteModal = (id) => {
        setDeletingTruckId(id);
        setIsDeleteModalVisible(true);
    }
    const handleDeleteConfirmed = () => {
        handleDelete(deletingTruckId);
        setIsDeleteModalVisible(false);
    }
    const handleOk = () => {
        form.resetFields();
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    useEffect(() => {
        fetchData();

    }, [destinationValue]);

    const handleDelete = async (id) => {
        try {
            setIsLoading(true);
            axios.delete(api + `/trucks/${id}`)
                .then(response => {
                    console.log(response.data);
                    setIsLoading(false);
                    fetchData();
                })
                .catch(error => {
                    console.error('There was an error!', error);
                    setIsLoading(false);
                });
        } catch (errorInfo) {
            console.log('Failed:', errorInfo);
        }
    }

    const handleCommentClick = (comment) => {
        setCurrentComment(comment);
        setIsCommentModalOpen(true);
    };

    const columns = [
        {
            title: 'Truck №',
            dataIndex: 'truckNumber',
            style: { width: 200 },
            key: 'truckNumber',
            sorter: (a, b) => a.TruckNumber.localeCompare(b.TruckNumber),
            render: (text, record) => (
                <p key={record.ID}>{record.TruckNumber}</p>
            )
        },
        {
            title: 'Loads/Mark',
            dataIndex: 'rate',
            key: 'rate',
            width: '120px',
            sorter: (a, b) => a.rate - b.rate,
            render: (text, record) => (
                <>
                    <Tag color="geekblue" style={{ marginRight: '0' }} >
                        {record.rate.toUpperCase()}
                    </Tag>
                    {record.isActive ? <div className='driver_update'><SkinFilled style={{ color: '#fff', fontSize: '9px' }} /></div> : ''}
                </>
            )
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'Status',
            sorter: (a, b) => a.Status.localeCompare(b.Status),
            render: (text, record) => (
                <StatusTag status={record.Status}></StatusTag>
            )
        },
        {
            title: 'When will be there',
            dataIndex: 'whenWillBeThere',
            key: 'When',
            width: '170px',
            className: 'time',
            render: (text, record) => {
                const date = new Date(record.WhenWillBeThere);
                const formattedDate = date.getFullYear() + '-' +
                    ('0' + (date.getMonth() + 1)).slice(-2) + '-' +
                    ('0' + date.getDate()).slice(-2) + ' ' +
                    ('0' + date.getHours()).slice(-2) + ':' +
                    ('0' + date.getMinutes()).slice(-2);
                return <p key={record.ID}>{formattedDate}</p>;
            }
        },
        {
            title: 'Driver name',
            dataIndex: 'driverName',
            key: 'Driver',
            sorter: (a, b) => a.DriverName.localeCompare(b.DriverName),
            render: (text, record) => (
                <p key={record.ID}>{record.DriverName}</p>
            )
        },
        {
            title: 'Contact phone',
            dataIndex: 'contactphone',
            key: 'contactphone',
            width: '150px',
            render: (text, record) => (
                <p key={record.ID}>{record.contactphone}</p>
            )
        },
        {
            title: 'Cell phone',
            dataIndex: 'cellPhone',
            key: 'Cell',
            width: '120px',
            render: (text, record) => (
                <p key={record.ID}>{record.CellPhone}</p>
            )
        },
        {
            title: 'E-mail',
            dataIndex: 'mail',
            key: 'Mail',
            width: '150px',
            render: (text, record) => (
                <p key={record.ID}>{record.mail}</p>
            )
        },
        {
            title: 'City, State zipCode',
            dataIndex: 'cityStateZip',
            key: 'City',
            sorter: (a, b) => a.CityStateZip.localeCompare(b.CityStateZip),
            render: (text, record) => (
                <p key={record.ID}>{record.CityStateZip}</p>
            )
        },
        {
            title: 'Distance',
            key: 'Distance',
            sorter: (a, b) => a.distance - b.distance,
            render: (text, record) => (
                <p>{record.distance} mil.</p>
            )
        },
        {
            title: 'Dimensions\n/Payload',
            dataIndex: 'dimensions',
            key: 'Dimensions',
            sorter: (a, b) => a.Dimensions.localeCompare(b.Dimensions),
            render: (text, record) => (
                <p key={record.ID}>{record.Dimensions}</p>
            )
        },
        {
            title: 'Hold By Dispetcher',
            dataIndex: 'holdTime',
            key: 'HoldTime',
            width: '100px',
            sorter: (a, b) => a.HoldTime - b.HoldTime,
            render: (text, record) => (
                <p key={record.ID}>{record.HoldTime}</p>
            )
        },
        {
            title: 'Comment',
            dataIndex: 'Comment',
            key: 'Comment',
            render: (text, record) => (
                <div className='comment' onClick={() => handleCommentClick(record.comments)} style={{ cursor: 'pointer', color: 'blue' }}>
                    <Tooltip placement="top" title={textTool}>
                        {record.comments}
                    </Tooltip>

                </div>
            )
        },
        {
            title: '#',
            dataIndex: 'actions',
            key: 'Actions',
            render: (text, record) => (
                <Space size="middle">
                    <Button key="edit" icon={<EditOutlined />} onClick={() => startEdit(record)} />
                    <Button key="delete" icon={<DeleteOutlined />} onClick={() => showDeleteModal(record.ID)} />
                </Space>
            )
        }
    ];

    return (
        <>
            <Row className='create_row'>
                <Button type="primary" onClick={() => { setIsModalOpen(true); setEditingTruck(null); }}>
                    Create New Driver
                </Button>
                <p className='dest_label'>Enter Here destination.</p>
                <Input
                    value={destinationValue}
                    onChange={(e) => handleDestinationChange(e.target.value)}
                    placeholder="Enter Destination"
                    style={{ marginLeft: '10px', width: '200px' }}
                />
                <Modal
                    title="Confirm Deletion"
                    open={isDeleteModalVisible}
                    onOk={handleDeleteConfirmed}
                    onCancel={() => setIsDeleteModalVisible(false)}
                >
                    <p>Are you sure you want to delete this driver?</p>
                </Modal>
                <Modal
                    title="Comment"
                    open={isCommentModalOpen}
                    onOk={() => setIsCommentModalOpen(false)}
                    onCancel={() => setIsCommentModalOpen(false)}
                    footer={[
                        <Button key="close" onClick={() => setIsCommentModalOpen(false)}>
                            Close
                        </Button>
                    ]}
                >
                    <p>{currentComment}</p>
                </Modal>
            </Row>
            <TableSearch onSearch={handleSearch} />
            <Table
                dataSource={filteredTrucks}
                columns={columns}
                rowKey={record => record.ID}
                loading={isLoading}
                className='main_table'
                pagination={{ pageSize: 55 }}
            />

            <Modal width={'70%'} title="Edit table Data" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} footer={[
                <Button key="back" onClick={handleCancel}>
                    Cancel
                </Button>,
                <Button key="save" type="primary" onClick={editingTruck ? handleOkForm : handleCreate} icon={<SaveOutlined />}>
                    {editingTruck ? 'Save' : 'Create'}
                </Button>
            ]}>
                <Form form={form} layout="vertical" name="form_in_modal" initialValues={{ remember: true }}>
                    <Row className='form_row'>
                        <Form.Item
                            name="TruckNumber"
                            label="Truck Number"
                            style={{ width: '29%' }}
                        // rules={editingTruck ? [] : [{ required: true, message: 'Please enter truck number!' }]}
                        >
                            <Input key="truckNumber" />
                        </Form.Item>
                        <Form.Item
                            name="status"
                            label="Status"
                            style={{ width: '29%' }}
                        // rules={editingTruck ? [] : [{ required: true, message: 'Please choose status!' }]}
                        >
                            <Select
                                key="status"
                                defaultValue={'Chose status for truck'}
                                style={{ width: '100%' }}
                                options={[
                                    { value: 'Available', label: 'Available' },
                                    { value: 'Unavailable', label: 'Unavailable' },
                                    { value: 'On hold', label: 'On hold' },
                                    { value: 'Manual', label: 'Manual' },
                                    { value: 'Out of service', label: 'Out of service' },
                                    { value: 'Available on', label: 'Available on' },
                                    { value: 'Updated', label: 'Updated' },
                                ]}
                            />
                        </Form.Item>
                        <Form.Item
                            name="whenWillBeThere"
                            label="When Will Be There"
                            style={{ width: '29%' }}
                        // rules={editingTruck ? [] : [{ required: true, message: 'Please choose date!' }]}
                        >

                            <Space direction="horizontal" className='date_space'>
                                <DatePicker
                                    key="whenWillBeThere"
                                    style={{ width: '100%' }}
                                    showTime={{ format: 'HH:mm' }}
                                    format="YYYY-MM-DD HH:mm"
                                    onChange={(value, dateString) => {
                                        console.log('Selected Time: ', value);
                                        console.log('Formatted Selected Time: ', dateString);
                                        form.setFieldsValue({ whenWillBeThere: dateString });
                                        console.log('Selected Time on Ok: ', dateString);
                                    }}
                                    onOk={(value) => {
                                        const formattedDate = value.format('YYYY-MM-DD HH:mm');
                                        form.setFieldsValue({ whenWillBeThere: formattedDate });
                                        console.log('Selected Time on Ok: ', formattedDate);
                                    }}
                                />

                            </Space>
                        </Form.Item>
                        <Form.Item
                            name="driverName"
                            label="Driver name"
                            style={{ width: '29%' }}
                        // rules={editingTruck ? [] : [{ required: true, message: 'Please enter driver name!' }]}
                        >
                            <Input key="driverName" />
                        </Form.Item>
                        <Form.Item
                            name="mail"
                            label="E-mail"
                            style={{ width: '29%' }}
                        // rules={editingTruck ? [] : [{ required: true, message: 'Please enter driver name!' }]}
                        >
                            <Input key="driverName" />
                        </Form.Item>
                        <Form.Item
                            name="cellPhone"
                            label="Phone Number"
                            style={{ width: '29%' }}
                        // rules={editingTruck ? [] : [{ required: true, message: 'Please enter phone number!' }]}
                        >
                            <InputMask
                                key="cellPhone"
                                mask={'999-999-9999'}
                                autoComplete="off"
                                className='mask'
                            >
                            </InputMask>
                        </Form.Item>
                        <Form.Item
                            name="contactphone"
                            label="Contact Phone Number"
                            style={{ width: '29%' }}
                        // rules={editingTruck ? [] : [{ required: true, message: 'Please enter phone number!' }]}
                        >
                            <InputMask
                                key="cellPhone"
                                mask={'(999) 999-9999'}
                                autoComplete="off"
                                className='mask'
                            >
                            </InputMask>
                        </Form.Item>

                        <Form.Item
                            name="cityStateZip"
                            label="City, State zipCode"
                            style={{ width: '29%' }}
                            autoComplete="off"
                        // rules={editingTruck ? [] : [{ required: true, message: 'Please enter city, state, zipcode!' }]}
                        >
                            <Input key="cityStateZip" />
                        </Form.Item>

                        <Form.Item
                            name="dimensions"
                            label="Dimensions/Payload"
                            style={{ width: '29%' }}
                        // rules={editingTruck ? [] : [{ required: true, message: 'Please enter Dimensions/Payload!' }]}
                        >
                            <Input key="dimensions" />
                        </Form.Item>
                        <Form.Item
                            name="holdTime"
                            label="Hold By Dispetcher"
                            style={{ width: '29%' }}
                        // rules={editingTruck ? [] : []}
                        >
                            <Input key="holdTime" />
                        </Form.Item>
                        <Form.Item
                            name="rate"
                            label="Loads/Mark"
                            style={{ width: '29%' }}
                        // rules={editingTruck ? [] : [{ required: true, message: 'Please enter rating (0-5)!' }]}
                        >
                            <Input key="holdTime" />
                        </Form.Item>
                        <Form.Item
                            name="comments"
                            label="Comments"
                            style={{ width: '40%' }}
                        // rules={editingTruck ? [] : [{ required: true, message: 'Please enter truck number!' }]}
                        >
                            <TextArea rows={4} placeholder="Comments" />
                        </Form.Item>
                    </Row>
                </Form>
            </Modal>
        </>

    );
};

export default EditableTable;
