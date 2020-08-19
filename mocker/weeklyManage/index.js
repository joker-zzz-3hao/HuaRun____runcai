const Mock = require('mockjs');
const mockUtil = require('../mockUtil');

const mockData = {
  // author：林心荃
  // 用于：日历
  'POST /gateway/weekly-service/calendar/qurey': (req, res) => {
    res.send(mockUtil.getSuccessData(Mock.mock({
      ARRAY: [{
        calendarId: '91',
        calendarYear: 2020,
        week: 31,
        weekBegin: '2020-07-26',
        weekEnd: '2020-08-01',
        weekelyId: null,
      },
      {
        calendarId: '94',
        calendarYear: 2020,
        week: 32,
        weekBegin: '2020-08-02',
        weekEnd: '2020-08-08',
        weekelyId: null,
      },
      {
        calendarId: '97',
        calendarYear: 2020,
        week: 33,
        weekBegin: '2020-08-09',
        weekEnd: '2020-08-15',
        weekelyId: null,
      },
      {
        calendarId: '100',
        calendarYear: 2020,
        week: 34,
        weekBegin: '2020-08-16',
        weekEnd: '2020-08-22',
        weekelyId: null,
      },
      {
        calendarId: '103',
        calendarYear: 2020,
        week: 35,
        weekBegin: '2020-08-23',
        weekEnd: '2020-08-29',
        weekelyId: null,
      },
      {
        calendarId: '106',
        calendarYear: 2020,
        week: 36,
        weekBegin: '2020-08-30',
        weekEnd: '2020-09-05',
        weekelyId: null,
      }],
    })));
  },
};
module.exports = mockData;
