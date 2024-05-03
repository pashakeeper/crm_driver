import { Tag } from 'antd';

// Компонент, который отображает статус и применяет цвет в зависимости от значения статуса
const StatusTag = ({ status }) => {
    let color = '';

    switch (status) {
        case 'Available':
            color = 'green'; // Зеленый цвет для статуса "Available"
            break;
        case 'Unavailable':
            color = 'red'; // Красный цвет для статуса "Unavailable"
            break;
        case 'On Hold':
            color = 'yellow'; // Желтый цвет для статуса "On Hold"
            break;
        default:
            color = 'default'; // Цвет по умолчанию для других статусов
    }

    return (
        <Tag color={color}>
            {status}
        </Tag>
    );
};
export default StatusTag;