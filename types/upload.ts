export interface UploadResult {
  url?: string;      
  path?: string;     
  success: boolean;
  error?: string;
  logo?: {
    url: string;
    path: string;
  };
}