import React from 'react';
import CustomSelect from './CustomSelect';

const SizeSymbolsOrColorVersions = ({ option, setOption, options }) => {
  const optionsWithImages = options.map(opt => ({
    label: opt,
    value: opt,
    image: `/images/size-symbols-color-versions/${opt.toLowerCase().replace(/\s+/g, '-')}.png` // example path
  }));

  return (
    <div className="customization-option size-symbols-color-versions">
      <CustomSelect
        id="sizeSymbolsColorVersionsSelect"
        label="Size Symbols or Color Versions?"
        options={optionsWithImages}
        selectedValue={option}
        onChange={setOption}
      />
    </div>
  );
};

export default SizeSymbolsOrColorVersions;
