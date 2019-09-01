import React from "react";
const Input = props => {
  return (
    <label>
      <input
        type="text"
        className={props.className}
        id={props.name}
        name={props.name}
        disabled={props.isDisabled}
        value={props.value}
        placeholder={props.placeholder}
        onChange={props.onChange}
      />
    </label>
  );
};

export default Input;
