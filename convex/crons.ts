import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.monthly(
  "delete any old files marked for deletion",
  { hourUTC: 17, // (9:30am Pacific/10:30am Daylight Savings Pacific)
  minuteUTC: 30,
  day: 1,},
  internal.files.deleteAllFiles
);

export default crons;