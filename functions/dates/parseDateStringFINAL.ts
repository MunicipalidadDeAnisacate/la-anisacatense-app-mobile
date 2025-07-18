// esta funcion es usada para cuando recibimos fechas del backend y las necesitamos pasar a date
// ya sea para analisis o enviarlas a DatePickerInput
export const parseDateString = (dateString: string): Date => {
  const [day, month, year] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
};