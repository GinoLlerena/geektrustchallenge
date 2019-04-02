import React, {Component} from 'react'
import MySelect from './MySelect'
import RadioElement from './MyRadio'
import Service from '../services/services'
import ResultsComponent from './ResultsComponent'
import map from 'lodash/map'
import filter from 'lodash/filter'
import includes from 'lodash/includes'
import {getPlanets, getVehiclesByDestination, getVehicles, getTimeTaken} from '../utils/Utils'

function initState() {
  return({
    d1: '',
    d2: '',
    d3: '',
    d4: '',
    dr1: '',
    dr2: '',
    dr3: '',
    dr4: '',
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

        {selectSelectedValue && <RadioElement radioKey={radioKey} currentValue={radioSelectedValue} handleChange={onChangeRadio} readOnly={false}
                      formElementValues={radioElements}/>}
      </div>
    </div>
  )
}



class MainComponent extends Component {

  state = initState()

  handleChange = (key, value) => {

    if(includes(['dr1','dr2','dr3','dr4'], key)){
      const vehicles = map(this.state.vehicles, vehicle => {
        if(vehicle.value === value){
          vehicle.total_no = vehicle.total_no - 1
        }
        return vehicle
      })

      this.setState({[key]: value, vehicles})
    }
    else
      this.setState({[key]: value})
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
    const {d1, d2, d3, d4, dr1, dr2, dr3, dr4, main} = this.state
    if(main) {
      Service.getToken().then(token => {
        Service.findFalcone(token.token, [d1, d2, d3, d4], [dr1, dr2, dr3, dr4]).then(e => {
          const {status, planet_name} = e;
          this.setState({status, planet_name, main: false})
        })
      })
    }else {
      this.setState(initState())
    }
  }

  componentDidMount() {
    this.onGetPlanets()
    this.onGetVehicles()
  }

  render() {
    const {d1, d2, d3, d4, dr1, dr2, dr3, dr4, planets, vehicles, main, status, planet_name} = this.state

    const lstPlanets1 = planets && planets.length ? filter(planets, planet => !includes([d2,d3,d4], planet.value)) :[]
    const lstPlanets2 = planets && planets.length ? filter(planets, planet => !includes([d1,d3,d4], planet.value)) :[]
    const lstPlanets3 = planets && planets.length ? filter(planets, planet => !includes([d1,d2,d4], planet.value)) :[]
    const lstPlanets4 = planets && planets.length ? filter(planets, planet => !includes([d1,d2,d3], planet.value)) :[]

    const getVehiclesByD1 = () => getVehiclesByDestination(d1,planets, vehicles)
    const getVehiclesByD2 = () => getVehiclesByDestination(d2,planets, vehicles)
    const getVehiclesByD3 = () => getVehiclesByDestination(d3,planets, vehicles)
    const getVehiclesByD4 = () => getVehiclesByDestination(d4,planets, vehicles)

    const timeTaken = getTimeTaken(this.state)

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
              <div className="col-md-3">
                <MyDestination selectDescription='Destination 1'
                               selectSelectedValue={d1}
                               handleChange={this.handleChange}
                               selectElements={lstPlanets1}
                               selectKey={'d1'}
                               radioKey={'dr1'}
                               radioSelectedValue={dr1}
                               radioElements={getVehiclesByD1()}/>
              </div>
              <div className="col-md-3">

                <MyDestination selectDescription='Destination 2'
                               selectSelectedValue={d2}
                               handleChange={this.handleChange}
                               selectElements={lstPlanets2}
                               selectKey={'d2'}
                               radioKey={'dr2'}
                               radioSelectedValue={dr2}
                               radioElements={getVehiclesByD2()}/>


              </div>
              <div className="col-md-3">

                <MyDestination selectDescription='Destination 3'
                               selectSelectedValue={d3}
                               handleChange={this.handleChange}
                               selectElements={lstPlanets3}
                               selectKey={'d3'}
                               radioKey={'dr3'}
                               radioSelectedValue={dr3}
                               radioElements={getVehiclesByD3()}/>

              </div>

              <div className="col-md-3">

                <MyDestination selectDescription='Destination 4'
                               selectSelectedValue={d4}
                               handleChange={this.handleChange}
                               selectElements={lstPlanets4}
                               selectKey={'d4'}
                               radioKey={'dr4'}
                               radioSelectedValue={dr4}
                               radioElements={getVehiclesByD4()}/>


              </div>

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