'use client'; 

import { useState } from 'react';
import Editor from '@monaco-editor/react';

export default function CodingPracticePlatform() {
  const [code, setCode] = useState('// Start coding here');

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      
      <h1 className="text-2xl font-bold mb-6">Coding Practice Platform</h1>

      <div className="flex w-full max-w-6xl gap-6">
        
        {/* Monaco Code Editor */}
        <div className="flex-1 bg-white shadow rounded">
          <Editor
            height="500px"
            defaultLanguage="javascript"
            defaultValue="// Write your code here"
            value={code}
            onChange={(value) => setCode(value || '')}
            theme="vs-light"
          />
        </div>

        {/* Output Box */}
        <div className="flex-1 bg-white shadow rounded p-4 overflow-auto">
          <h2 className="font-semibold text-black text-lg mb-4">Output</h2>
          <div className="h-[450px] bg-gray-50 border rounded p-4">
            {/* Placeholder output */}
            <p className="text-gray-500">Output will appear here...</p>
          </div>
        </div>

      </div>
    </div>
  );
}
