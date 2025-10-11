import dayjs from "dayjs";
import UTC from "dayjs/plugin/utc";
import Timezone from "dayjs/plugin/timezone";
import { PluginLunar } from "dayjs-plugin-lunar";

dayjs.extend(UTC);
dayjs.extend(Timezone);
dayjs.extend(PluginLunar);
dayjs.tz.setDefault("Asia/Shanghai");

export { dayjs };
