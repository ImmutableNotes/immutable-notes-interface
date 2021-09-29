import { RouteComponentProps } from 'react-router-dom';
import Connector from '@vite/connector';
import { setState } from './wep-state';

export type State = {
  vbInstance?: typeof Connector;
  timelines?: {
    [address: string]: Timeline;
  };
  notes?: {
    [hash: string]: Note;
  };
  setState?: setState;
};

export type Timeline = {
  bio: string;
  totalNotes: number;
  // tipsCount: string[];
  tips: { [tokenId: string]: number };
  noteHashHistory: string[];
};

export type Note = {
  hash: string;
  timestamp: number;
  text: string;
  author: string;
  // tipsCount: string[];
  tips: { [tokenId: string]: number };
  relatedNoteHash: string;
};
