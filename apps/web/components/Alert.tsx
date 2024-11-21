import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

interface AlertProps {
  showAlert: boolean;
  setShowAlert: (a: boolean) => void;
  onConfirm: () => void;
}

const Alert: React.FC<AlertProps> = ({ onConfirm, showAlert, setShowAlert }) => {
  return (
    <AlertDialog open={showAlert}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center !text-accent-700">Are you sure?</AlertDialogTitle>
          <AlertDialogDescription className="text-center !text-accent-500">This action cannot be undone. This will permanently delete the item.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setShowAlert(false)} type="button">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="!bg-primary !text-white">
            Confirm
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default Alert;