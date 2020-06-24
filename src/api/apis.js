"use strict";

const host = process.env.VUE_APP_API_URL;

// const apps = `${host}v1/manage/`;
const house = `${host}v1/`;
// login: `${house}login/`,
// logout: `${house}logout/`,
// getProperty: `${house}community/`,
// getBuilding: `${house}build_num/`,
// getItemList: `${house}house/`,
// import_log/
// /v1/import_file/
// import_car_file/
export default {
  login: `${house}login/`,
  logout: `${house}logout/`,
  getProperty: `${house}community/`,
  getBuilding: `${house}build_num/`,
  getItemList: `${house}house/`,
  getImportLog: `${house}import_log/`,
  importFile: `${house}import_file/`,
  importCarFile: `${house}import_car_file/`,
  // house: `${house}manager_house/`,
  // building: `${house}build_num/`,
  getStaff: `${house}staff/`,
  getRole: `${house}role/`,
  resetPassword: `${house}reset_password/`,
  my: `${house}my/`,
  // carFilter: `${house}car_floor_list/`,
  // car: `${house}manager_car/`,
};
