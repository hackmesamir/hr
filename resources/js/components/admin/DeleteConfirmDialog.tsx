import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2 } from 'lucide-react';

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  itemId: number;
  deleteEndpoint: string;
}

export default function DeleteConfirmDialog({
  isOpen,
  onClose,
  title,
  description,
  itemId,
  deleteEndpoint
}: DeleteConfirmDialogProps) {
  const { delete: destroy, processing } = useForm();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = () => {
    setIsDeleting(true);
    destroy(deleteEndpoint, {
      onSuccess: () => {
        setIsDeleting(false);
        onClose();
      },
      onError: () => {
        setIsDeleting(false);
      }
    });
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={processing}>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
            disabled={processing}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
