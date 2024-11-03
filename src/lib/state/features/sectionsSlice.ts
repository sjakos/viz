import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Section {
  title: string;
  content: string;
}

interface SectionsState {
  sections: Section[];
  openSections: { [key: string]: boolean };
}

const initialState: SectionsState = {
  sections: [
    { title: 'Input', content: '' },
    { title: 'Query', content: '' },
    { title: 'Bindings', content: '' },
  ],
  openSections: {
    Input: true,
    Query: true,
    Bindings: true,
  },
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
  },
});

export const { toggleSection, updateContent, saveConfiguration } = sectionsSlice.actions;
export default sectionsSlice.reducer;