import { formatDate, isValidHash, TwitterIcon } from '../utils/misc';
import A from '../components/A';
import { State, Note } from '../utils/types';
import { connect } from '../utils/wep-state';
import { callContract } from '../utils/vitescripts';
import TipButtonRow from './TipButtonRow';
import { useMemo } from 'react';
import { zeroHash } from '../utils/constants';

const TWEET_URL = 'https://twitter.com/intent/tweet?text=';

type Props = State & {
  hash: string;
};

const NoteCard = ({ hash, setState, vbInstance, notes }: Props) => {
  const note = useMemo<Note | undefined>(() => notes![hash], [notes, hash]);
  if (!note) {
    return null;
  }
  const { timestamp, text, author, relatedNoteHash } = note;

  return (
    <div className="space-y-4">
      <A to={`/hash/${hash}`}>
        <h1 className="text-4xl inline">{text}</h1>
      </A>
      <div>
        <A to={`/address/${author}`}>{author}</A>
        {' | '}
        <span className="minor">{formatDate(timestamp, true)}</span>
      </div>
      <div className="flex">
        {relatedNoteHash && (
          <A to={`/hash/${relatedNoteHash}`} className="minor mr-2">
            Related: {relatedNoteHash}
          </A>
        )}
        {vbInstance?.accounts[0] === author && (
          <button
            className="text-blue-500"
            onClick={() => {
              const relatedNoteHash = window.prompt('New relatedNoteHash:');
              if (relatedNoteHash && !isValidHash(relatedNoteHash)) {
                return window.alert('Invalid related note hash');
              }
              if (relatedNoteHash === hash) {
                return window.alert(`You can't relate a note to itself`);
              }
              if (vbInstance && relatedNoteHash !== null) {
                callContract(vbInstance, 'updateRelatedNoteHash', [
                  hash,
                  relatedNoteHash === '' ? zeroHash : relatedNoteHash,
                ]).then(
                  () => {
                    setState!({ notes: { [hash]: { relatedNoteHash } } }, { deepMerge: true });
                  },
                  (e) => window.alert('updateRelatedNoteHash error: ' + JSON.stringify(e))
                );
              }
            }}
          >
            {relatedNoteHash ? 'Edit' : 'Add related note hash'}
          </button>
        )}
      </div>
      <TipButtonRow author={author} hash={hash}>
        <div className="flex flex-1 justify-end">
          <a
            title="Twitter"
            href={`${TWEET_URL}${encodeURI(`${text}\n\nimmutablenotes.com/hash/${hash}`)}`}
            target="_blank noreferrer noopener"
            className="xy ml-4 border-2 border-gray-300 text-gray-600 fill-current text-lg rounded px-1"
          >
            <TwitterIcon size={20} />
            <span className="ml-1">Tweet</span>
          </a>
        </div>
      </TipButtonRow>
    </div>
  );
};

export default connect('vbInstance, notes')(NoteCard);
