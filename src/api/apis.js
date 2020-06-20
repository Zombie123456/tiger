"use strict";

// import env from '.env.development'
// const env = process.env.NODE_ENV === 'development'
//     ? config.dev.env
//     : config.build.env
const host = process.env.VUE_APP_API_URL;

const apps = `${host}v1/manage/`;
const house = `${host}v1/`;

export default {
  login: `${apps}login/`,
  logout: `${house}logout/`,
  house: `${house}manager_house/`,
  building: `${house}build_num/`,
  getStaff: `${house}staff/`,
  getRole: `${house}role/`,
  resetPassword: `${house}reset_password/`,
  my: `${house}my/`,
  // /v1/car_floor_list/
  carFilter: `${house}car_floor_list/`,
  car: `${house}manager_car/`,
};
