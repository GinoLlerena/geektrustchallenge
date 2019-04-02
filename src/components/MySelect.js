import React from 'react'
import map from 'lodash/map'


function getOptionList(formElementValues){
  const list = formElementValues && formElementValues.length ? map(formElementValues, (item) => {
    return(
      <option key={item.id} value={item.value}>{item.displayName}</option>
    )
  }) : null;

  return list;
}

export const MySelect = (props) => {

  const {id, selectedValue, description,  handleChange, formElementValues} = props;

  return(
    <div className="form-group">
      <label htmlFor={id}>{description}</label>
      <select className="form-control" id={id} value={selectedValue} onChange={(e)=>handleChange(e.target.value)}>
        {[<option key={'--'} value={''}></option>].concat(getOptionList(formElementValues))}
      </select>
    </div>
  )
}

export default MySelect;