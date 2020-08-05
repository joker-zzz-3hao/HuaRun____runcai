const listData = [
  {
    id: 100, fatherId: 0, name: '润联科技', color: '#E1244E', content: '营业额超过100万', value: 123, delay: 120,
  },
  {
    id: 101, fatherId: 100, name: '华润云的O', color: '#E1244E', content: '营业额超过100万', value: 0,
  },
  {
    id: 102, fatherId: 100, name: '智慧技术', color: '#aaa', content: '营业额超过100万', value: 100,
  },
  {
    id: 103, fatherId: 101, name: '云门户的O', color: '#aaa', content: '营业额超过100万', value: 123,
  },
  {
    id: 104, fatherId: 100, name: 'IT产品服务', color: '#E1244E', content: '营业额超过100万', value: 200,
  },
  {
    id: 105, fatherId: 101, name: '云门户的O', color: '#aaa', content: '营业额超过100万', value: 123,
  },
  {
    id: 106, name: 'Calamus6', color: '#E1244E', content: '营业额超过100万', value: 123, fatherId: 102,
  },
  {
    id: 107, name: 'Calamus7', color: '#E1244E', content: '营业额超过100万', value: 123, fatherId: 102,
  },
  {
    id: 108, name: 'Calamus8', color: '#aaa', content: '营业额超过100万', value: 123, fatherId: 102,
  },
  {
    id: 109, name: 'Calamus9', color: '#aaa', content: '营业额超过100万', value: 123, fatherId: 102,
  },
  {
    id: 110, name: 'Calamus10', color: '#aaa', content: '营业额超过100万', value: 123, fatherId: 102,
  },
  {
    id: 111, name: 'Calamus11', color: '#aaa', content: '营业额超过100万', value: 123, fatherId: 102,
  },
  {
    id: 112, name: 'Calamus12', color: '#aaa', content: '营业额超过100万', value: 300, fatherId: 103,
  },
  {
    id: 113, name: 'Calamus13', color: '#aaa', content: '营业额超过100万', value: 123, fatherId: 103,
  },
  {
    id: 114, name: 'Calamus14', color: '#aaa', content: '营业额超过100万', value: 123, fatherId: 108,
  },
  {
    id: 116, name: 'Calamus15', color: '#aaa', content: '营业额超过100万', value: 123, fatherId: 108,
  },
  {
    id: 117, name: 'Calamus16', color: '#aaa', content: '营业额超过100万', value: 123, fatherId: 108,
  },
  {
    id: 118, name: 'Calamus17', color: '#aaa', content: '营业额超过100万', value: 123, fatherId: 114,
  },
  {
    id: 119, name: 'Calamus18', color: '#aaa', content: '营业额超过100万', value: 123, fatherId: 118,
  },
];
listData.forEach((v) => {
  if (!v.delay) {
    v.delay = 200 * Math.random();
  }
});
// eslint-disable-next-line import/prefer-default-export
export const list = listData;
