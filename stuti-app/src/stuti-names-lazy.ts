/* The sahasranāma registries and the Hindi for their thousand names. Written by
   tools/codemod/fix-defer-bodies.mjs. Imported only by stuti-bundled.ts, and
   only once a body is wanted, so none of it is read at launch. */
import { installNames } from "./stuti-names";
import { vishnu } from "./stuti-names-vishnu";
import { lalita } from "./stuti-names-lalita";
import { ganesha } from "./stuti-names-ganesha";
import "./stuti-hindi-names-vishnu";
import "./stuti-hindi-names-lalita";

installNames({ vishnu, lalita, ganesha });
