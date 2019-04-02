
import ApiUtils from '../utils/ApiUtils'
import keys from 'lodash/keys'
import isObject from 'lodash/isObject'

const endPoints = {
  PLANETS: 'planets',
  VEHICLES: 'vehicles',
  FIND_FALCONE: 'find',
  TOKEN: '/token'
};

function getUrlPath(...data){

  const urlParams =  data && data.length > 0 ?  [...data].pop() : null;
  const _data = urlParams && isObject(urlParams) ?  data.slice(0, data.length -1) : data;
  const newParams =  urlParams && isObject(urlParams) ?  keys(urlParams).map(key=> key + '=' + urlParams[key]).join('&') : '';
  return _data.filter(item => !!item).join('/') + (newParams && newParams.length > 0 ? '?' + newParams: '' );
}

export default class Service {

  /// boats


  static getPlanets() {
    const urlPath = getUrlPath(endPoints.PLANETS);
    return ApiUtils.doGet(urlPath);
  }

  static getVehicles() {
    const urlPath = getUrlPath(endPoints.VEHICLES);
    return ApiUtils.doGet(urlPath);
  }

  static getToken() {
    return ApiUtils.doPost('/token','', true);
  }



  static findFalcone(token, planet_names, vehicle_names) {
    const params = JSON.stringify({token, planet_names, vehicle_names});
    return ApiUtils.doPostFind('/find', params, true);
  }




}