"use client";

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "@/lib/state/store";
import {
  toggleSection,
  updateContentAndProcess,
  savePreset,
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
  BookmarkIcon,
  SaveIcon,
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
import { ComboBox, ComboBoxItem } from "@/components/ui/combobox";

import React from "react";

export default function Page() {
  const dispatch = useDispatch<AppDispatch>();
  const sections = useSelector(selectSections);
  const { openSections, status, error } = useSelector(selectUIState);
  const presets = useSelector(selectPresets);
  const output = useSelector(selectOutput);
  const [newPresetName, setNewPresetName] = React.useState("");
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [selectedPreset, setSelectedPreset] = React.useState<ComboBoxItem | null>(
    null,
  );

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
      const newPreset = {
        value: crypto.randomUUID(),
        label: newPresetName,
      };
      setSelectedPreset(newPreset);
      setNewPresetName("");
      setIsDialogOpen(false);
    }
  };

  const handleLoadPreset = async (presetId: string) => {
    await dispatch(loadPresetAndProcess(presetId));
  };

  const handlePresetSelect = (preset: ComboBoxItem | null) => {
    setSelectedPreset(preset);
    if (preset) {
      handleLoadPreset(preset.value);
    }
  };

  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel>
        <div className="border-b">
          <div className="w-full px-4 py-2 flex justify-between items-center rounded-none">
            <h3 className="font-semibold">Transform & Filter</h3>
            <div>
              <ComboBox
                Icon={BookmarkIcon}
                placeholder="Load a preset"
                searchPlaceholder="Search presets..."
                emptyMessage="No presets found"
                items={presets.map((preset) => ({
                  value: preset.id,
                  label: preset.name,
                }))}
                selectedItem={
                  selectedPreset
                    ? {
                        value: selectedPreset.value,
                        label: selectedPreset.label,
                      }
                    : null
                }
                onItemSelect={handlePresetSelect}
              />
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <SaveIcon className="h-4 w-4" />
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
