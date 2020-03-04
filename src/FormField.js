import React, { forwardRef } from 'react';
import { Label, Input, FormText, FormFeedback } from 'reactstrap';

import { useFormContext } from './Form';

const validateField = (required, validate, messages) => (value, data) => {
  if (required && (value === undefined || value === '')) return messages.required;

  if (validate) {
    if (Array.isArray(validate)) {
      let error;
      validate.some(oneValidate => {
        error = validateField(false, oneValidate, messages)(value, data);
        return !!error;
      });
      return error;
    }
    if (typeof validate === 'function') return validate(value, data);
    if (validate.regexp && !validate.regexp.test(value)) {
      const error = validate.message || messages.invalid;
      return validate.status ? { message: error, status: validate.status } : error;
    }
  }
};

const FormField = forwardRef(
  (
    {
      checked,
      children,
      className,
      component,
      disabled,
      error,
      help,
      htmlFor,
      info,
      label,
      margin,
      name,
      onBlur,
      onFocus,
      pad,
      required,
      style,
      validate,
      ...rest
    },
    ref
  ) => {
    const {
      addValidation,
      onBlur: onContextBlur,
      errors,
      get,
      infos,
      messages,
      set,
    } = useFormContext();
    const value = get(name);

    const renderInput = invalid => {
      const InputComponent = component || Input;
      if (rest.type === 'checkbox') {
        console.log({ value });
        return (
          <Label check>
            <Input
              name={name}
              checked={value !== undefined ? value : false}
              invalid={invalid}
              aria-invalid={invalid || undefined}
              onChange={e => {
                console.log({ e: e.target.value });
                set(name, e.target.value !== undefined ? e.target.value : checked);
              }}
              {...rest}
            />
            {label}
          </Label>
        );
      }
      return (
        <InputComponent
          name={name}
          value={value !== undefined ? value : ''}
          invalid={invalid}
          aria-invalid={invalid || undefined}
          onChange={e =>
            set(name, e.target.value !== undefined ? e.target.value : checked)
          }
          {...rest}
        />
      );
    };

    const normalizedError = error || errors[name];
    const normalizedInfo = info || infos[name];
    const contents = children || renderInput(!!normalizedError);
    const containerRest = contents ? rest : {};

    addValidation(name, validateField(required, validate, messages));

    return (
      <div
        ref={ref}
        className={className}
        margin={margin}
        style={style}
        onFocus={onFocus}
        onBlur={event => {
          if (onContextBlur) onContextBlur(name);
          if (onBlur) onBlur(event);
        }}
        {...containerRest}
      >
        {label && rest.type !== 'checkbox' && <Label htmlFor={htmlFor}>{label}</Label>}
        {contents}
        {help && <FormText>{help}</FormText>}
        {normalizedError && <FormFeedback valid={false}>{normalizedError}</FormFeedback>}
        {normalizedInfo && <FormText>{normalizedInfo}</FormText>}
      </div>
    );
  }
);

export default FormField;
