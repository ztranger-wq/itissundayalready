import React from 'react';
import CustomSelect from './CustomSelect';

const BackingOptions = ({ backingOption, setBackingOption, backingOptions }) => {
  // Map options to objects with label, value, and image (dummy images for example)
  const optionsWithImages = backingOptions.map(option => ({
    label: option,
    value: option,
    image: `/images/backing-options/${option.toLowerCase().replace(/\s+/g, '-')}.png` // example path
  }));

  return (
    <div className="customization-option backing-options">
      <CustomSelect
        id="backingSelect"
        label="Backing Options"
        options={optionsWithImages}
        selectedValue={backingOption}
        onChange={setBackingOption}
      />
    </div>
  );
};

export default BackingOptions;
