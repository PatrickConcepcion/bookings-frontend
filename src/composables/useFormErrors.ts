import type { FormContext } from 'vee-validate';

export function useFormErrors() {

  const handleValidationErrors = (error: any, setErrors: FormContext['setErrors']) => {
    if (error?.response?.status === 422 && error?.response?.data?.errors) {
      const backendErrors = error.response.data.errors;
      const formErrors: Record<string, string> = {};

      Object.keys(backendErrors).forEach((field) => {
        formErrors[field] = Array.isArray(backendErrors[field])
          ? backendErrors[field][0]
          : backendErrors[field];
      });

      setErrors(formErrors);
      return true;
    }

    return false;
  };

  return {
    handleValidationErrors,
  };
}
