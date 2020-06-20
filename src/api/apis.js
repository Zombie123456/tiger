"use strict";
const host = process.env.VUE_APP_API_URL;

const house = `${host}v1/`;
export default {
  login: `${house}login/`,
  logout: `${house}logout/`,
  house: `${house}manager_house/`,
  building: `${house}build_num/`,
  sellerBuilding: `${house}seller_house/`,
  getStaff: `${house}staff/`,
  getRole: `${house}role/`,
  resetPassword: `${house}reset_password/`,
  my: `${house}my/`,
  carFilter: `${house}car_floor_list/`,
  car: `${house}seller_car/`,
};
