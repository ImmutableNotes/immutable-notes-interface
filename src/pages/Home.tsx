import { useState, useCallback, useMemo } from 'react';
import { connect } from '../utils/wep-state';
import PageContainer from '../components/PageContainer';
import TextInput from '../components/TextInput';
import { State } from '../utils/types';
import { callContract } from '../utils/vitescripts';
import { RouteComponentProps } from 'react-router';
import { isValidHash } from '../utils/misc';
import { zeroHash } from '../utils/constants';

type Props = State & RouteComponentProps;

const Home = ({ history, vbInstance }: Props) => {
  const [note, noteSet] = useState('');
  const [relatedNoteHash, relatedNoteHashSet] = useState('');
  const record = useCallback(() => {
    if (vbInstance) {
      if (relatedNoteHash && !isValidHash(relatedNoteHash)) {
        return window.alert('Invalid related note hash');
      }
      callContract(vbInstance, 'recordNote', [note, relatedNoteHash || zeroHash]).then(
        (block) => {
          return history.push(`/hash/${block.hash}`);
        },
        (e) => window.alert('recordNote error: ' + JSON.stringify(e))
      );
    }
  }, [relatedNoteHash, history, vbInstance, note]);

  const submitDisabled = useMemo(() => !vbInstance || !note.length, [vbInstance, note]);

  return (
    <PageContainer>
      <form
        action="#" // https://stackoverflow.com/a/45705325/13442719
        onSubmit={(e) => {
          e.preventDefault();
          record();
        }}
      >
        <TextInput
          textarea
          value={note}
          onUserInput={(v) => noteSet(v)}
          placeholder="What would you like to record? Forever. Be careful. And have fun!"
          className="resize-none text-3xl md:text-4xl h-60 md:h-72 w-full"
          onMetaEnter={record}
        />
        <div className="mt-2 flex justify-end space-x-4">
          <TextInput
            value={relatedNoteHash}
            onUserInput={(v) => relatedNoteHashSet(v)}
            placeholder="Related note hash"
            className="text-xl flex-1 w-0"
            onMetaEnter={record}
          />
          <button
            disabled={submitDisabled}
            className={`float-right rect text-white ${submitDisabled ? 'bg-gray-400' : 'bg-blue-500'}`}
          >
            Submit
          </button>
        </div>
      </form>
    </PageContainer>
  );
};

export default connect('vbInstance')(Home);
