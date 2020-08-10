const core = require("@actions/core");
const github = require("@actions/github");

async function run() {
    try {
        const tokenRegex = new RegExp("%branch%", "g");

        const inputs = {
            token: core.getInput("repo-token", {required: true}),
            branchRegex: core.getInput("branch-regex", {required: true}),
        }

        const branchName = github.context.payload.pull_request.head.ref;
        const branch = inputs.lowercaseBranch ? branchName.toLowerCase() : branchName;

        const matches = branch.match(new RegExp(inputs.branchRegex));
        if (!matches) {
            core.setFailed("Branch name does not match given regex");
            return;
        }

        const request = {
            owner: github.context.repo.owner,
            repo: github.context.repo.repo,
            pull_number: github.context.payload.pull_request.number,
        }

        const title = github.context.payload.pull_request.title || "";

        if (!title.match(new RegExp("PROJQUAY-[0-9]+ - "))) {
            core.error("Title does not prefixed with PROJQUAY jira")
        }
    } catch (error) {
        core.error(error);
        core.setFailed(error.message);
    }
}

run()
