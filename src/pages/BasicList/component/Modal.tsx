import { Modal as AntdModal, Form } from 'antd';
import { useEffect } from 'react';
import { useRequest } from 'umi';
import moment from 'moment';

import FormBuilder from '../builder/FormBuilder';
import ActionBuilder from '../builder/ActionBuilder';

export const Modal = ({
  modalVisible,
  hideModal,
  modalUrl,
}: {
  modalVisible: boolean;
  hideModal: () => void;
  modalUrl: string;
}) => {
  const [form] = Form.useForm();

  const init = useRequest<{ data: PageApi.Data }>(`${modalUrl}`);

  useEffect(() => {
    !modalVisible && form.resetFields();
    modalVisible && init.run();
  }, [modalVisible]);

  useEffect(() => {
    init.data && form.setFieldsValue(setFieldsAdaptor(init.data));
  }, [init.data]);

  const setFieldsAdaptor = (data: PageApi.Data) => {
    if (data?.layout.tabs && data?.dataSource) {
      const result = {};
      data.layout.tabs.forEach((tab) => {
        tab.data.forEach((field) => {
          switch (field.type) {
            case 'datetime':
              result[field.key] = moment(data.dataSource[field.key]);
              break;

            default:
              result[field.key] = data.dataSource[field.key];
              break;
          }
        });
      });
      return result;
      // console.log(result);
    }
    return {};
  };

  return (
    <>
      <AntdModal
        title={init?.data?.page?.title}
        visible={modalVisible}
        onCancel={hideModal}
        // maskClosable={false}
        footer={ActionBuilder(init?.data?.layout?.actions[0]?.data)}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            create_time: moment(),
            update_time: moment(),
            status: true,
          }}
        >
          {FormBuilder(init?.data?.layout?.tabs[0]?.data)}
        </Form>
      </AntdModal>
    </>
  );
};

export default Modal;
