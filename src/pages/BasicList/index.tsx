import { useState, useEffect } from 'react';
import { Table, Space, Row, Col, Card, Pagination, Button } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { useRequest } from 'umi';

import CloumnBuilder from './builder/CloumnBuilder';
import ActionBuilder from './builder/ActionBuilder';
import Modal from './component/Modal';
import styles from './index.less';

const Index = () => {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalUrl, setModalUrl] = useState('');

  const init = useRequest<{ data: BasicListApi.Data }>(
    `https://public-api-v2.aspirantzhang.com/api/admins?X-API-KEY=antd&page=${page}&per_page=${perPage}`,
  );

  useEffect(() => {
    init.run();
  }, [page, perPage]);

  const handlePaginationChange = (_page: any, _per_page: any) => {
    setPage(_page);
    setPerPage(_per_page);
  };

  const searchLayout = () => {};

  const beforeTableLayout = () => {
    return (
      <Row>
        <Col xs={24} sm={12}>
          ...
        </Col>
        <Col xs={24} sm={12} className={styles.tableToolbar}>
          <Space>{ActionBuilder(init?.data?.layout?.tableToolBar)}</Space>
        </Col>
      </Row>
    );
  };

  const afterTableLayout = () => {
    return (
      <Row>
        <Col xs={24} sm={10}>
          ...
        </Col>
        <Col xs={24} sm={14} className={styles.tableToolbar}>
          <Pagination
            total={init?.data?.meta?.total || 0}
            current={init?.data?.meta?.page || 1}
            pageSize={init?.data?.meta?.per_page || 10}
            showSizeChanger
            showQuickJumper
            showTotal={(total) => `Total ${total} items`}
            onChange={handlePaginationChange}
            onShowSizeChange={handlePaginationChange}
          />
        </Col>
      </Row>
    );
  };

  return (
    <PageContainer>
      {searchLayout()}
      <Space>
        <Button
          type="primary"
          onClick={() => {
            setModalUrl('https://public-api-v2.aspirantzhang.com/api/admins/add?X-API-KEY=antd');
            setModalVisible(true);
          }}
        >
          add
        </Button>
        <Button
          type="primary"
          onClick={() => {
            setModalUrl('https://public-api-v2.aspirantzhang.com/api/admins/206?X-API-KEY=antd');
            setModalVisible(true);
          }}
        >
          edit
        </Button>
      </Space>
      <Card>
        {beforeTableLayout()}
        <Table
          rowKey="id"
          columns={CloumnBuilder(init?.data?.layout?.tableColumn)}
          dataSource={init?.data?.dataSource}
          pagination={false}
          loading={init?.loading}
        />
        {afterTableLayout()}
      </Card>
      <Modal
        modalVisible={modalVisible}
        modalUrl={modalUrl}
        hideModal={() => {
          setModalVisible(false);
        }}
      />
    </PageContainer>
  );
};

export default Index;
