
import { useEffect } from "react"
function NumberInput({ searchField, cfg, handleChange }) {
  useEffect(() => {
    handleChange(searchField, cfg.defaultValue)
  },
    //eslint-disable-next-line 
    [searchField, cfg, handleChange]
  )
  return (
    <div key={cfg.label}>
      <label className="cb">
        {cfg.label}
        <input
          type="number"
          min="0"
          max="1000000"
          defaultValue={cfg.defaultValue}
          onChange={(e) => handleChange(searchField, e.target.value)}
        />
      </label>
      <br></br>
    </div>
  )
}

function CheckboxInput({ searchField, cfg, handleChange }) {

  useEffect(() => {
    handleChange(searchField, true)
  },
    //eslint-disable-next-line 
    [searchField, cfg, handleChange ]
  )

  return (
    <div key={cfg.label}>
      <label className="cb">
        {cfg.label}
        <input
          type="checkbox"
          onChange={(e) => handleChange(searchField, e.target.checked)}
          defaultChecked />
      </label>
      <br></br><br></br>
    </div>
  )
}

function SelectInput({ searchField, cfg, handleChange }) {
  useEffect(() => {
    handleChange(searchField, cfg.options[0])
  },
    //eslint-disable-next-line 
    [cfg.options]
  )

  return (
    <div key={cfg.label}>
      <label className="cb">
        {cfg.label}
        <select
          className="select"
          onChange={(e) => handleChange(searchField, e.target.value)}>
          {cfg.options.map((x) => (
            <option key={x}>{x}</option>
          ))}
        </select>
      </label>
      <br></br>
    </div>
  )
}

function TextInput({ searchField, cfg, handleChange }) {
  useEffect(() => {
    handleChange(searchField, "")
  },
    //eslint-disable-next-line 
    []
  )
  return (
    <div key={cfg.label}>
      <label className="cb">
        {cfg.label}
        <input
          type="text"
          placeholder={cfg.placeholderText}
          onChange={(e) => handleChange(searchField, e.target.value)} />
      </label>
      <br></br>
    </div>
  )
}

export { NumberInput };
export { CheckboxInput };
export { SelectInput };
export { TextInput };

