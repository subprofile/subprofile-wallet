import { ChangeEvent, FC, FormEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, TextField } from '@mui/material';
import { NewWalletScreenStep } from 'components/pages/NewWallet/types';
import EmptySpace from 'components/shared/misc/EmptySpace';
import { setupWalletActions } from 'redux/slices/setup-wallet';
import { RootState } from 'redux/store';
import { Props } from 'types';

const ConfirmWalletPassword: FC<Props> = ({ className = '' }: Props) => {
  const dispatch = useDispatch();
  const { password } = useSelector((state: RootState) => state.setupWallet);
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [notMatch, setNotMatch] = useState<boolean>(true);

  useEffect(() => {
    setNotMatch(password !== passwordConfirmation);
  }, [passwordConfirmation]);

  const next = (e: FormEvent) => {
    e.preventDefault();

    if (notMatch) {
      return;
    }

    dispatch(setupWalletActions.setStep(NewWalletScreenStep.BackupSecretRecoveryPhrase));
  };

  const back = () => {
    dispatch(setupWalletActions.setStep(NewWalletScreenStep.ChooseWalletPassword));
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPasswordConfirmation(event.target.value);
  };

  return (
    <div className={className}>
      <h4 className='mb-4'>Next, confirm your wallet password</h4>

      <form className='flex flex-col gap-2' noValidate autoComplete='off' onSubmit={next}>
        <TextField
          label='Confirm Wallet Password'
          fullWidth
          autoFocus
          type='password'
          onChange={handleChange}
          value={passwordConfirmation}
          error={!!passwordConfirmation && notMatch}
          helperText={!!passwordConfirmation && notMatch ? 'Password does not match' : <EmptySpace />}
        />
        <div className='flex flex-row gap-4'>
          <Button variant='text' onClick={back}>
            Back
          </Button>
          <Button type='submit' fullWidth disabled={notMatch} size='large'>
            Next
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ConfirmWalletPassword;
