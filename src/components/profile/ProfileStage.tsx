export interface PropsProfileStage {
  stage: Stage;
  isSearch: boolean;
}

interface Stage {
  username: string;
  upline: string;
  place: string | undefined;
  registerTime: number;
  unlockedLevels: number;
  entryAmount: number;
  defiCredit: number;
  lockedAmount: number;
  unlockedAmount: number;
  firstDirectLock: number;
  thirdDirectLock: number;
  directs: number;
  rightUsername: string;
  rightReward: number;
  middleUsername: string;
  middleReward: number;
  leftUsername: string;
  leftReward: number;
  totalReward: number;
  active: boolean;
}

import styles from "./profile.module.css";

export default function ProfileStage({ stage, isSearch }: PropsProfileStage) {
  return (
    <div className={"bg-base-200/30 p-4 my-2 rounded-lg"}>
      <div className="text-xl font-bold pb-2">Profile Stage</div>
      <div className={"grid w-full gap-2 " + styles.profileStage}>
        <div className="bg-gray-600/90 p-3 rounded-lg flex justify-between items-center">
          <span className="text-xl font-bold md:text-center w-1/6">
            Username
          </span>
          <span className="text-lg font-bold text-center w-1/4">
            {stage.username}
          </span>
        </div>

        <div className="bg-gray-600/90 p-3 rounded-lg flex justify-between items-center">
          <span className="text-xl font-bold md:text-center w-1/6">
            Referrer
          </span>
          <span className="text-xl font-bold text-center w-1/4">
            {stage.upline}
          </span>
        </div>

        <div className="bg-gray-600/90 p-3 rounded-lg flex justify-between items-center">
          <span className="text-lg font-bold md:text-center w-1/6">
            Posiotion
          </span>
          <span className="text-lg font-bold text-center w-1/4">
            {stage.place}
          </span>
        </div>

        <div className="bg-gray-600/90 p-3 rounded-lg flex justify-between items-center">
          <span className="text-xl font-bold whitespace-nowrap">
            Register Time
          </span>
          <span className="text-xs font-bold text-center w-1/4 break-all">
            {new Date(stage.registerTime * 1000).toLocaleString()}
          </span>
        </div>

        <div className="bg-gray-600/90 p-3 rounded-lg flex justify-between items-center">
          <span className="text-lg font-bold whitespace-nowrap">
            Unlocked Levels
          </span>
          <span className="text-lg font-bold text-center w-1/4">
            {stage.unlockedLevels}
          </span>
        </div>

        <div className="bg-gray-600/90 p-3 rounded-lg flex justify-between items-center">
          <span className="text-lg font-bold whitespace-nowrap">
            Entry Amount
          </span>
          <span className="text-lg font-bold text-center w-1/4">
            {stage.entryAmount.toFixed(2)}$
          </span>
        </div>

        {isSearch || (
          <>
            {" "}
            <div className="bg-gray-600/90 p-3 rounded-lg flex justify-between items-center">
              <span className="text-lg font-bold whitespace-nowrap">
                Total Unlocked Tokens
              </span>
              <span className="text-s font-bold text-center w-1/4">
                {Math.round(stage.unlockedAmount)} FRV
              </span>
            </div>
            <div className="bg-gray-600/90 p-3 rounded-lg flex justify-between items-center">
              <span className="text-lg font-bold whitespace-nowrap">
                Total Locked Tokens
              </span>
              <span className="text-s font-bold text-center w-1/4">
                {Math.round(stage.lockedAmount)} FRV
              </span>
            </div>
            <div className="bg-gray-600/90 p-3 rounded-lg flex justify-between items-center">
              <span className="text-lg font-bold whitespace-nowrap">
                First Direct Lock
              </span>
              <span className="text-s font-bold text-center w-1/4">
                {stage.firstDirectLock.toFixed(2)}$
              </span>
            </div>
            <div className="bg-gray-600/90 p-3 rounded-lg flex justify-between items-center">
              <span className="text-lg font-bold whitespace-nowrap">
                Third Direct Lock
              </span>
              <span className="text-s font-bold text-center w-1/4">
                {stage.thirdDirectLock.toFixed(2)}$
              </span>
            </div>
            <div className="bg-gray-600/90 p-3 rounded-lg flex justify-between items-center">
              <span className="text-lg font-bold whitespace-nowrap">
                DeFi Credit
              </span>
              <span className="text-s font-bold text-center w-1/4">
                {stage.defiCredit.toFixed(2)}$
              </span>
            </div>
          </>
        )}

        <div className="bg-gray-600/90 p-3 rounded-lg flex justify-between items-center">
          <span className="text-lg font-bold md:text-center w-1/6">
            Directs
          </span>
          <span className="text-lg font-bold text-center w-1/4">
            {stage.directs}
          </span>
        </div>

        <div className="bg-gray-600/90 p-3 rounded-lg flex justify-between items-center">
          <span className="text-lg font-bold md:text-center w-1/6">Right</span>
          <span className="text-lg  font-bold text-center w-1/4">
            {stage.rightUsername}
          </span>
        </div>

        {isSearch || (
          <div className="bg-gray-600/90 p-3 rounded-lg flex justify-between items-center">
            <span className="text-lg font-bold md:text-center w-1/6">
              Right Reward
            </span>
            <span className="text-lg  font-bold text-center w-1/4">
              {stage.rightReward.toFixed(2)}$
            </span>
          </div>
        )}

        <div className="bg-gray-600/90 p-3 rounded-lg flex justify-between items-center">
          <span className="text-lg font-bold md:text-center w-1/6">Middle</span>
          <span className="text-lg  font-bold text-center w-1/4">
            {stage.middleUsername}
          </span>
        </div>

        {isSearch || (
          <div className="bg-gray-600/90 p-3 rounded-lg flex justify-between items-center">
            <span className="text-lg font-bold md:text-center w-1/6">
              Middle Reward
            </span>
            <span className="text-lg  font-bold text-center w-1/4">
              {stage.middleReward.toFixed(2)}$
            </span>
          </div>
        )}

        <div className="bg-gray-600/90 p-3 rounded-lg flex justify-between items-center">
          <span className="text-lg font-bold md:text-center w-1/6">Left</span>
          <span className="text-lg font-bold text-center w-1/4">
            {stage.leftUsername}
          </span>
        </div>

        {isSearch || (
          <div className="bg-gray-600/90 p-3 rounded-lg flex justify-between items-center">
            <span className="text-lg font-bold md:text-center w-1/6">
              Left Reward
            </span>
            <span className="text-lg font-bold text-center w-1/4">
              {stage.leftReward.toFixed(2)}$
            </span>
          </div>
        )}
        {isSearch || (
          <div className="bg-gray-600/90 p-3 rounded-lg flex justify-between items-center">
            <span className="text-lg font-bold md:text-center w-1/6">
              Total Reward
            </span>
            <span className="text-lg font-bold text-center w-1/4">
              {stage.totalReward.toFixed(2)}$
            </span>
          </div>
        )}

        <div className="bg-gray-600/90 p-3 rounded-lg flex justify-between items-center">
          <span className="text-lg font-bold md:text-center w-1/6">Active</span>
          <span className="text-lg font-bold text-center w-1/4">
            {stage.active.toString()}
          </span>
        </div>
      </div>
    </div>
  );
}
