import React, {Component} from 'react'

class ResultsComponent extends Component {

  render(){

    const {status, timeTaken, planet_name} = this.props;

    return(
      <section className="jumbotron text-center">
        <div className="container">
          <h5 className="jumbotron-heading">{`${status}`}</h5>
          <br/>
          {status === 'false' ? null : <p className="lead text-muted">{`Time Taken: ${timeTaken}`}</p>}
          {status === 'false' ? null : <p className="lead text-muted">{`Planet found: ${planet_name}`}</p>}
        </div>
      </section>
    )
  }
}

export default ResultsComponent