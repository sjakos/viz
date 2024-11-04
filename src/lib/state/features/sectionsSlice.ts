import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Section {
  title: string;
  content: string;
  language: string;
}

interface SectionsState {
  sections: Section[];
  openSections: { [key: string]: boolean };
  output: string;
}

const initialState: SectionsState = {
  sections: [
    { title: 'Input', content: '{}', language: 'json' },
    { title: 'Query', content: '$', language: 'jsonata' },
    { title: 'Bindings', content: '{\n  //add your custom bindings here \n}', language: 'javascript' },
  ],
  openSections: {
    Input: true,
    Query: true,
    Bindings: true,
  },
  output: '',
};

const sectionsSlice = createSlice({
  name: 'sections',
  initialState,
  reducers: {
    toggleSection: (state, action: PayloadAction<string>) => {
      state.openSections[action.payload] = !state.openSections[action.payload];
    },
    updateContent: (state, action: PayloadAction<{ title: string; content: string }>) => {
      const section = state.sections.find((section) => section.title === action.payload.title);
      if (section) {
        section.content = action.payload.content;
      }
    },
    saveConfiguration: (state) => {
      localStorage.setItem('sectionsConfig', JSON.stringify(state.sections));
    },
    setOutput: (state, action: PayloadAction<string>) => {
      state.output = action.payload;
    },
  },
});

export const { toggleSection, updateContent, saveConfiguration, setOutput } = sectionsSlice.actions;
export const selectOutput = (state: { sections: SectionsState }) => state.sections.output;
export default sectionsSlice.reducer;
