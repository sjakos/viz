"use client";

import { useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/lib/state/store';
import { toggleSection, updateContent, saveConfiguration } from '@/lib/state/features/sectionsSlice';
import { Textarea } from "@/components/ui/textarea";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Type, Search, Link } from "lucide-react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import React from "react";

export default function Content() {
  const dispatch = useDispatch<AppDispatch>();
  const sections = useSelector((state: RootState) => state.sections.sections);
  const openSections = useSelector((state: RootState) => state.sections.openSections);
  const [output, setOutput] = useState("");

  const sectionIcons = {
    Input: Type,
    Query: Search,
    Bindings: Link
  };

  const handleSectionToggle = (title: string) => {
    dispatch(toggleSection(title));
  };

  const handleContentChange = (title: string, newContent: string) => {
    dispatch(updateContent({ title, content: newContent }));
    setOutput(
      sections
        .map((section) => `${section.title}:\n${section.content}`)
        .join("\n\n"),
    );
  };

  const handleSaveConfiguration = () => {
    dispatch(saveConfiguration());
  };

  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel>
        {/* Left half - Collapsible sections */}
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
                  {React.createElement(sectionIcons[section.title as keyof typeof sectionIcons], { className: "h-5 w-5" })}
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
        <Button onClick={handleSaveConfiguration} className="mt-4">
          Save Configuration
        </Button>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel>
        <h2 className="text-2xl font-bold px-4 py-2 border-b">Output</h2>
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
