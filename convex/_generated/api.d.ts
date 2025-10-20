/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as admin from "../admin.js";
import type * as auth from "../auth.js";
import type * as concierge from "../concierge.js";
import type * as constants from "../constants.js";
import type * as measurements from "../measurements.js";
import type * as orders from "../orders.js";
import type * as portal from "../portal.js";
import type * as profiles from "../profiles.js";
import type * as session from "../session.js";
import type * as utils from "../utils.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  admin: typeof admin;
  auth: typeof auth;
  concierge: typeof concierge;
  constants: typeof constants;
  measurements: typeof measurements;
  orders: typeof orders;
  portal: typeof portal;
  profiles: typeof profiles;
  session: typeof session;
  utils: typeof utils;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
