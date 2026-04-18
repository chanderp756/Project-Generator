/**
 * Shared entity definitions to ensure FE and BE use the same data models.
 */
export interface GeneratedFile {
  path: string;
  content: string;
}

export interface ProjectPackage {
  id: string;
  config: any; // Tied to ProjectConfig in api_spec.ts
  files: GeneratedFile[];
  createdAt: string;
}