import React from 'react';
import { useParams } from 'react-router-dom';
import ArrayAnimation from '../ArrayAnimation';
import LinkedListAnimation from '../LinkedListAnimation';
import StackAnimation from '../StackAnimation';
import QueueAnimation from '../QueueAnimation';
import BinaryTreeAnimation from '../BinaryTreeAnimation';

const TopicAnimationPage: React.FC = () => {
  const { topicId } = useParams<{ topicId: string }>();

  // Route to specific animation based on topic
  switch (topicId?.toLowerCase()) {
    case 'arrays':
      return <ArrayAnimation />;
    case 'linked-lists':
    case 'linked-list':
      return <LinkedListAnimation />;
    case 'stacks':
    case 'stack':
      return <StackAnimation />;
    case 'queues':
    case 'queue':
      return <QueueAnimation />;
    case 'binary-trees':
    case 'binary-tree':
    case 'trees':
      return <BinaryTreeAnimation />;
    default:
      // Default to array animation if topic not found
      return <ArrayAnimation />;
  }
};

export default TopicAnimationPage;
