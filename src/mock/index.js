// eslint-disable-next-line import/no-extraneous-dependencies
import Mock from 'mockjs';

const data = {
  code: 0,
  msg: 'success',
  data: {
    token: '11111111111111',
  },
};

Mock.mock(/\/cas\/login/, data);

Mock.mock(/\/user\/getUserByToken/, data);
