import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import jsonata from "jsonata";
import { Preset, SectionsState, SectionType } from "./types";

const initialState: SectionsState = {
  sections: {
    input: { content: "{}", language: "json" },
    query: { content: "$", language: "jsonata" },
    bindings: {
      content: "{\n  //add your custom bindings here \n}",
      language: "javascript",
    },
  },
  presets: [],
  output: "",
  ui: {
    openSections: {
      input: true,
      query: true,
      bindings: true,
    },
    status: "idle",
  },
};

interface ProcessOutputPayload {
  query: string;
  bindings: string;
  input: string;
}

export const processOutputAsync = createAsyncThunk(
  "sections/processOutput",
  async ({ query, bindings, input }: ProcessOutputPayload) => {
    if (!input || !query) {
      throw new Error("Input and Query sections are required.");
    }

    let expression;
    let data;
    let bindingsObject;

    try {
      expression = jsonata(query);
      data = JSON.parse(input);
    } catch (error) {
      throw new Error(`Error in query: ${(error as Error).message}`);
    }

    try {
      bindingsObject = new Function(`return (${bindings})`)();
    } catch (error) {
      throw new Error(`Error in bindings: ${(error as Error).message}`);
    }

    try {
      const result = await expression.evaluate(data, bindingsObject);
      return JSON.stringify(result, null, 2);
    } catch (error) {
      throw new Error(`Error in query evaluation: ${(error as Error).message}`);
    }
  },
);

export const updateContentAndProcess = createAsyncThunk(
  "sections/updateContentAndProcess",
  async (
    { type, content }: { type: SectionType; content: string },
    { dispatch, getState },
  ) => {
    await dispatch(updateContent({ type, content }));
    const state = getState() as { sections: SectionsState };
    const { query, bindings, input } = state.sections.sections;

    return dispatch(
      processOutputAsync({
        query: query.content,
        bindings: bindings.content,
        input: input.content,
      }),
    );
  },
);

export const loadPresetAndProcess = createAsyncThunk(
  "sections/loadPresetAndProcess",
  async (presetId: string, { dispatch, getState }) => {
    await dispatch(loadPreset(presetId));
    const state = getState() as { sections: SectionsState };
    const { query, bindings, input } = state.sections.sections;

    return dispatch(
      processOutputAsync({
        query: query.content,
        bindings: bindings.content,
        input: input.content,
      }),
    );
  },
);

const sectionsSlice = createSlice({
  name: "sections",
  initialState,
  reducers: {
    toggleSection: (state, action: PayloadAction<SectionType>) => {
      state.ui.openSections[action.payload] =
        !state.ui.openSections[action.payload];
    },
    updateContent: (
      state,
      action: PayloadAction<{ type: SectionType; content: string }>,
    ) => {
      state.sections[action.payload.type].content = action.payload.content;
    },
    savePreset: (state, action: PayloadAction<{ name: string }>) => {
      const { query, bindings } = state.sections;
      const now = new Date().toISOString();

      const newPreset: Preset = {
        id: crypto.randomUUID(),
        name: action.payload.name,
        query: query.content,
        bindings: bindings.content,
        createdAt: now,
        updatedAt: now,
      };

      state.presets.push(newPreset);
      localStorage.setItem("presets", JSON.stringify(state.presets));
    },
    loadPreset: (state, action: PayloadAction<string>) => {
      const preset = state.presets.find((p) => p.id === action.payload);
      if (preset) {
        state.sections.query.content = preset.query;
        state.sections.bindings.content = preset.bindings;
        preset.updatedAt = new Date().toISOString();
        localStorage.setItem("presets", JSON.stringify(state.presets));
      }
    },
    deletePreset: (state, action: PayloadAction<string>) => {
      state.presets = state.presets.filter((p) => p.id !== action.payload);
      localStorage.setItem("presets", JSON.stringify(state.presets));
    },
    loadPresetsFromStorage: (state) => {
      const savedPresets = localStorage.getItem("presets");
      if (savedPresets) {
        state.presets = JSON.parse(savedPresets);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(processOutputAsync.pending, (state) => {
        state.ui.status = "loading";
        state.ui.error = undefined;
      })
      .addCase(processOutputAsync.fulfilled, (state, action) => {
        state.ui.status = "idle";
        state.output = action.payload;
      })
      .addCase(processOutputAsync.rejected, (state, action) => {
        state.ui.status = "failed";
        state.ui.error = action.error.message;
        state.output = action.error.message || "An error occurred";
      });
  },
});

export const {
  toggleSection,
  updateContent,
  savePreset,
  loadPreset,
  deletePreset,
  loadPresetsFromStorage,
} = sectionsSlice.actions;

export const selectPresets = (state: { sections: SectionsState }) =>
  state.sections.presets;
export const selectOutput = (state: { sections: SectionsState }) =>
  state.sections.output;
export const selectUIState = (state: { sections: SectionsState }) =>
  state.sections.ui;
export const selectSections = (state: { sections: SectionsState }) =>
  state.sections.sections;

export default sectionsSlice.reducer;
