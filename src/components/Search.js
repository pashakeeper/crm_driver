import React, { useState } from 'react';
import { Input, Row, Button } from 'antd';
import { SearchOutlined, DeleteOutlined } from '@ant-design/icons';

const TableSearch = ({ onSearch }) => {
    const [truckNumber, setTruckNumber] = useState('');
    const [status, setStatus] = useState('');
    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [contactphoneNumber, setcontactPhoneNumber] = useState('');
    const handleReset = () => {
        setTruckNumber('');
        setStatus('');
        setName('');
        setPhoneNumber('');
        setcontactPhoneNumber('');
        onSearch({ truckNumber: '', status: '', name: '', phoneNumber: '', contactphoneNumber: '' });
    };
    const handleSearch = () => {
        onSearch({ truckNumber, status, name, phoneNumber, contactphoneNumber });
    };

    const handleTruckNumberChange = (e) => {
        setTruckNumber(e.target.value);
    };

    const handleStatusChange = (e) => {
        setStatus(e.target.value);
    };
    const handleNameChange = (e) => {
        setName(e.target.value);
    };
    const handlePhoneNumberChange = (e) => {
        setPhoneNumber(e.target.value);
    };

    const handlecontactPhoneNumberChange = (e) => {
        setcontactPhoneNumber(e.target.value);
    };

return (
    <Row className='search_row'>
        <Input
            placeholder="Search Truck Number"
            value={truckNumber}
            onChange={handleTruckNumberChange}
            style={{ width: 200 }}
        />
        <Input
            placeholder="Search Status"
            value={status}
            onChange={handleStatusChange}
            style={{ width: 200 }}
        />
        <Input
            placeholder="Search Name"
            value={name}
            onChange={handleNameChange}
            style={{ width: 200 }}
        />
        <Input
            placeholder="Search Contact Phone number"
            value={contactphoneNumber}
            onChange={handlecontactPhoneNumberChange}
            style={{ width: 200 }}
        />
        <Input
            placeholder="Search Phone number"
            value={phoneNumber}
            onChange={handlePhoneNumberChange}
            style={{ width: 200 }}
        />
        <Button
            type="primary"
            onClick={handleSearch}
            icon={<SearchOutlined />}
        >
            Search
        </Button>
        <Button
            type="primary"
            onClick={handleReset}
            icon={<DeleteOutlined />}
        >
            Reset
        </Button>
    </Row>
);
};

export default TableSearch;
