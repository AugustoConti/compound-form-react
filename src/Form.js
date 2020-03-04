import React, {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import { Button, Form as FormStrap } from 'reactstrap';

const FormContext = createContext();
export const useFormContext = () => useContext(FormContext);

const updateErrors = (nextErrors, name, error) => {
  const hasStatusError = typeof error === 'object' && error.status === 'error';
  if (
    (typeof error === 'object' && !error.status) ||
    hasStatusError ||
    typeof error === 'string'
  ) {
    nextErrors[name] = hasStatusError ? error.message : error;
  } else {
    delete nextErrors[name];
  }
};

const updateInfos = (nextInfos, name, error) => {
  if (typeof error === 'object' && error.status === 'info') {
    nextInfos[name] = error.message;
  } else {
    delete nextInfos[name];
  }
};

const Form = forwardRef(
  (
    {
      children,
      errors: errorsProp,
      infos: infosProp,
      messages = { invalid: 'invalid', required: 'required' },
      onChange,
      onReset,
      onSubmit,
      validate = 'submit',
      initialValue = {},
      ...rest
    },
    ref
  ) => {
    const [value, setValue] = useState(initialValue);
    const [errors, setErrors] = useState(errorsProp || {});
    useEffect(() => setErrors(errorsProp || {}), [errorsProp]);
    const [infos, setInfos] = useState(infosProp || {});
    useEffect(() => setInfos(infosProp || {}), [infosProp]);
    const [touched, setTouched] = useState({});
    const validations = useRef({});

    useEffect(() => {
      if (onChange) onChange(value);
    }, [onChange, value]);

    const update = useCallback((name, data, initial) => {
      setValue(prevValue => {
        const nextValue = { ...prevValue };
        nextValue[name] = data;

        setErrors(prevErrors => {
          const nextErrors = { ...prevErrors };
          Object.keys(prevErrors).forEach(errName => {
            if (validations.current[errName]) {
              const nextError = validations.current[errName](data, nextValue);
              updateErrors(nextErrors, errName, nextError);
            }
          });
          return nextErrors;
        });

        setInfos(prevInfos => {
          const nextInfos = { ...prevInfos };
          Object.keys(nextInfos).forEach(infoName => {
            if (validations.current[infoName]) {
              const nextInfo = validations.current[infoName](data, nextValue);
              updateInfos(nextInfos, infoName, nextInfo);
            }
          });
          return nextInfos;
        });

        return nextValue;
      });

      if (!initial) setTouched(prevTouched => ({ ...prevTouched, [name]: true }));
    }, []);

    return (
      <FormStrap
        ref={ref}
        {...rest}
        onReset={event => {
          setValue(initialValue);
          setErrors({});
          setTouched({});
          if (onReset) {
            event.persist(); // extract from React's synthetic event pool
            onReset({ ...event, value: {} });
          }
        }}
        onSubmit={event => {
          event.preventDefault();
          const nextErrors = { ...errors };
          const nextInfos = { ...infos };
          Object.keys(validations.current).forEach(name => {
            const nextError = validations.current[name](value[name], value);
            updateErrors(nextErrors, name, nextError);
            updateInfos(nextInfos, name, nextError);
          });
          setErrors(nextErrors);
          setInfos(nextInfos);
          if (Object.keys(nextErrors).length === 0 && onSubmit) {
            event.persist(); // extract from React's synthetic event pool
            onSubmit({ ...event, value, touched });
          }
        }}
      >
        <FormContext.Provider
          value={{
            addValidation: (name, validation) => {
              validations.current[name] = validation;
            },
            onBlur:
              validate === 'blur'
                ? name => {
                    if (validations.current[name]) {
                      const error = validations.current[name](value[name], value);
                      setErrors(prevErrors => {
                        const nextErrors = { ...prevErrors };
                        updateErrors(nextErrors, name, error);
                        return nextErrors;
                      });
                      setInfos(prevInfos => {
                        const nextInfos = { ...prevInfos };
                        updateInfos(nextInfos, name, error);
                        return nextInfos;
                      });
                    }
                  }
                : undefined,
            errors,
            get: name => value[name],
            infos,
            messages,
            set: (name, nextValue) => update(name, nextValue),
          }}
        >
          {children}
        </FormContext.Provider>
        <Button type="submit">Submit</Button>
      </FormStrap>
    );
  }
);

export default Form;
