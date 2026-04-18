export interface ProjectConfig {
  projectName: string;
  description: string;
  platform: 'web' | 'mobile' | 'api';
  techStack: {
    frontend?: string;
    backend?: string;
    database?: string;
    llm: 'gemini' | 'claude' | 'openai';
  };
  auth: { enabled: boolean; type?: 'jwt' | 'oauth' | 'magic_link' };
}