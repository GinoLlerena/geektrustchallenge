import map from 'lodash/map'
import findIndex from 'lodash/findIndex'

export function getPlanets(list) {

  if(list && list.length) {

    const planets = map(list, (item, i) => {
      return (
        {id: i, value: item.name, displayName: item.name, distance: item.distance}
      )
    })
    return planets;
  }
  return[]
}

export function getVehicles(list) {

  if(list && list.length) {

    const vehicles = map(list, (item, i) => {
      return (
        { id: i,
          value: item.name,
          displayName: item.name,
          total_no: item.total_no,
          max_distance: item.max_distance,
          speed: item.speed,
          disabled: false
        }
      )
    })
    return vehicles;
  }
  return[]
}

export function getVehiclesByDestination(selectedPlanet, planets, vehicles) {

  const index = findIndex(planets, planet => planet.value === selectedPlanet)

  if(index !== -1) {
    const planet = planets[index]

    const list = map(vehicles, (item, i) => {
      return (
        {
          ...item, disabled: (item.total_no <= 0 || planet.distance > item.max_distance)
        }
      )
    })
    return list;
  }
  return []

}

export function getTimeTaken(state){
  const { d1, d2, d3, d4, dr1, dr2, dr3, dr4, planets, vehicles} = state;

  const dList = [d1, d2, d3, d4]
  const  drList = [dr1, dr2, dr3, dr4]
  let timeTaken = 0;

  drList.forEach((dr, i)=> {
    if(dr && dr.length > 0){
      const selectedPlanet = dList[i];
      const planet = planets.find(item => item.value === selectedPlanet);
      const vehicle = vehicles.find(item => item.value === dr);


      timeTaken = timeTaken + planet.distance / vehicle.speed
    }
  })

  return timeTaken
}