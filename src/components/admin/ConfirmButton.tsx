'use client';

export default function ConfirmButton({
  onConfirm,
  label = 'Delete',
  confirmMessage = 'Are you sure? This cannot be undone.',
  className = 'text-red-600 hover:underline text-sm',
}: {
  onConfirm: () => void;
  label?: string;
  confirmMessage?: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        if (window.confirm(confirmMessage)) onConfirm();
      }}
    >
      {label}
    </button>
  );
}
