/* The Hindi and Telugu meanings that hang on the verses. Written by
   tools/codemod/fix-defer-bodies.mjs, in the order main.tsx used to import
   them in. Each module now only registers its attach function; stuti-bundled.ts
   runs them all again every time a body lands, because a meaning attached to a
   verse that is not there yet is a meaning lost in silence. */
import "./stuti-hindi-shiva";
import "./stuti-hindi-core";
import "./stuti-hindi-ganesha2";
import "./stuti-hindi-subrahmanya";
import "./stuti-hindi-ganesha";
import "./stuti-hindi-sahasra";
