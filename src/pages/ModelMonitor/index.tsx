import React from 'react';
import { Typography } from 'antd';
import '@/assets/global.css';

const { Title } = Typography;

const ModelMonitorPage: React.FC = () => {
    return (
        <div className="content-container">
            <Title level={2}>模型监控</Title>
        </div>
    );
};

export default ModelMonitorPage; 