export function isErrorValid(formData:any, errorObj:any): boolean {
  return Object.values(errorObj).every((val) => val === '');
}