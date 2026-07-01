import { toast } from '../store/toast';

export function copyText(text: string, label = 'Copied to clipboard') {
  navigator.clipboard?.writeText(text).then(
    () => toast.success(label),
    () => toast.error('Copy failed'),
  );
}
