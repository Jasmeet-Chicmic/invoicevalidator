import React, { ReactNode } from 'react';
import './FieldWrapper.scss';

type FieldWrapperProps = {
  title: string;
  children: ReactNode;
};

const FieldWrapper: React.FC<FieldWrapperProps> = ({ title, children }) => {
  return (
    <div className="field-wrapper">
      <h3 className="field-wrapper__title">{title}</h3>
      <div className="field-wrapper__content">{children}</div>
    </div>
  );
};

export default FieldWrapper;
