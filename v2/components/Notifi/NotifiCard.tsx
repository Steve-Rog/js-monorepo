import { arrayify } from '@ethersproject/bytes';
import {
  NotifiContext,
  NotifiInputFieldsText,
  NotifiInputSeparators,
  NotifiSubscriptionCard,
} from '@notifi-network/notifi-react-card';
import './notifi.css';
import React from 'react';
import Connector from '../../ui/containers/Connector';

export const NotifiCard: React.FC = () => {
  const connector = Connector.useContainer();
  const signer = connector.signer;
  const walletAddress = connector.walletAddress;
  const walletBlockchain = connector.isL2 ? "OPTIMISM" : "ETHEREUM";
  const env = connector.isMainnet ? "Production" : "Development";
  const cardId = connector.isMainnet ? "7aa4348b9cf7487bbb9a85a628ebd25b" : "8a569abd38974f76837960bd9bf36049";

  if (signer === null || walletAddress === null) {
    // account is required
    return null;
  }

  const inputLabels: NotifiInputFieldsText = {
    label: {
    },
    placeholderText: {
      email: 'Email address',
      telegram: 'Telegram ID'
    },
  };

  const inputSeparators: NotifiInputSeparators = {
    smsSeparator: {
      content: 'OR',
    },
    emailSeparator: {
      content: 'OR',
    },
  };

  return (
    <NotifiContext
      dappAddress="synthetix"
      env={env}
      signMessage={async (message: Uint8Array) => {
        const result = await signer.signMessage(message);
        return arrayify(result);
      }}
      walletPublicKey={walletAddress}
      walletBlockchain={walletBlockchain} 
    >
      <NotifiSubscriptionCard
        cardId={cardId}
        inputLabels={inputLabels}
        inputSeparators={inputSeparators}
        inputs={{userWallet: walletAddress}}
        copy={{
          FetchedStateCard: {
            SubscriptionCardV1: {
              EditCard: {
                AlertListPreview: {
                  description: 'Get real-time alerts to the destinations of your choice',
                },
              },
            },
          },
        }}
        darkMode
      />
    </NotifiContext>
  );
};