import { tipTokenIds, tokensMap } from './constants';
import { utils } from '@vite/vitejs';

export const TwitterIcon = ({ size = 24 }: { size: number }) => (
  <svg
    className="fill-current"
    width={size}
    height={size}
    viewBox="0 0 20 20"
    xmlns="http://www.w3.org/2000/svg"
    focusable="false"
    aria-hidden="true"
  >
    <path d="M20 3.92377C19.2639 4.25068 18.4731 4.47067 17.6432 4.5699C18.4908 4.06223 19.1408 3.25841 19.4469 2.29999C18.6547 2.76997 17.7762 3.1115 16.8409 3.2961C16.0925 2.49844 15.0263 2 13.8464 2C11.5803 2 9.74347 3.83762 9.74347 6.10292C9.74347 6.42445 9.78039 6.73828 9.84962 7.0375C6.43975 6.86674 3.41679 5.23295 1.39225 2.74997C1.03996 3.3561 0.83766 4.06069 0.83766 4.81374C0.83766 6.23676 1.56148 7.49287 2.66221 8.22822C1.98992 8.20669 1.35687 8.02208 0.803815 7.71517C0.803815 7.73286 0.803815 7.74901 0.803815 7.7667C0.803815 9.75509 2.21761 11.4135 4.09523 11.7896C3.75139 11.8835 3.38833 11.9335 3.01373 11.9335C2.74989 11.9335 2.49221 11.9073 2.24222 11.8604C2.76451 13.4903 4.27984 14.6772 6.07515 14.7103C4.67136 15.811 2.9022 16.4671 0.979193 16.4671C0.648437 16.4671 0.321526 16.4479 0 16.4094C1.81608 17.5733 3.97216 18.2525 6.28976 18.2525C13.8372 18.2525 17.9632 12.0004 17.9632 6.57829C17.9632 6.4006 17.9593 6.22368 17.9516 6.04754C18.7539 5.46833 19.45 4.74605 20 3.92377Z"></path>
  </svg>
);

export const shortenAddress = (address: string) => address.substring(0, 10) + '...' + address.substring(50);
export const shortenHash = (address: string) => address.substring(0, 5) + '...' + address.substring(59);

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const formatDate = (date: number | Date, verbose?: boolean, utc?: boolean) => {
  if (!date) {
    return;
  }
  date = new Date(date);
  const day = date[`get${utc ? 'UTC' : ''}Date`]();
  const month = date[`get${utc ? 'UTC' : ''}Month`]();
  const year = date[`get${utc ? 'UTC' : ''}FullYear`]();

  if (verbose) {
    const minute = date.getMinutes();
    // · middle dot shift+option+9
    // • bullet option+8
    return `${year} ${MONTHS[month]} ${day} · ${date.getHours()}:${minute < 10 ? `0${minute}` : minute}`;
  }
  return `${year}-${month + 1}-${day}`;
};

export const amountToStringInt = (amount: string, decimals: number = 0) => {
  const num = +amount;
  if (Number.isNaN(num)) {
    return num + '';
  }
  return num * 10 ** decimals + '';
};

export const stringIntToAmount = (amount: string | number, decimals: number = 0, maxDecimals?: number) => {
  let num = +amount;
  if (Number.isNaN(num)) {
    return 0;
  }
  num = num / 10 ** decimals;
  if (maxDecimals !== undefined) {
    return parseFloat(num.toFixed(maxDecimals));
  }
  return num;
};

export const tipsCountToObject = (tipsCount?: string[]) => {
  return Array.isArray(tipsCount)
    ? tipsCount.reduce((acc: { [tokenId: string]: number }, amount, i) => {
        acc[tipTokenIds[i]] = stringIntToAmount(amount, tokensMap.get(tipTokenIds[i])?.decimals);
        return acc;
      }, {})
    : {};
};

export const isValidHash = (str: string) => str.length === 64 && utils.isHexString(str);
