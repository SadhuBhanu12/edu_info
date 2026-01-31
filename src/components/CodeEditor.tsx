import React, { useState, useCallback, useEffect } from 'react';
import { Play, Save, RotateCcw, Download, Check, X, Clock, Zap } from 'lucide-react';
import type { CodeSubmission, TestCase, CodeExecutionResult } from '../types';
import './CodeEditor.css';

interface CodeEditorProps {
  problemId: string;
  initialCode?: string;
  language?: 'javascript' | 'python' | 'java' | 'cpp' | 'typescript';
  testCases?: TestCase[];
  onSubmit?: (submission: CodeSubmission) => void;
  onSave?: (code: string) => void;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  problemId,
  initialCode = '',
  language = 'javascript',
  testCases = [],
  onSubmit,
  onSave
}) => {
  const [code, setCode] = useState(initialCode);
  const [selectedLanguage, setSelectedLanguage] = useState(language);
  const [fontSize, setFontSize] = useState(14);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState<string>('');
  const [executionResult, setExecutionResult] = useState<CodeExecutionResult | null>(null);
  const [activeTab, setActiveTab] = useState<'testcases' | 'output' | 'submit'>('testcases');

  const templates: Record<string, string> = {
    javascript: `function solution(arr) {
  // Write your code here
  
  return result;
}

// Test your solution
console.log(solution([1, 2, 3]));`,
    
    python: `def solution(arr):
    # Write your code here
    
    return result

# Test your solution
print(solution([1, 2, 3]))`,
    
    java: `class Solution {
    public int[] solution(int[] arr) {
        // Write your code here
        
        return result;
    }
    
    public static void main(String[] args) {
        Solution sol = new Solution();
        int[] result = sol.solution(new int[]{1, 2, 3});
        System.out.println(Arrays.toString(result));
    }
}`,
    
    cpp: `#include <iostream>
#include <vector>
using namespace std;

vector<int> solution(vector<int>& arr) {
    // Write your code here
    
    return result;
}

int main() {
    vector<int> arr = {1, 2, 3};
    vector<int> result = solution(arr);
    
    for (int num : result) {
        cout << num << " ";
    }
    return 0;
}`,
    
    typescript: `function solution(arr: number[]): number[] {
  // Write your code here
  
  return result;
}

// Test your solution
console.log(solution([1, 2, 3]));`
  };

  useEffect(() => {
    if (!code || code === initialCode) {
      setCode(templates[selectedLanguage]);
    }
  }, [selectedLanguage]);

  const handleRun = useCallback(async () => {
    setIsRunning(true);
    setActiveTab('output');
    setOutput('');

    try {
      // NOTE: Code execution requires backend API integration
      // This is a placeholder - integrate with Judge0 API, AWS Lambda, or similar code execution service
      setOutput(
        '⚠️ Code Execution Service Not Connected\n\n' +
        'To enable code execution, integrate with:\n' +
        '• Judge0 API (https://judge0.com/)\n' +
        '• LeetCode API\n' +
        '• AWS Lambda for custom execution\n\n' +
        'Your code:\n' +
        code.substring(0, 200) + (code.length > 200 ? '...' : '')
      );
      
      setExecutionResult(null);
    } catch (error) {
      setOutput(`Error: ${error instanceof Error ? error.message : 'Unknown error'}\n`);
      setExecutionResult(null);
    } finally {
      setIsRunning(false);
    }
  }, [code, selectedLanguage, testCases]);

  const handleSubmit = useCallback(async () => {
    setIsRunning(true);
    setActiveTab('submit');

    try {
      // NOTE: Code submission requires backend API integration
      // This would typically call your backend to execute and grade the solution
      const submission: CodeSubmission = {
        id: Date.now().toString(),
        problemId,
        userId: 'current-user', // Get from auth context
        code,
        language: selectedLanguage,
        status: 'pending',
        submittedAt: new Date().toISOString()
      };

      if (onSubmit) {
        onSubmit(submission);
      }
      
      setOutput(
        '⚠️ Code Submission Service Not Connected\n\n' +
        'To enable code submission and grading:\n' +
        '• Set up backend API endpoint for code execution\n' +
        '• Integrate with LeetCode or similar grading system\n' +
        '• Connect to Supabase Edge Functions for serverless execution\n\n' +
        'Your submission has been saved locally.'
      );
    } catch (error) {
      setOutput(`Submission error: ${error instanceof Error ? error.message : 'Unknown error'}\n`);
    } finally {
      setIsRunning(false);
    }
  }, [code, problemId, selectedLanguage, onSubmit]);

  const handleSave = () => {
    if (onSave) {
      onSave(code);
    }
    // Show success notification
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset the code?')) {
      setCode(templates[selectedLanguage]);
      setOutput('');
      setExecutionResult(null);
    }
  };

  const handleDownload = () => {
    const extensions: Record<string, string> = {
      javascript: 'js',
      python: 'py',
      java: 'java',
      cpp: 'cpp',
      typescript: 'ts'
    };

    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `solution.${extensions[selectedLanguage]}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = e.target as HTMLTextAreaElement;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newCode = code.substring(0, start) + '  ' + code.substring(end);
      setCode(newCode);
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2;
      }, 0);
    }

    // Ctrl/Cmd + S to save
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      handleSave();
    }

    // Ctrl/Cmd + Enter to run
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleRun();
    }
  };

  return (
    <div className={`code-editor ${theme}`}>
      {/* Header */}
      <div className="editor-header">
        <div className="editor-controls">
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value as any)}
            className="language-select"
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
            <option value="typescript">TypeScript</option>
          </select>

          <div className="font-controls">
            <button onClick={() => setFontSize(Math.max(10, fontSize - 2))} className="icon-btn">
              A-
            </button>
            <span className="font-size">{fontSize}px</span>
            <button onClick={() => setFontSize(Math.min(24, fontSize + 2))} className="icon-btn">
              A+
            </button>
          </div>

          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="icon-btn"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>

        <div className="action-buttons">
          <button onClick={handleReset} className="btn btn-secondary" title="Reset Code">
            <RotateCcw size={16} />
          </button>
          <button onClick={handleDownload} className="btn btn-secondary" title="Download">
            <Download size={16} />
          </button>
          <button onClick={handleSave} className="btn btn-secondary" title="Save (Ctrl+S)">
            <Save size={16} /> Save
          </button>
          <button
            onClick={handleRun}
            disabled={isRunning}
            className="btn btn-primary"
            title="Run Code (Ctrl+Enter)"
          >
            <Play size={16} /> Run
          </button>
          <button
            onClick={handleSubmit}
            disabled={isRunning}
            className="btn btn-success"
          >
            <Check size={16} /> Submit
          </button>
        </div>
      </div>

      {/* Code Area */}
      <div className="editor-main">
        <div className="editor-container">
          <div className="line-numbers">
            {code.split('\n').map((_, i) => (
              <div key={i} className="line-number">{i + 1}</div>
            ))}
          </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={handleKeyDown}
            className="code-textarea"
            style={{ fontSize: `${fontSize}px` }}
            spellCheck={false}
            placeholder="Write your code here..."
          />
        </div>
      </div>

      {/* Output Section */}
      <div className="editor-footer">
        <div className="footer-tabs">
          <button
            onClick={() => setActiveTab('testcases')}
            className={`tab ${activeTab === 'testcases' ? 'active' : ''}`}
          >
            Test Cases ({testCases.length})
          </button>
          <button
            onClick={() => setActiveTab('output')}
            className={`tab ${activeTab === 'output' ? 'active' : ''}`}
          >
            Output
          </button>
          <button
            onClick={() => setActiveTab('submit')}
            className={`tab ${activeTab === 'submit' ? 'active' : ''}`}
          >
            Submission
          </button>
        </div>

        <div className="footer-content">
          {activeTab === 'testcases' && (
            <div className="test-cases">
              {testCases.map((testCase, idx) => (
                <div key={testCase.id} className="test-case">
                  <div className="test-case-header">
                    <span className="test-case-title">Test Case {idx + 1}</span>
                    {executionResult?.testResults?.[idx] && (
                      <span className={`test-status ${executionResult.testResults[idx].passed ? 'passed' : 'failed'}`}>
                        {executionResult.testResults[idx].passed ? <Check size={14} /> : <X size={14} />}
                        {executionResult.testResults[idx].passed ? 'Passed' : 'Failed'}
                      </span>
                    )}
                  </div>
                  <div className="test-case-content">
                    <div className="test-input">
                      <strong>Input:</strong>
                      <pre>{testCase.input}</pre>
                    </div>
                    <div className="test-output">
                      <strong>Expected Output:</strong>
                      <pre>{testCase.expectedOutput}</pre>
                    </div>
                    {executionResult?.testResults?.[idx] && !executionResult.testResults[idx].passed && (
                      <div className="test-actual">
                        <strong>Your Output:</strong>
                        <pre className="error">{executionResult.testResults[idx].actualOutput}</pre>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'output' && (
            <div className="output-panel">
              <pre className="output-text">{output || 'No output yet. Click "Run" to execute your code.'}</pre>
              {executionResult && executionResult.success && (
                <div className="execution-stats">
                  <div className="stat">
                    <Clock size={14} />
                    <span>Runtime: {executionResult.runtime}ms</span>
                  </div>
                  <div className="stat">
                    <Zap size={14} />
                    <span>Memory: {executionResult.memory}MB</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'submit' && (
            <div className="submission-panel">
              {output ? (
                <pre className="output-text">{output}</pre>
              ) : (
                <p className="submission-hint">
                  Ready to submit? Make sure your code passes all test cases first!
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
