import { Tag } from 'antd';

// Компонент, который отображает статус и применяет цвет в зависимости от значения статуса
const StatusTag = ({ status }) => {
    let color = '';
    let style = { padding: '20px' };

    switch (status) {
        case 'Available':
            color = '#008000'; // Зеленый цвет для статуса "Available"
            break;
        case 'Unavailable':
            color = '#FF0000'; // Красный цвет для статуса "Unavailable"
            break;
        case 'On hold':
            color = '#0000FF'; // Синий цвет для статуса "On Hold"
            break;
        case 'Available on':
            color = '#070707'; // Желтый цвет для статуса "Available on"
            break;
        case 'Manual':
            color = '#800080'; // Фиолетовый цвет для статуса "Manual"
            break;
        case 'Out of service':
            color = '#FFA500'; // Рыжий цвет для статуса "Out of service"
            break;
        case 'Updated':
            color = '#00ffb7';
            style = {color: '#000', padding: '20px' }; // Рыжий цвет для статуса "Out of service"
            break;
        default:
            color = '#d9d9d9'; // Цвет по умолчанию для других статусов (серый)
    }

    return (
        <Tag color={color} style={style}>
            {status}
        </Tag>
    );
};

export default StatusTag;
