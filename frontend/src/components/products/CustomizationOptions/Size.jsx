import React from 'react';
import CustomSelect from './CustomSelect';

const Size = ({ size, setSize, sizeOptions }) => {
  const optionsWithImages = sizeOptions.map(option => ({
    label: option,
    value: option,
    image: `/images/size-options/${option.toLowerCase().replace(/\s+/g, '-')}.png` // example path
  }));

  return (
    <div className="customization-option size">
      <CustomSelect
        id="sizeSelect"
        label="Size"
        options={optionsWithImages}
        selectedValue={size}
        onChange={setSize}
      />
    </div>
  );
};

export default Size;
