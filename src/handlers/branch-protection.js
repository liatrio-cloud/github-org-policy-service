module.exports = {
    events: [
        "repository.created",
        "branch_protection_rule.created",
        "branch_protection_rule.edited",
        "branch_protection_rule.deleted",
        "create",
    ],
    handler: ({ logger }) => async ({ octokit, payload }) => {
        if (payload.sender.type !== "Bot") {
            logger.info("Enabling branch protection");

            await octokit.request(
                "PUT /repos/{owner}/{repo}/branches/{branch}/protection",
                {
                    owner: payload.repository.owner.login,
                    repo: payload.repository.name,
                    branch: payload.repository.default_branch,
                    required_status_checks: {
                        contexts: [],
                        strict: true,
                    },
                    enforce_admins: true,
                    required_pull_request_reviews: {
                        dismiss_stale_reviews: true,
                        required_approving_review_count: 1,
                    },
                    required_linear_history: true,
                    allow_force_pushes: false,
                    allow_deletions: false,
                    required_conversation_resolution: true,
                    restrictions: null, // eslint-disable-line unicorn/no-null
                },
            );
        }
    },
};
