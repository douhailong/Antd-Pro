import moment from 'moment';
import { Space, Tag } from 'antd';

import ActionBuilder from './ActionBuilder';

const CloumnBuilder = (tableColumn: BasicListApi.TableColumn[] | undefined) => {
  const newCloumn: BasicListApi.TableColumn[] = [];

  (tableColumn || []).forEach((cloumn) => {
    if (cloumn.hideInColumn !== true) {
      switch (cloumn.type) {
        case 'datetime':
          cloumn.render = (value: any) => {
            return moment(value).format('YYYY-MM-DD HH:mm:ss');
          };
          break;
        case 'switch':
          cloumn.render = (value: any) => {
            const option = (cloumn.data || []).find((item) => item.value === value);
            return <Tag color={value ? 'blue' : 'red'}>{option?.title}</Tag>;
          };
          break;
        case 'actions':
          cloumn.render = () => {
            return <Space>{ActionBuilder(cloumn.actions)}</Space>;
          };
          break;
        default:
          break;
      }
      newCloumn.push(cloumn);
    }
  });
  const idCloumn = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
  ];
  return idCloumn.concat(newCloumn);
};

export default CloumnBuilder;
