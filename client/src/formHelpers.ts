import { FormalWebState } from "@kevinwolf/formal-web";

export function getTextFieldProps<P>(
  formal: FormalWebState<P>,
  field: keyof P
) {
  const { error, ...props } = formal.getFieldProps(field);
  return {
    helperText: error,
    error: !!error,
    ...props
  };
}
