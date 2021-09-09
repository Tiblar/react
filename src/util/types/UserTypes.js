import PropTypes from "prop-types";

export let UserType = PropTypes.shape({
    id: PropTypes.string,
    banned: PropTypes.bool,
    boosted: PropTypes.bool,
    info: PropTypes.shape({
        avatar: PropTypes.string,
        biography: PropTypes.string,
        follower_count: 0,
        join_date: PropTypes.string,
        locale: PropTypes.string,
        location: PropTypes.string,
        nsfw: PropTypes.bool,
        status: PropTypes.string,
        username: PropTypes.string,
    }),
    roles: PropTypes.array,
});