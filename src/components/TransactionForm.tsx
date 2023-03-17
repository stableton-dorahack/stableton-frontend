import { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Action } from '../types';

type TransactionFormProps = {
  action: Action;
  disabled?: boolean;
  onSubmit?: (action: Action, amount: number) => void;
};

const TransactionForm = ({
  action,
  disabled,
  onSubmit: initialOnSubmit,
}: TransactionFormProps) => {
  type Inputs = {
    [key in Action]: string;
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    initialOnSubmit?.(action, +data[action]);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
      <input
        {...register(action, { required: true })}
        autoComplete="off"
        placeholder="0.0"
        className="box-border w-full rounded-xl border border-slate-200 py-5 pl-4 text-2xl font-medium shadow-sm outline-none focus:border-slate-400"
        disabled={disabled}
      />
      <button
        type="submit"
        disabled={disabled}
        className="w-full rounded-xl bg-slate-600 py-3 font-semibold text-white first-letter:uppercase hover:bg-slate-700 disabled:bg-slate-400"
      >
        {action}
      </button>
    </form>
  );
};

export default TransactionForm;
