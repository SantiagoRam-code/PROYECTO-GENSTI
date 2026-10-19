
// Validación estricta de dominios UCC
export const validateUccEmail = (email) => {
  const cleanEmail = email.trim().toLowerCase();
  
  if (cleanEmail.endsWith("@campusucc.edu.co")) {
    return { isValid: true, role: "student", domainLabel: "Estudiante UCC" };
  }
  
  if (cleanEmail.endsWith("@ucc.edu.co")) {
    return { isValid: true, role: "admin", domainLabel: "Profesor / Administrativo UCC" };
  }

  return { 
    isValid: false, 
    role: null, 
    error: "El correo debe terminar en @campusucc.edu.co (Estudiantes) o @ucc.edu.co (Profesores)." 
  };
};

// Obtener usuarios guardados
export const getStoredUsers = () => {
  const users = localStorage.getItem("gensti_registered_users");
  return users ? JSON.parse(users) : [
    {
      name: "Thomas Santiago Ramirez Ruiz",
      email: "thomas.santi@campusucc.edu.co",
      password: "123",
      role: "student"
    },
    {
      name: "Coordinación Académica UCC",
      email: "coordinacion@ucc.edu.co",
      password: "123",
      role: "admin"
    }
  ];
};

// Guardar nuevo usuario
export const registerUser = (name, email, password) => {
  const validation = validateUccEmail(email);
  if (!validation.isValid) throw new Error(validation.error);

  const users = getStoredUsers();
  const exists = users.some(u => u.email.toLowerCase() === email.trim().toLowerCase());
  if (exists) throw new Error("Este correo institucional ya se encuentra registrado.");

  const newUser = {
    name,
    email: email.trim().toLowerCase(),
    password,
    role: validation.role
  };

  users.push(newUser);
  localStorage.setItem("gensti_registered_users", JSON.stringify(users));
  return newUser;
};

// Iniciar Sesión
export const loginUser = (email, password) => {
  const users = getStoredUsers();
  const user = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password);
  
  if (!user) throw new Error("Credenciales inválidas. Verifica tu correo y contraseña.");
  return user;
};