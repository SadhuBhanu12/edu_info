import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CodeEditor } from '../../components/CodeEditor';
import { ArrowLeft, BookOpen, Lightbulb } from 'lucide-react';
import './PracticePage.css';

export default function PracticePage() {
  const { problemId } = useParams<{ problemId: string }>();
  const navigate = useNavigate();
  const [showHints, setShowHints] = useState(false);

  // Mock problem data - replace with actual data fetch
  const problem = {
    id: problemId || 'two-sum',
    title: 'Two Sum',
    difficulty: 'Easy' as const,
    description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.`,
    constraints: [
      '2 <= nums.length <= 10^4',
      '-10^9 <= nums[i] <= 10^9',
      '-10^9 <= target <= 10^9',
      'Only one valid answer exists.'
    ],
    examples: [
      {
        input: 'nums = [2,7,11,15], target = 9',
        output: '[0,1]',
        explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].'
      },
      {
        input: 'nums = [3,2,4], target = 6',
        output: '[1,2]',
        explanation: 'Because nums[1] + nums[2] == 6, we return [1, 2].'
      }
    ],
    starterCode: {
      javascript: `function twoSum(nums, target) {\n    // Write your code here\n    \n}`,
      python: `def twoSum(nums, target):\n    # Write your code here\n    pass`,
      java: `class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Write your code here\n        \n    }\n}`,
      cpp: `class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        // Write your code here\n        \n    }\n};`
    },
    hints: [
      'A really brute force way would be to search for all possible pairs of numbers but that would be too slow.',
      'Try using a hash map to store the numbers you\'ve seen so far.',
      'For each number, check if target - number exists in the hash map.'
    ],
    topicTags: ['Array', 'Hash Table'],
    companies: ['Amazon', 'Google', 'Microsoft', 'Facebook']
  };

  return (
    <div className="practice-page">
      <button className="back-button" onClick={() => navigate(-1)}>
        <ArrowLeft size={20} />
        Back to Problems
      </button>

      <div className="practice-container">
        <div className="problem-panel">
          <div className="problem-header">
            <h1 className="problem-title">{problem.title}</h1>
            <span className={`difficulty-badge ${problem.difficulty.toLowerCase()}`}>
              {problem.difficulty}
            </span>
          </div>

          <div className="problem-description">
            <h3><BookOpen size={18} /> Description</h3>
            <p>{problem.description}</p>
          </div>

          <div className="problem-examples">
            <h3>Examples</h3>
            {problem.examples.map((example, idx) => (
              <div key={idx} className="example">
                <strong>Example {idx + 1}:</strong>
                <pre>
                  <strong>Input:</strong> {example.input}{'\n'}
                  <strong>Output:</strong> {example.output}{'\n'}
                  {example.explanation && <><strong>Explanation:</strong> {example.explanation}</>}
                </pre>
              </div>
            ))}
          </div>

          <div className="problem-constraints">
            <h3>Constraints</h3>
            <ul>
              {problem.constraints.map((constraint, idx) => (
                <li key={idx}>{constraint}</li>
              ))}
            </ul>
          </div>

          <button 
            className="hints-toggle"
            onClick={() => setShowHints(!showHints)}
          >
            <Lightbulb size={18} />
            {showHints ? 'Hide Hints' : 'Show Hints'}
          </button>

          {showHints && (
            <div className="problem-hints">
              <h3>Hints</h3>
              {problem.hints.map((hint, idx) => (
                <div key={idx} className="hint">
                  <strong>Hint {idx + 1}:</strong> {hint}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="editor-panel">
          <CodeEditor
            problemId={problem.id}
            initialCode={problem.starterCode.javascript}
          />
        </div>
      </div>
    </div>
  );
}
