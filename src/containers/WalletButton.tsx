import { useState, useCallback } from 'react';
import Connector from '@vite/connector';
import { connect } from '../utils/wep-state';
import QR from '../components/QR';
import Modal from '../components/Modal';
import A from '../components/A';
import { State } from '../utils/types';

const BRIDGE = 'wss://biforst.vite.net';

type Props = State;

export const WalletButton = ({ vbInstance, setState }: Props) => {
  const [connectURI, connectURISet] = useState('');
  const connectWallet = useCallback(() => {
    if (connectURI) {
      return connectURISet('');
    }
    const vbInstance = new Connector({ bridge: BRIDGE });
    vbInstance.createSession().then(() => connectURISet(vbInstance.uri));
    vbInstance.on('connect', (e: Error | null, payload: any | null) => {
      if (e) {
        return window.alert('connect error: ' + JSON.stringify(e));
      }
      const { accounts } = payload.params[0];
      if (!accounts || !accounts[0]) throw new Error('address is null');
      setState!({ vbInstance });
      connectURISet('');
    });
    vbInstance.on('disconnect', () => {
      setState!({ vbInstance: null });
      // vbInstance.destroy();
    });
  }, [setState, connectURI]);

  return (
    <div>
      <button
        className={`rect ${vbInstance ? 'border-2 text-gray-600 border-gray-600' : 'shadow text-white bg-blue-500'}`}
        onClick={() => {
          if (vbInstance) {
            // vbInstance.killSession(); // Throws error from @vite/connector
            setState!({ vbInstance: null }); // TODO: update types so that you don't have to use setState!
          } else {
            connectWallet();
          }
        }}
      >
        {vbInstance ? 'Disconnect' : 'Connect'}
      </button>
      {vbInstance && (
        <A
          to={`/address/${vbInstance.accounts[0]}`}
          className="block mt-1 text-gray-600"
          title={vbInstance.accounts[0]}
        >
          {vbInstance.accounts[0].substring(0, 10)}...{vbInstance.accounts[0].substring(50)}
        </A>
      )}
      {connectURI && (
        <Modal onClose={() => connectURISet('')}>
          <p className="minor text-center text-xl mb-4">Scan with the Vite Wallet app</p>
          <QR data={connectURI} className="w-80 h-80" />
        </Modal>
      )}
    </div>
  );
};

export default connect('vbInstance')(WalletButton);
