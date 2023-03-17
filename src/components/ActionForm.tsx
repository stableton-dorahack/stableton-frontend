import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';

type FormProps = {
  actions: [string, string];
} & React.HTMLAttributes<HTMLFormElement>;

const Form = ({ actions, className }: FormProps) => {
  const [active, setActive] = useState<string>(actions[0]);

  type Inputs = {
    amount: string;
  };

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data);
  // console.log(watch('amount'));

  const button =
    'w-full font-medium rounded-lg py-2 text-slate-600 first-letter:uppercase';
  const activeButton = `${button} bg-white font-semibold`;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={`flex flex-col gap-2 ${className}`}
    >
      <div className="flex rounded-xl bg-slate-100 p-1">
        <button
          type="button"
          onClick={() => setActive(actions[0])}
          className={active === actions[0] ? activeButton : button}
        >
          {actions[0]}
        </button>
        <button
          type="button"
          onClick={() => setActive(actions[1])}
          className={active === actions[1] ? activeButton : button}
        >
          {actions[1]}
        </button>
      </div>

      <input
        {...register('amount', { required: true })}
        autoComplete="off"
        placeholder="0.0"
        className="box-border w-full rounded-xl border border-slate-200 py-5 pl-4 text-2xl font-medium shadow-sm outline-none focus:border-slate-400"
      />

      <button
        type="submit"
        className="rounded-xl bg-slate-600 py-3 font-semibold text-white first-letter:uppercase hover:bg-slate-700 disabled:bg-slate-400"
      >
        {active}
      </button>
    </form>
  );
};

export default Form;
