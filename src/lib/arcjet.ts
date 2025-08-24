import arcjet, {
  detectBot,
  shield,
  fixedWindow,
  protectSignup,
  sensitiveInfo,
  slidingWindow,
} from "@arcjet/next";
import { env } from "./env";

export {
  detectBot,
  fixedWindow,
  protectSignup,
  sensitiveInfo,
  shield,
  slidingWindow,
};
export default arcjet({
  key: env.ARCJET_KEY,
  characteristics: ["fingerprint"],
  // define base rule here ,can also be empty if you dont want to have any
  rules: [shield({ mode: "LIVE" })],
});
