import { Form, Button, Input, Select, Space } from 'antd'
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';

const Index = (props) => {

    return (
        <div>
            <Form
                layout="inline"
                onFinish={props.form.handleSearch}
                {...props.form}
            >
                {
                    props.formItems.map((item, index) => {
                        let content = ''
                        switch (item.type) {
                            case 'input':
                                content = (<Input allowClear {...item.input} />)
                                break;
                            case 'select':
                                content = (
                                    <Select allowClear {...item.select}>
                                        {
                                            item.select?.options?.map((option, index) => {
                                                return (<Select.Option value={option.value}>{option.label}</Select.Option>)
                                            })
                                        }
                                    </Select>
                                )
                                break;
                            default:
                                break;
                        }
                        return (<Form.Item name={item.name} label={item.label}>{content}</Form.Item>)
                    })
                }
                <Form.Item>
                    <Space>
                        <Button type="primary" icon={<SearchOutlined />} onClick={props.form.handleSearch}>
                            搜索
                        </Button>
                        <Button icon={<ReloadOutlined />} onClick={props.form.handleReset}>
                            重置
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </div>
    )
}

export default Index