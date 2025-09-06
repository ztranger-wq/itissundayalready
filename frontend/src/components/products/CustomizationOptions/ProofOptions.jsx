import React from 'react';
import CustomSelect from './CustomSelect';

const ProofOptions = ({ proofOption, setProofOption, proofOptions }) => {
  const optionsWithImages = proofOptions.map(option => ({
    label: option,
    value: option,
    image: `/images/proof-options/${option.toLowerCase().replace(/\s+/g, '-')}.png` // example path
  }));

  return (
    <div className="customization-option proof-options">
      <CustomSelect
        id="proofSelect"
        label="Proof Options"
        options={optionsWithImages}
        selectedValue={proofOption}
        onChange={setProofOption}
      />
    </div>
  );
};

export default ProofOptions;
