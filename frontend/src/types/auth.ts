export interface User {
  id: number;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  phone?: string | null;
  bio?: string | null;
  profile_picture?: string | null;
  created_at: string;
}

// Helper to get display name
export const getDisplayName = (user: User): string => {
  if (user.first_name && user.last_name) {
    return `${user.first_name} ${user.last_name}`;
  }
  if (user.first_name) {
    return user.first_name;
  }
  return user.username || user.email;
};

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  username?: string;
  first_name: string;
  last_name: string;
  password: string;
  password2: string;
  phone?: string;
}

export interface AuthResponse {
  user?: User;
  access?: string;
  refresh?: string;
  tokens?: {
    access: string;
    refresh: string;
  };
  message?: string;
}