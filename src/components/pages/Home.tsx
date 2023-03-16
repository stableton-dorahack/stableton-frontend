import { ReactNode } from 'react';

type HomeProps = {
  data: {
    balance: number;
    formattedAddress: string;
    tonDeposited: number;
    tonPrice: number;
    collateralVolume: number;
    stablesBorrowed: number;
    healthFactor: number;
  };
  onCollateralClick: () => void;
  onStableClick: () => void;
  Toaster: React.FC;
};

export default function Home({
  data,
  onCollateralClick,
  onStableClick,
  Toaster,
}: HomeProps) {
  return (
    <div className="grid h-screen place-content-center">
      <div className="container w-screen max-w-xs rounded-xl p-7 shadow">
        <div className="flex flex-col gap-3">
          <div className=" flex items-center gap-3">
            <img src="/ton.svg" className="w-12"></img>
            <div>
              <div className="text-xl font-semibold">{data.balance} TON</div>
              <div className="text-sm text-gray-500">
                {data.formattedAddress}
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-1 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 p-5">
              <div>
                Ton price:
                <span className="font-medium"> ${data.tonPrice}</span>
              </div>
              <div>
                Deposited:
                <span className="font-medium"> {data.tonDeposited} TON</span>
              </div>
              <div>
                Collateral volume:
                <span className="font-medium"> ${data.collateralVolume}</span>
              </div>
            </div>
            <div className="flex flex-col gap-1 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 p-5">
              <div>
                Stables borrowed:
                <span className="font-medium"> ${data.stablesBorrowed}</span>
              </div>
              <div>
                Health factor:
                <span
                  className={`font-medium ${
                    data.healthFactor < 1 && 'text-rose-500'
                  }`}
                >
                  {` ${data.healthFactor}`}
                </span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onCollateralClick}
              className="w-full rounded-xl bg-gray-600 py-4 font-medium text-white hover:bg-gray-700"
            >
              Collateral
            </button>
            <button
              onClick={onStableClick}
              className="w-full rounded-xl bg-gray-600 py-4 font-medium text-white hover:bg-gray-700"
            >
              Stable
            </button>
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
}
