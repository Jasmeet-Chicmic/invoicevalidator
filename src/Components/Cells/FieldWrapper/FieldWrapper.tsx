// Third-party libraries
import React, { ReactNode } from 'react';
// Styles
import './FieldWrapper.scss';
// Utils
import { formatCamelCase } from '../../../Shared/functions';

type FieldWrapperProps = {
  title: string;
  children: ReactNode;
  id?: number;
};

const FieldWrapper: React.FC<FieldWrapperProps> = ({ title, children, id }) => {
  return (
    <div className={`field-wrapper ${id ? 'stepForm' : ''}`}>
      <h3 className="field-wrapper__title">{formatCamelCase(title)}</h3>
      <div className="field-wrapper__content">{children}</div>
    </div>
  );
};

export default FieldWrapper;
