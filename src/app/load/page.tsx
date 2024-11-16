"use client";

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "@/lib/state/store";
import {
  toggleSection,
  updateContentAndProcess,
  savePreset,
  deletePreset,
  loadPresetsFromStorage,
  selectPresets,
  selectOutput,
  selectUIState,
  loadPresetAndProcess,
  selectSections,
} from "@/lib/state/features/sectionsSlice";
import { Section, SectionType } from "@/lib/state/features/types";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  ChevronUp,
  Type,
  Search,
  Link,
  File,
  Save,
  Trash2,
} from "lucide-react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import Editor from "@monaco-editor/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import React from "react";

export default function Page() {
  const dispatch = useDispatch<AppDispatch>();
  const sections = useSelector(selectSections);
  const { openSections, status, error } = useSelector(selectUIState);
  const presets = useSelector(selectPresets);
  const output = useSelector(selectOutput);
  const [newPresetName, setNewPresetName] = React.useState("");
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  useEffect(() => {
    dispatch(loadPresetsFromStorage());
  }, [dispatch]);

  const sectionIcons = {
    input: Type,
    query: Search,
    bindings: Link,
  } as const;

  const handleSectionToggle = (type: SectionType) => {
    dispatch(toggleSection(type));
  };

  const handleContentChange = (
    type: SectionType,
    newContent: string | undefined,
  ) => {
    dispatch(updateContentAndProcess({ type, content: newContent || "" }));
  };

  const handleSavePreset = () => {
    if (newPresetName.trim()) {
      dispatch(savePreset({ name: newPresetName }));
      setNewPresetName("");
      setIsDialogOpen(false);
    }
  };

  const handleLoadPreset = async (presetId: string) => {
    await dispatch(loadPresetAndProcess(presetId));
  };

  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel>
        <div className="flex justify-end mt-4 px-4 py-2 border-b">
          <div className="flex gap-2">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Save className="h-4 w-4 mr-2" />
                  Save as Preset
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Save Preset</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-4">
                  <Input
                    placeholder="Preset name"
                    value={newPresetName}
                    onChange={(e) => setNewPresetName(e.target.value)}
                  />
                  <Button onClick={handleSavePreset}>Save</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="border-b">
          <div className="px-4 py-2">
            <h3 className="font-semibold">Saved Presets</h3>
          </div>
          <div className="px-4 py-2 space-y-2">
            {presets.map((preset) => (
              <div
                key={preset.id}
                className="flex items-center justify-between"
              >
                <Button
                  variant="ghost"
                  className="flex-1 justify-start"
                  onClick={() => handleLoadPreset(preset.id)}
                >
                  {preset.name}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => dispatch(deletePreset(preset.id))}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {(Object.entries(sections) as [SectionType, Section][]).map(
          ([type, section], index) => (
            <Collapsible
              key={type}
              open={openSections[type]}
              onOpenChange={() => handleSectionToggle(type)}
              className="flex flex-col"
            >
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className={`flex w-full justify-between px-4 py-2 text-left rounded-none ${index !== 0 ? "border-t border-b" : ""}`}
                >
                  <div className="flex items-center space-x-2">
                    {React.createElement(sectionIcons[type], {
                      className: "h-5 w-5",
                    })}
                    <span className="font-semibold">
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </span>
                  </div>
                  {openSections[type] ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="border-t flex-grow overflow-auto">
                {openSections[type] && (
                  <Editor
                    className="w-full h-full min-h-[100px] rounded-none border-none resize-none"
                    onChange={(e) => handleContentChange(type, e)}
                    options={{ minimap: { enabled: false } }}
                    value={section.content}
                    defaultLanguage={section.language}
                  />
                )}
              </CollapsibleContent>
            </Collapsible>
          ),
        )}
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel>
        <div className="flex w-full justify-between px-4 py-2 text-left rounded-none border-b">
          <div className="flex items-center space-x-2">
            <File className="h-5 w-5" />
            <span className="font-semibold">Output</span>
            {status === "loading" && (
              <span className="text-sm text-muted-foreground">
                (Processing...)
              </span>
            )}
          </div>
        </div>
        <Editor
          className="flex-grow w-full h-full rounded-none border-none resize-none"
          options={{
            domReadOnly: true,
            readOnly: true,
            minimap: { enabled: false },
          }}
          height="90vh"
          language="json"
          value={status === "failed" ? `Error: ${error}` : output}
        />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
