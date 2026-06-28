import { Alert, Platform } from 'react-native';

interface ConfirmDestructiveActionOptions {
  title: string;
  message: string;
  confirmLabel: string;
  onConfirm: () => void | Promise<void>;
  cancelLabel?: string;
}

export function confirmDestructiveAction({
  title,
  message,
  confirmLabel,
  onConfirm,
  cancelLabel = 'Cancel',
}: ConfirmDestructiveActionOptions): void {
  const confirm = () => {
    void onConfirm();
  };

  if (Platform.OS === 'web') {
    const globalScope = globalThis as typeof globalThis & {
      confirm?: (message?: string) => boolean;
    };

    if (globalScope.confirm?.(`${title}\n\n${message}`)) {
      confirm();
    }
    return;
  }

  Alert.alert(title, message, [
    { text: cancelLabel, style: 'cancel' },
    { text: confirmLabel, style: 'destructive', onPress: confirm },
  ]);
}
