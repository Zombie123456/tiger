"use strict";

// import env from '.env.development'
// const env = process.env.NODE_ENV === 'development'
//     ? config.dev.env
//     : config.build.env
const host = process.env.VUE_APP_API_URL;

const apps = `${host}v1/manage/`;
const house = `${host}v1/`;
// const auth = `${host}authentication/v1/`;
// const websites = `${host}websites/v1/`;

export default {
  login: `${apps}login/`,
  house: `${house}manager_house/`,
  building: `${house}build_num/`,
  // /v1/build_num/
  // my: `${auth}my`,
  // changePassword: `${auth}password`,
  // logout: `${auth}logout`,
  // refresh_token: `${auth}login/refresh`,
  // apps: `${apps}`,
  // upload: `${apps}upload/`,
  // download_link: `${apps}download/`,
  // websites: `${websites}`,
  // webapps: `${websites}apps/`,
  // types: `${websites}types/`,
  // categories: `${websites}categories/`,
  // labels: `${websites}labels/`,
  // staff: `${host}accounts/v1/staff/`,
};
