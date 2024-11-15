export interface FileType {
  name: string;
  type: string;
}
export interface ReadmeFile extends FileType {
  content: string;
}
