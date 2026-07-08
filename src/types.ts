export interface AudioSample {
  id: string;
  title: string;
  audioUrl: string;
  category?: string;
  duration?: string;
  plays?: number;
}

export interface User {
  email: string;
  isAdmin: boolean;
}
