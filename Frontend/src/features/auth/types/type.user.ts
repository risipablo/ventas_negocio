export interface RegisterData{
    email:string
    password:string
    name:string
}

export interface LoginData{
    email:string
    password: string
}


export interface AuthResponse {
    message?: string;
    token?: string;
    user?: {
      id: string;
      email: string;
      name: string;
    };
  }
  
  export interface ApiError {
    error: string;
    response?: {
      data?: {
        error?: string;
      };
    };
    request?: unknown;
    message?: string;
}

export interface AuthLayoutProps{
    children: React.ReactNode
    title:string
}

export interface PasswordInputProps{
    value:string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    placeholder:string
    required?: boolean
    delay?: number
    name?:string
    showStrength?: boolean
}

export interface AuthButtonProps{
    loading: boolean
    text: string
    type?: 'button' | 'submit' | 'reset';
}

export interface PasswordRequirementsProps{
    show:boolean
    onToggle: () => void
}
