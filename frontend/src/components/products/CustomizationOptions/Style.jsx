import React from 'react';
import CustomSelect from './CustomSelect';

const Style = ({ style, setStyle, styleOptions }) => {
  const optionsWithImages = styleOptions.map(option => ({
    label: option,
    value: option,
    image: `/images/style-options/${option.toLowerCase().replace(/\s+/g, '-')}.png` // example path
  }));

  return (
    <div className="customization-option style">
      <CustomSelect
        id="styleSelect"
        label="Style"
        options={optionsWithImages}
        selectedValue={style}
        onChange={setStyle}
      />
    </div>
  );
};

export default Style;
