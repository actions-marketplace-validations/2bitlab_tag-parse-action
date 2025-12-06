"use strict";
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable github/array-foreach */
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatTime = exports.getSyncBranch = exports.getTagUrl = exports.getPraseByTag = exports.getBranchByTag = exports.getBranchByHead = void 0;
const getBranchByHead = (ref) => {
    if (ref.includes("refs/heads/")) {
        return ref.replace("refs/heads/", "");
    }
    return "";
};
exports.getBranchByHead = getBranchByHead;
const getBranchByTag = (ref) => {
    if (ref.includes("refs/tags/release/")) {
        const commitMsg = ref.replace("refs/tags/", "");
        const index = commitMsg.lastIndexOf("-v");
        return commitMsg.slice(0, index);
    }
    return "";
};
exports.getBranchByTag = getBranchByTag;
const getPraseByTag = (ref) => {
    if (ref.includes("refs/tags/release/")) {
        const willString = ref.replace("refs/tags/release/", "");
        const arr = (willString || "").split("&");
        const obj = {};
        arr.forEach((item) => {
            const [key, value] = (item || "").split("=");
            if (value) {
                obj[key] = value;
            }
        });
        return obj;
    }
    return {};
};
exports.getPraseByTag = getPraseByTag;
const getTagUrl = (repository) => {
    return `https://api.github.com/repos/${repository}/releases`;
};
exports.getTagUrl = getTagUrl;
// release/dingding-dev-v0.1.3-2021-12-06
const getSyncBranch = (ref) => {
    if (ref.includes("refs/heads/")) {
        return ref.replace("refs/heads/", "");
    }
    if (ref.includes("refs/tags/release/")) {
        const commitMsg = ref.replace("refs/tags/", "");
        const index = commitMsg.lastIndexOf("-dev-v");
        return commitMsg.slice(0, index);
    }
    return "";
};
exports.getSyncBranch = getSyncBranch;
/**
 * 格式化时间
 *
 * @param  {time} 时间
 * @param  {cFormat} 格式
 * @return {String} 字符串
 *
 * @example formatTime('2018-1-29', '{y}/{m}/{d} {h}:{i}:{s}') // -> 2018/01/29 00:00:00
 */
const formatTime = (dateTime, cFormat) => {
    let time = dateTime;
    if (`${time}`.length === 10) {
        time = +time * 1000;
    }
    const format = cFormat || "{y}-{m}-{d} {h}:{i}:{s}";
    let date;
    if (typeof time === "object") {
        date = time;
    }
    else {
        date = new Date(time);
    }
    const formatObj = {
        y: date.getFullYear(),
        // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
        m: date.getMonth() + 1,
        d: date.getDate(),
        h: date.getHours(),
        i: date.getMinutes(),
        s: date.getSeconds(),
        a: date.getDay(),
    };
    const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
        let value = formatObj[key];
        if (key === "a")
            return ["一", "二", "三", "四", "五", "六", "日"][value - 1];
        if (result.length > 0 && value < 10) {
            value = `0${value}`;
        }
        return value || 0;
    });
    return time_str;
};
exports.formatTime = formatTime;
