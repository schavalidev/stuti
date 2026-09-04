// Aggregates the "coming soon" catalog entries every deity text file
// contributes (each used to push one or more entries onto a shared
// window.STUTI_TEXTS_EXTRA array at load time — see stuti-texts.ts).
import { extra as x_ganesha } from "./stuti-text-ganesha";
import { extra as x_ganesha2 } from "./stuti-text-ganesha2";
import { extra as x_ganesha3 } from "./stuti-text-ganesha3";
import { extra as x_ganesha4 } from "./stuti-text-ganesha4";
import { extra as x_guru } from "./stuti-text-guru";
import { extra as x_guru2 } from "./stuti-text-guru2";
import { extra as x_subrahmanya } from "./stuti-text-subrahmanya";
import { extra as x_subrahmanya2 } from "./stuti-text-subrahmanya2";
import { extra as x_subrahmanya3 } from "./stuti-text-subrahmanya3";
import { extra as x_subrahmanya4 } from "./stuti-text-subrahmanya4";
import { extra as x_subrahmanya5 } from "./stuti-text-subrahmanya5";
import { extra as x_subrahmanya6 } from "./stuti-text-subrahmanya6";
import { extra as x_subrahmanya7 } from "./stuti-text-subrahmanya7";
import { extra as x_subrahmanya8 } from "./stuti-text-subrahmanya8";
import { extra as x_subrahmanya9 } from "./stuti-text-subrahmanya9";
import { extra as x_subrahmanya10 } from "./stuti-text-subrahmanya10";
import { extra as x_shiva } from "./stuti-text-shiva";
import { extra as x_shiva2 } from "./stuti-text-shiva2";
import { extra as x_shiva3 } from "./stuti-text-shiva3";
import { extra as x_devi } from "./stuti-text-devi";
import { extra as x_devi2 } from "./stuti-text-devi2";
import { extra as x_devi3 } from "./stuti-text-devi3";
import { extra as x_devi4 } from "./stuti-text-devi4";
import { extra as x_vishnu } from "./stuti-text-vishnu";
import { extra as x_vishnu2 } from "./stuti-text-vishnu2";
import { extra as x_hanuman } from "./stuti-text-hanuman";

export const STUTI_TEXTS_EXTRA = [
  ...x_ganesha,
  ...x_ganesha2,
  ...x_ganesha3,
  ...x_ganesha4,
  ...x_guru,
  ...x_guru2,
  ...x_subrahmanya,
  ...x_subrahmanya2,
  ...x_subrahmanya3,
  ...x_subrahmanya4,
  ...x_subrahmanya5,
  ...x_subrahmanya6,
  ...x_subrahmanya7,
  ...x_subrahmanya8,
  ...x_subrahmanya9,
  ...x_subrahmanya10,
  ...x_shiva,
  ...x_shiva2,
  ...x_shiva3,
  ...x_devi,
  ...x_devi2,
  ...x_devi3,
  ...x_devi4,
  ...x_vishnu,
  ...x_vishnu2,
  ...x_hanuman,
];
