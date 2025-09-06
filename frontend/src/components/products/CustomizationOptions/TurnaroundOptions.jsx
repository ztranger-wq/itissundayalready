import React from 'react';
import CustomSelect from './CustomSelect';

const TurnaroundOptions = ({ turnaroundOption, setTurnaroundOption, turnaroundOptions }) => {
  const optionsWithImages = turnaroundOptions.map(option => ({
    label: option,
    value: option,
    image: `/images/turnaround-options/${option.toLowerCase().replace(/\s+/g, '-')}.png` // example path
  }));

  return (
    <div className="customization-option turnaround-options">
      <CustomSelect
        id="turnaroundSelect"
        label="Turnaround Options"
        options={optionsWithImages}
        selectedValue={turnaroundOption}
        onChange={setTurnaroundOption}
      />
    </div>
  );
};

export default TurnaroundOptions;
