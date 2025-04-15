// Third-party libraries
import React, { ReactNode } from 'react';
// Styles
import './FieldWrapper.scss';
// Utils
import { formatCamelCase } from '../../../Shared/functions';

type FieldWrapperProps = {
  title: string;
  children: ReactNode;
};

const FieldWrapper: React.FC<FieldWrapperProps> = ({ title, children }) => {
  return (
    <div className="field-wrapper">
      <h3 className="field-wrapper__title">{formatCamelCase(title)}</h3>
      <div className="field-wrapper__content">{children}</div>
    </div>
  );
};

export default FieldWrapper;
