import React from 'react'
import map from 'lodash/map'

export const RadioOption = ({item, currentValue, handleChange, radioKey}) => {
  return (
    <div className="form-check">
      <input className="form-check-input" type="radio" id={`${radioKey}${item.value}`} disabled={item.disabled}
             value={item.value} checked={item.value === currentValue} onChange={(e)=>handleChange(e.target.value)}/>
      <label className="form-check-label" htmlFor={`${radioKey}${item.value}`}>
        {`${item.displayName}  (${item.total_no})` }
      </label>
    </div>
  )
}


export const RadioElement = (props) => {

  const {formElementValues, currentValue, handleChange, readOnly, radioKey} = props;
  const list = formElementValues && formElementValues.length ? map(formElementValues, (item) => <RadioOption key={item.id} radioKey={radioKey} item={item}  currentValue={currentValue} handleChange={handleChange} readOnly={readOnly} />) : null;

  return(
    <fieldset className="form-group">
      <div className="row">
        <div className="col-sm-10">
          {list}
        </div>
      </div>
    </fieldset>
  )
}

export default RadioElement