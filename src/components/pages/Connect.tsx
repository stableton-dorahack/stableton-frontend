import { TonConnectButton } from '@tonconnect/ui-react';

export default function Connect({ onConnect }: { onConnect: () => void }) {
  return (
    <div className="grid h-screen place-content-center">
      <div className="container flex w-screen max-w-xs justify-center rounded-xl border-gray-200 p-7 shadow">
        <button onClick={onConnect}>
          <TonConnectButton />
        </button>
      </div>
    </div>
  );
}
