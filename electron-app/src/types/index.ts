export interface Student {
  id?: number;
  name: string;
  email: string;
  subject: 'Math' | 'Science' | 'English' | 'History';
  grade: number;
  created_at?: string;
}

export interface AuthRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    username: string;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface Analytics {
  totalStudents: number;
  averageGradeBySubject: {
    [subject: string]: number;
  };
  recentAdditions: Student[];
}

export interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  user: { username: string } | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

export interface ActiveTabContextType {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}