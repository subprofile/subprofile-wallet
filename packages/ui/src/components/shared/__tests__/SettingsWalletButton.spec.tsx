import { initializeKeyring, newUser, render, screen, UserEvent, waitFor } from '__tests__/testUtils';
import SettingsWalletButton from '../settings/SettingsWalletButton';

describe('SettingsWalletButton', () => {
  it('should hide the dialog by default', async () => {
    render(<SettingsWalletButton />, { preloadedState: { app: { seedReady: false, ready: true, locked: true } } });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  describe('when the dialog is open', () => {
    let user: UserEvent, container: HTMLElement;
    beforeEach(() => {
      user = newUser();
      const result = render(<SettingsWalletButton />, {
        preloadedState: { app: { seedReady: true, ready: true, locked: false } },
      });
      container = result.container;
      const button = screen.getByTitle('Open settings');
      user.click(button);
    });

    it('should active dark button and dark theme when clicking the on it', async () => {
      const button = await screen.findByRole('button', { name: /Dark/ });
      user.click(button);

      await waitFor(() => {
        expect(button).toHaveClass('MuiButton-outlinedPrimary');
        expect(document.body.classList.contains('dark')).toBeTruthy;
      });
    });

    it('should close the dialog when clicking the close button', async () => {
      const closeButton = await screen.findByTitle('Close settings');
      user.click(closeButton);

      await waitFor(() => {
        expect(screen.queryByText('Settings')).not.toBeInTheDocument();
      });
    });

    it('should show theme mode button and language selection when dialog open', async () => {
      expect(await screen.findByRole('dialog')).toBeInTheDocument();
      expect(await screen.findByRole('button', { name: /Dark/ })).toBeInTheDocument();
      expect(await screen.findByRole('button', { name: /Light/ })).toBeInTheDocument();
      expect(await screen.findByRole('button', { name: /System/ })).toBeInTheDocument();
      expect(await screen.findByRole('button', { name: /Close settings/ })).toBeInTheDocument();
      expect(await screen.findByRole('button', { name: /English/ })).toBeInTheDocument();
    });
  });

  describe('keyring not initialized', () => {
    it('should be hidden', () => {
      render(<SettingsWalletButton />, { preloadedState: { app: { seedReady: false, ready: true, locked: false } } });
      expect(screen.queryByTitle('Open settings')).not.toBeInTheDocument();
    });
  });

  describe('keyring initialized', () => {
    beforeEach(async () => {
      await initializeKeyring();
    });
    it('should be hidden if the wallet is locked', () => {
      render(<SettingsWalletButton />, { preloadedState: { app: { seedReady: true, ready: true, locked: true } } });
      expect(screen.queryByTitle('Open settings')).not.toBeInTheDocument();
    });
    it('should be visible if the wallet is unlocked', () => {
      render(<SettingsWalletButton />, { preloadedState: { app: { seedReady: true, ready: true, locked: false } } });
      expect(screen.queryByTitle('Open settings')).toBeInTheDocument();
    });
  });
});
