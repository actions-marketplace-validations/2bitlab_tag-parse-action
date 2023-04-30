/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */

import * as core from "@actions/core";
import * as github from "@actions/github";
import {
  formatTime,
  getBranchByHead,
  getBranchByTag,
  getSyncBranch,
  getTagUrl,
} from "./utils";

import axios from "axios";
// debug is only output if you set the secret `ACTIONS_STEP_DEBUG` to true
const ref = github.context.ref;
const pushPayload: any = github.context.payload;

console.log("github-----", github);
console.log("github.context", github.context);

async function run(): Promise<void> {
  try {
    const topRepository: string = core.getInput("repository");
    const githubToken: string = core.getInput("githubToken");
    const type: string = core.getInput("type");
    const runCommond: string = core.getInput("runCommond");

    console.log("topRepository:", topRepository);
    console.log("type:", type);
    console.log("runCommond:", runCommond);

    if (type === "stringify") {
      const branch = getBranchByHead(ref) || getBranchByTag(ref);
      const { repository, pusher } = pushPayload || {};
      const { full_name } = repository || {};
      const { name: pusherName } = pusher || {};
      const [, outRepository] = full_name.split("/");
      const syncBranch = getSyncBranch(ref);

      const tagUrl = getTagUrl(topRepository || full_name);
      const timesTamp = formatTime(new Date(), "{yy}-{mm}-{dd}-{h}-{i}-{s}");

      const tagName = `${outRepository}/${syncBranch}/${timesTamp}/${runCommond}`;
      // `release/${timesTamp}&branch=${branch}&syncBranch=${syncBranch}&repository=${outRepository}`
      const tagMessage = {
        branch,
        syncBranch,
        repository: outRepository,
        pusherName,
        runCommond,
      };
      console.log("tagName: ", tagName);
      const ret = await axios({
        method: "POST",
        headers: {
          Accept: "application/vnd.github.v3+json",
          "content-type": "application/json",
          Authorization: `Bearer ${githubToken}`,
        },
        url: tagUrl,
        data: {
          tag_name: tagName,
          body: JSON.stringify(tagMessage),
        },
      });
      console.log("ret------: ", ret.data);
    }
    if (type === "parse") {
      const { release } = pushPayload || {};
      const { body } = release || {};
      const tagInfo: any = JSON.parse(body);
      console.log("tagInfo: ", tagInfo);
      const {
        branch: tagBranch,
        syncBranch: tagSyncBranch,
        repository: tagRepository,
        pusherName,
        runCommond,
      } = tagInfo || {};
      console.log("branch: ", tagSyncBranch);
      console.log("syncBranch----", tagBranch);
      console.log("repository----", tagRepository);
      console.log("pusherName----", pusherName);
      console.log("runCommond----", runCommond);

      core.exportVariable("BRANCH", tagBranch);
      core.exportVariable("syncBranch", tagSyncBranch);
      core.exportVariable("REPOSITORY", tagRepository);
      core.exportVariable("runCommond", runCommond);
    }
  } catch (error) {
    const e: any = error;
    core.setFailed(e.message);
  }
}
run();