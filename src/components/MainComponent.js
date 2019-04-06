import React, {Component} from 'react'
import MySelect from './MySelect'
import RadioElement from './MyRadio'
import Service from '../services/services'
import ResultsComponent from './ResultsComponent'
import map from 'lodash/map'
import filter from 'lodash/filter'
import includes from 'lodash/includes'
import {getPlanets, getVehiclesByDestination, getVehicles, getTimeTaken} from '../utils/Utils'

function getAvailablePlanets(planets, search,  idx1, idx2, idx3) {
  return filter(planets, planet => !includes([search[idx1].planet_name,search[idx2].planet_name,search[idx3].planet_name], planet.value))
}

function travel() {
  return {planet_name:'', vehicle:''}
}

function initSearch(){
  return[travel(), travel(), travel(), travel()]
}

function initState() {
  return({
    search: initSearch(),
    planets: [],
    vehicles: [],
    main: true
  })
}

const MyDestination = (props) => {

  const {
    selectDescription, selectSelectedValue, handleChange, selectElements, selectKey,
    radioSelectedValue, radioElements, radioKey
  } = props

  const onChangeSelect = (value) => handleChange(selectKey, value)
  const onChangeRadio = (value) => {
    handleChange(radioKey, value)
  }

  return (
    <div className="card mb-3 shadow-sm">
      <div className="card-body">
        <MySelect description={selectDescription} selectedValue={selectSelectedValue} handleChange={onChangeSelect}
                  readOnly={false} formElementValues={selectElements}/>

        {selectSelectedValue && <RadioElement parentId={selectSelectedValue} radioKey={radioKey} currentValue={radioSelectedValue} handleChange={onChangeRadio} readOnly={false}
                      formElementValues={radioElements}/>}
      </div>
    </div>
  )
}



class MainComponent extends Component {

  state = initState()

  handleChange = (index, key, value) => {

    if(key === 'vehicle'){
      const vehicles = map(this.state.vehicles, vehicle => {
        if(vehicle.value === value){
          vehicle.total_no = vehicle.total_no - 1
        }
        return vehicle
      })

      this.setState(({search}) => ({vehicles, search: (map(search, (travel, i) => (i === index )? {...travel, [key]: value} : travel))}))
    }
    else
      this.setState(({search}) => ({search: (map(search, (travel, i) => (i === index )? {...travel, [key]: value} : travel))}))
  }

  onGetPlanets = () => {
    Service.getPlanets().then((e)=>{
      this.setState({planets:getPlanets(e)})
    })
  }

  onGetVehicles = () => {
    Service.getVehicles().then((e)=>{
      this.setState({vehicles:getVehicles(e)})
    })
  }

  onFindFalcone = () => {
    const { main, search} = this.state

    const planet_names = map(search, travel => travel.planet_name)
    const vehicle_names = map(search, travel => travel.vehicle)

    if(main) {
      Service.getToken().then(token => {
        Service.findFalcone(token.token, planet_names, vehicle_names).then(e => {
          const {status, planet_name} = e;
          this.setState({status, planet_name, main: false})
        })
      })
    }else {
      this.setState({search: initSearch(), main:true})
      this.onGetPlanets()
      this.onGetVehicles()
    }
  }

  componentDidMount() {
    this.onGetPlanets()
    this.onGetVehicles()
  }

  render() {
    const {search, planets, vehicles, main, status, planet_name} = this.state

    const lstPlanets = planets && planets.length ? [
      getAvailablePlanets(planets, search, 1, 2, 3),
      getAvailablePlanets(planets, search, 0, 2,3),
      getAvailablePlanets(planets, search, 0,1,3),
      getAvailablePlanets(planets, search, 0,1 ,2)
    ] : []

    const lstVehicles = map(search, opt => getVehiclesByDestination(opt.planet_name,planets, vehicles))

    const timeTaken = getTimeTaken(this.state)

    const lstOptions = map(search, (option, i) =>{
      const _handleChange = (key, value) => this.handleChange(i, key, value)

      return(
        <div className="col-md-3">
          <MyDestination key={i}
                         selectDescription={`Destination ${i+1}`}
                         selectSelectedValue={option.planet_name}
                         handleChange={_handleChange}
                         selectElements={lstPlanets[i]}
                         selectKey={'planet_name'}
                         radioKey={'vehicle'}
                         radioSelectedValue={option.vehicle}
                         radioElements={lstVehicles[i]}/>
        </div>
      )
    })

    return (
      <main className='main'>
        <div className="container">
          <section className="jumbotron text-center">
            <div className="container">
              <h1 className="jumbotron-heading">Finding Falcone!</h1>
              <p className="lead text-muted">Select planes that you want to search in:</p>
            </div>
          </section>
          {main ? <section>
            <div className="row">
              {lstOptions}
            </div>
            <div className='row'>
              <div className="col-md-4 col-md-offset-4">
                <p className="lead text-muted">{`Time Taken: ${timeTaken}`}</p>
              </div>
            </div>
          </section> :
          <ResultsComponent status={status} planet_name={planet_name} timeTaken={timeTaken} />}
          <section className="text-center">
            <button type="button" className="btn btn-sm btn-outline-secondary" onClick={this.onFindFalcone}>{main ? 'Find Falcone' : 'Start Again'}</button>
          </section>
        </div>
      </main>
    )
  }

}

export default MainComponent