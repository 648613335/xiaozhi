import React from 'react';
import { Button, Result } from 'antd';
import { history } from 'umi';

const NoFoundPage = () => {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: 'calc(100vh - 200px)'
    }}>
      <Result
        status="404"
        title="404"
        subTitle="抱歉，您访问的页面不存在"
        extra={
          <Button type="primary" onClick={() => history.push('/home')}>
            返回首页
          </Button>
        }
      />
    </div>
  );
};

export default NoFoundPage; 