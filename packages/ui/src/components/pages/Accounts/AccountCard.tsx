import { Identicon } from '@polkadot/react-identicon';
import { FC } from 'react';
import { styled } from '@mui/material';
import AccountAddress from 'components/pages/Accounts/AccountAddress';
import AccountControls from 'components/pages/Accounts/AccountControls';
import ShowAddressQrCodeButton from 'components/pages/Accounts/ShowAddressQrCodeButton';
import CopyAddressTooltip from 'components/shared/CopyAddressTooltip';
import { AccountInfoExt, Props } from 'types';

interface AccountCardProps extends Props {
  account: AccountInfoExt;
}

const AccountCard: FC<AccountCardProps> = ({ className = '', account }) => {
  const { networkAddress, name } = account;

  return (
    <div
      id={networkAddress}
      className={`${className} account-card transition-colors duration-200 border border-black/10 dark:border-white/15 `}>
      <div className='account-card--icon'>
        <CopyAddressTooltip address={networkAddress} name={name}>
          <Identicon value={networkAddress} size={32} theme='polkadot' />
        </CopyAddressTooltip>
      </div>
      <div className='flex-grow'>
        <div className='account-card__name'>{name}</div>
        <AccountAddress address={networkAddress} name={name} className='text-xs' />
      </div>
      <div className='flex gap-1'>
        <ShowAddressQrCodeButton account={account} className='max-[300px]:hidden' />
        <AccountControls account={account} />
      </div>
    </div>
  );
};

export default styled(AccountCard)`
  padding: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  border-radius: 4px;

  .account-card--icon {
    font-size: 0;
  }

  .account-card__name {
    font-weight: 600;
    font-size: 1.1rem;
    display: flex;
    align-items: center;
    gap: 1px;
  }

  .account-card__address {
    font-size: 0.8rem;
  }
`;
