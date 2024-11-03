"use client";

import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/lib/state/store";
import {
  toggleSection,
  updateContent,
  saveConfiguration,
} from "@/lib/state/features/sectionsSlice";
import { Textarea } from "@/components/ui/textarea";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Type, Search, Link, File } from "lucide-react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

import jsonata from "jsonata";
import React from "react";

export default function Content() {
  const dispatch = useDispatch<AppDispatch>();
  const sections = useSelector((state: RootState) => state.sections.sections);
  const openSections = useSelector(
    (state: RootState) => state.sections.openSections,
  );
  const [output, setOutput] = useState("");

  const sectionIcons = {
    Input: Type,
    Query: Search,
    Bindings: Link,
  };

  const handleSectionToggle = (title: string) => {
    dispatch(toggleSection(title));
  };

  const processOutput = async (sectionsData: typeof sections) => {
    const query = sectionsData.find(
      (section) => section.title === "Query",
    )?.content;
    const bindings =
      sectionsData.find((section) => section.title === "Bindings")?.content ||
      "{}";
    const input = sectionsData.find(
      (section) => section.title === "Input",
    )?.content;

    if (!input || !query) {
      return "Input and Query sections are required.";
    }

    let expression;
    let data;
    let bindingsObject;
    try {
      expression = jsonata(query);
      data = JSON.parse(input);
    } catch (error) {
      return `Error in query: ${(error as Error).message}`;
    }

    try {
      bindingsObject = eval(`(${bindings})`);
    } catch (error) {
      return `Error in bindings: ${(error as Error).message}`;
    }

    try {
      const result = await expression.evaluate(data, bindingsObject);
      return JSON.stringify(result, null, 2);
    } catch (error) {
      return `Error in query evaluation: ${(error as Error).message}`;
    }
  };

  const handleContentChange = async (title: string, newContent: string) => {
    dispatch(updateContent({ title, content: newContent }));
    const updatedSections = sections.map((section) =>
      section.title === title ? { ...section, content: newContent } : section,
    );
    const result = await processOutput(updatedSections);
    setOutput(result);
  };

  const handleSaveConfiguration = () => {
    dispatch(saveConfiguration());
  };

  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel>
        <div className="flex justify-end mt-4 px-4 py-2 border-b">
          <Button onClick={handleSaveConfiguration}>Save Configuration</Button>
        </div>
        {sections.map((section, index) => (
          <Collapsible
            key={section.title}
            open={openSections[section.title]}
            onOpenChange={() => handleSectionToggle(section.title)}
            className="flex flex-col"
          >
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className={`flex w-full justify-between px-4 py-2 text-left rounded-none ${index !== 0 ? "border-t border-b" : ""}`}
              >
                <div className="flex items-center space-x-2">
                  {React.createElement(
                    sectionIcons[section.title as keyof typeof sectionIcons],
                    { className: "h-5 w-5" },
                  )}
                  <span className="font-semibold">{section.title}</span>
                </div>
                {openSections[section.title] ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="border-t flex-grow overflow-auto">
              {openSections[section.title] && (
                <Textarea
                  value={section.content}
                  onChange={(e) =>
                    handleContentChange(section.title, e.target.value)
                  }
                  placeholder={`Enter ${section.title.toLowerCase()} here...`}
                  className="w-full h-full min-h-[100px] rounded-none border-none resize-none"
                />
              )}
            </CollapsibleContent>
          </Collapsible>
        ))}
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel>
        <div className="flex w-full justify-between px-4 py-2 text-left rounded-none border-b">
          <div className="flex items-center space-x-2">
            <File className="h-5 w-5" />
            <span className="font-semibold">Output</span>
          </div>
        </div>
        <Textarea
          value={output}
          readOnly
          className="flex-grow w-full h-full rounded-none border-none resize-none"
          placeholder="The content from all sections will be displayed here."
        />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
