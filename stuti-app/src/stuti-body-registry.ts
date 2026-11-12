/* Which body file carries which catalogue entries. Written by
   tools/codemod/fix-defer-bodies.mjs; read by stuti-bundled.ts. The heads are
   the live entry objects, so hanging a body's verses on one is what binds a
   hymn to its text — exactly as stuti-texts.ts has always done it. */
import { STUTI_TEXTS } from "./stuti-texts";
import { extra as m_ganesha } from "./stuti-text-ganesha";
import { extra as m_ganesha2 } from "./stuti-text-ganesha2";
import { extra as m_ganesha3 } from "./stuti-text-ganesha3";
import { extra as m_ganesha4 } from "./stuti-text-ganesha4";
import { extra as m_guru } from "./stuti-text-guru";
import { extra as m_guru2 } from "./stuti-text-guru2";
import { extra as m_subrahmanya } from "./stuti-text-subrahmanya";
import { extra as m_subrahmanya2 } from "./stuti-text-subrahmanya2";
import { extra as m_subrahmanya3 } from "./stuti-text-subrahmanya3";
import { extra as m_subrahmanya4 } from "./stuti-text-subrahmanya4";
import { extra as m_subrahmanya5 } from "./stuti-text-subrahmanya5";
import { extra as m_subrahmanya6 } from "./stuti-text-subrahmanya6";
import { extra as m_subrahmanya7 } from "./stuti-text-subrahmanya7";
import { extra as m_subrahmanya8 } from "./stuti-text-subrahmanya8";
import { extra as m_subrahmanya9 } from "./stuti-text-subrahmanya9";
import { extra as m_subrahmanya10 } from "./stuti-text-subrahmanya10";
import { extra as m_shiva } from "./stuti-text-shiva";
import { extra as m_shiva2 } from "./stuti-text-shiva2";
import { extra as m_shiva3 } from "./stuti-text-shiva3";
import { extra as m_devi } from "./stuti-text-devi";
import { extra as m_devi2 } from "./stuti-text-devi2";
import { extra as m_devi3 } from "./stuti-text-devi3";
import { extra as m_devi4 } from "./stuti-text-devi4";
import { extra as m_vishnu } from "./stuti-text-vishnu";
import { extra as m_vishnu2 } from "./stuti-text-vishnu2";
import { extra as m_hanuman } from "./stuti-text-hanuman";
import { extra as m_vinayaka_vidhi } from "./stuti-text-vinayaka-vidhi";
import { extra as m_tarpana_vidhi } from "./stuti-text-tarpana-vidhi";
import { extra as m_pitr } from "./stuti-text-pitr";

export const BODY_MODS: Array<{ key: string; heads: any[]; load: () => Promise<any> }> = [
  { key: "main", heads: STUTI_TEXTS, load: () => import("./stuti-body-main") },
  { key: "ganesha", heads: m_ganesha, load: () => import("./stuti-body-ganesha") },
  { key: "ganesha2", heads: m_ganesha2, load: () => import("./stuti-body-ganesha2") },
  { key: "ganesha3", heads: m_ganesha3, load: () => import("./stuti-body-ganesha3") },
  { key: "ganesha4", heads: m_ganesha4, load: () => import("./stuti-body-ganesha4") },
  { key: "guru", heads: m_guru, load: () => import("./stuti-body-guru") },
  { key: "guru2", heads: m_guru2, load: () => import("./stuti-body-guru2") },
  { key: "subrahmanya", heads: m_subrahmanya, load: () => import("./stuti-body-subrahmanya") },
  { key: "subrahmanya2", heads: m_subrahmanya2, load: () => import("./stuti-body-subrahmanya2") },
  { key: "subrahmanya3", heads: m_subrahmanya3, load: () => import("./stuti-body-subrahmanya3") },
  { key: "subrahmanya4", heads: m_subrahmanya4, load: () => import("./stuti-body-subrahmanya4") },
  { key: "subrahmanya5", heads: m_subrahmanya5, load: () => import("./stuti-body-subrahmanya5") },
  { key: "subrahmanya6", heads: m_subrahmanya6, load: () => import("./stuti-body-subrahmanya6") },
  { key: "subrahmanya7", heads: m_subrahmanya7, load: () => import("./stuti-body-subrahmanya7") },
  { key: "subrahmanya8", heads: m_subrahmanya8, load: () => import("./stuti-body-subrahmanya8") },
  { key: "subrahmanya9", heads: m_subrahmanya9, load: () => import("./stuti-body-subrahmanya9") },
  { key: "subrahmanya10", heads: m_subrahmanya10, load: () => import("./stuti-body-subrahmanya10") },
  { key: "shiva", heads: m_shiva, load: () => import("./stuti-body-shiva") },
  { key: "shiva2", heads: m_shiva2, load: () => import("./stuti-body-shiva2") },
  { key: "shiva3", heads: m_shiva3, load: () => import("./stuti-body-shiva3") },
  { key: "devi", heads: m_devi, load: () => import("./stuti-body-devi") },
  { key: "devi2", heads: m_devi2, load: () => import("./stuti-body-devi2") },
  { key: "devi3", heads: m_devi3, load: () => import("./stuti-body-devi3") },
  { key: "devi4", heads: m_devi4, load: () => import("./stuti-body-devi4") },
  { key: "vishnu", heads: m_vishnu, load: () => import("./stuti-body-vishnu") },
  { key: "vishnu2", heads: m_vishnu2, load: () => import("./stuti-body-vishnu2") },
  { key: "hanuman", heads: m_hanuman, load: () => import("./stuti-body-hanuman") },
  { key: "vinayaka-vidhi", heads: m_vinayaka_vidhi, load: () => import("./stuti-body-vinayaka-vidhi") },
  { key: "tarpana-vidhi", heads: m_tarpana_vidhi, load: () => import("./stuti-body-tarpana-vidhi") },
  { key: "pitr", heads: m_pitr, load: () => import("./stuti-body-pitr") },
];
