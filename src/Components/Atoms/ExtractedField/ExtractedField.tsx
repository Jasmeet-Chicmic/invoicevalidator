import React from 'react';
import './ExtractedField.scss';

type ExtractedFieldProps = {
  title: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  id?: string;
  confidenceScore: number;
};

const ExtractedField: React.FC<ExtractedFieldProps> = ({
  title,
  placeholder,
  value,
  onChange,
  id = `input-${title.replace(/\s+/g, '-').toLowerCase()}`,
  confidenceScore,
}) => {
  return (
    <div className="extracted-field">
      <label className="extracted-field__title" htmlFor={id}>
        {title}
      </label>
      <input
        id={id}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="extracted-field__input"
      />
      <div>{confidenceScore}</div>
    </div>
  );
};

export default ExtractedField;
