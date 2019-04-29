/* eslint-disable */
export default process.env.NODE_ENV === 'lan' ? {
  baseUrl: 'http://192.168.1.11:8080',
  endpoints: {
    collections: 'api/collections/get',
  },
  token: 'a207df3402bcc7a580aedb7a20b97d',
} : {
  baseUrl: 'https://cockpit.virgil-roger.photography',
  endpoints: {
    collections: 'api/collections/get',
  },
  token: '36619f393928dac0f27709bf3ae809',
};
