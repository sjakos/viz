
export type SectionType = 'input' | 'query' | 'bindings';

export type Language = 'json' | 'jsonata' | 'javascript';

export interface Section {
  content: string;
  language: Language;
}

export interface Sections {
  input: Section;
  query: Section;
  bindings: Section;
}

export interface Preset {
  id: string;
  name: string;
  query: string;
  bindings: string;
  createdAt: string;
  updatedAt: string;
}

export interface UIState {
  openSections: Record<SectionType, boolean>;
  status: 'idle' | 'loading' | 'failed';
  error?: string;
}

export interface SectionsState {
  sections: Sections;
  presets: Preset[];
  output: string;
  ui: UIState;
}
