import type { State } from "../../types";
import { Context } from "effect";

export class RequestState extends Context.Tag("RequestState")<
  RequestState,
  State["Variables"]
>() {}
