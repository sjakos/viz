"use client";

import React from 'react';
import { useSelector } from 'react-redux';
import { selectOutput } from '@/lib/state/features/sectionsSlice';

export default function TableView() {
  const output = useSelector(selectOutput);

  let data;
  try {
    console.log(output);
    data = JSON.parse(output);
  } catch {
    data = [];
  }

  if (!Array.isArray(data) || data.length === 0) {
    return <div>No data available to display.</div>;
  }

  const headers = Object.keys(data[0]);

  return (
    <div>
      <h1>Table View</h1>
      <table>
        <thead>
          <tr>
            {headers.map((key) => (
              <th key={key}>{key}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item: any, index: number) => (
            <tr key={index}>
              {headers.map((key) => (
                <td key={key}>{String(item[key])}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
