
export const validateName = (name: string): boolean => {
  return name.trim().length > 0;
}

export const validateEmail = (email: string): boolean => {
  const regex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
  return regex.test(email.trim());
};

export const validatePhone = (phone: string): boolean => {
  const regex = /^(?!0)(?!15)\d{10}$/;
  return regex.test(phone.trim());
};

export const validateAge = (date: Date): boolean => {
  return date <= new Date();
};

export const validateEditPerfilUser = (data: {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  fechaNacimiento: Date;
}): string[] => {
  const errors: string[] = [];
  if (!validateName(data.nombre)) errors.push('Nombre inválido.');
  if (!validateName(data.apellido)) errors.push('Apellido inválido.');
  if (!validateEmail(data.email)) errors.push('Email inválido.');
  if (!validatePhone(data.telefono)) errors.push('Teléfono inválido.');
  if (!validateAge(data.fechaNacimiento)) errors.push('Fecha de nacimiento inválida.');
  return errors;
};