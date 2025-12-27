/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as admin from "../admin.js";
import type * as auth from "../auth.js";
import type * as concierge from "../concierge.js";
import type * as constants from "../constants.js";
import type * as measurementLabels from "../measurementLabels.js";
import type * as measurements from "../measurements.js";
import type * as orders from "../orders.js";
import type * as portal from "../portal.js";
import type * as profiles from "../profiles.js";
import type * as session from "../session.js";
import type * as utils from "../utils.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  admin: typeof admin;
  auth: typeof auth;
  concierge: typeof concierge;
  constants: typeof constants;
  measurementLabels: typeof measurementLabels;
  measurements: typeof measurements;
  orders: typeof orders;
  portal: typeof portal;
  profiles: typeof profiles;
  session: typeof session;
  utils: typeof utils;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
