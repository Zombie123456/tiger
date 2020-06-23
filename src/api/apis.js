"use strict";
const host = process.env.VUE_APP_API_URL;
// /v1/community/
// /v1/build_num/?community=<community_id></community_id>
// /v1/house/?build_num=</build_num_id>
const house = `${host}v1/`;
export default {
  login: `${house}login/`,
  logout: `${house}logout/`,
  getProperty: `${house}community/`,
  getBuilding: `${house}build_num/`,
  getItemList: `${house}house/`,
  // house: `${house}manager_house/`,
  // building: `${house}build_num/`,
  // sellerBuilding: `${house}seller_house/`,
  // getStaff: `${house}staff/`,
  // getRole: `${house}role/`,
  // resetPassword: `${house}reset_password/`,
  // my: `${house}my/`,
  // carFilter: `${house}car_floor_list/`,
  // car: `${house}seller_car/`,
};
