
import { Typography } from 'antd';

const { Title } = Typography;

const Index = ({ title = '', rightArea = '', children = '' }) => {
    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <Title level={2}>{title}</Title>
                {rightArea}
            </div>
            <div>{children}</div>
        </div>
    )
}

export default Index