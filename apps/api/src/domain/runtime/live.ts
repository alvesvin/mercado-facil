import { Effect, ManagedRuntime } from "effect";
import type { State } from "@/types";
import { DBLiveLayer } from "../services/db";
import { RequestState } from "../services/request-state";

const appLayer = DBLiveLayer;

export const LiveRuntime = ManagedRuntime.make(appLayer);
