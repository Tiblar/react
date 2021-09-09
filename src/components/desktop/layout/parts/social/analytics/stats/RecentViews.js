// @flow

import React, {useEffect, useState} from "react";
import PropTypes from "prop-types";
import ApexCharts from "apexcharts";

import layoutStyles from "../../../../../../../css/layout.css";
import formStyles from "../../../../../../../css/form.css";

import LitePost from "../../post/LitePost";
import CircleLoading from "../../../../../../../assets/loading/infinite.svg";

import {formatDate} from "../../../../../../../util/date";

function RecentViews(props) {

    const [manager, setManager] = useState({
        post: false,
        profile: false,
        sources: false,
    });

    function getOptions(viewsData, timeData, type) {
        return {
            colors:['#7286e9', '#15de97', '#da133e', '#da4113'],
            chart: {
                type: 'bar',
                toolbar: {
                    show: false,
                },
                events: {
                    mounted: () => {
                        setManager(manager => ({
                            ...manager,
                            [type]: true,
                        }));
                    },
                }
            },
            grid: {
                show: false,
            },
            dataLabels: {
                enabled: false,
            },
            series: [{
                name: 'views',
                data: viewsData,
            }],
            xaxis: {
                categories: timeData,
                labels: {
                    show: false,
                },
                title: {
                    text: 'Last 48h',
                    offsetY: -15,
                    style: {
                        fontWeight: 100,
                    },
                },
                axisTicks: {
                    show: false,
                },
                tooltip: {
                    enabled: false,
                }
            }
        }
    }

    useEffect(() => {
        const postChart = new ApexCharts(document.querySelector("#recent-post-views"), getOptions(
            props.data.recent_views.posts.map((el) => el.count),
            props.data.recent_views.posts.map((el) => formatDate(el.timestamp)),
            'post'
        ));

        postChart.render();

        const profileChart = new ApexCharts(document.querySelector("#recent-profile-views"), getOptions(
            props.data.recent_views.profile.map((el) => el.count),
            props.data.recent_views.profile.map((el) => formatDate(el.timestamp)),
            'profile'
        ));
        profileChart.render();

        const sourcesChart = new ApexCharts(document.querySelector("#recent-view-sources"), {
            colors:['#7286e9', '#15de97', '#da133e', '#ef9f14', '#15dad0', '#a17fe3'],
            chart: {
                type: 'donut',
                toolbar: {
                    show: false,
                },
                events: {
                    mounted: () => {
                        setManager(manager => ({
                            ...manager,
                            sources: true,
                        }));
                    },
                }
            },
            grid: {
                show: false,
            },
            dataLabels: {
                enabled: false,
            },
            series: props.data.sources.map(s => s.count),
            labels: props.data.sources.map(s => s.source.toLowerCase()),
            plotOptions: {
                donut: {
                    labels: {
                        show: false,
                    },
                    total: {
                        show: false,
                    },
                },
            },
        });
        sourcesChart.render();
    }, []);

    return (
        <div>
            <div>
                <h4>Post views (48h)</h4>
                <hr className={layoutStyles.mB1} />
                <div id="recent-post-views" />
                {
                    (!manager.post && props.data.recent_views.length !== 0) &&
                    <CircleLoading width="25%" />
                }
            </div>
            <div>
                <h4>Profile views (48h)</h4>
                <hr className={layoutStyles.mB1} />
                <div id="recent-profile-views" />
                {
                    (!manager.profile && props.data.recent_views.length !== 0) &&
                    <CircleLoading width="25%" />
                }
            </div>
            <div>
                <h4>View sources (48h)</h4>
                <hr className={layoutStyles.mB1} />
                {
                    props.data.sources.length > 0 &&
                    <div id="recent-view-sources" />
                }
                {
                    props.data.sources.length === 0 &&
                    <div className={formStyles.alert + ' ' + layoutStyles.mB1}>
                        No data.
                    </div>
                }
                {
                    (!manager.sources && props.data.sources.length !== 0) &&
                    <CircleLoading width="25%" />
                }
            </div>
            <div>
                <h4>Top posts (48h)</h4>
                <hr className={layoutStyles.mB1} />
                {
                    props.data.top_posts.map(post => <LitePost key={post.id} post={post} />)
                }
                {
                    props.data.top_posts.length === 0 &&
                    <div className={formStyles.alert + ' ' + layoutStyles.mB1}>
                        No posts.
                    </div>
                }
            </div>
        </div>
    );
}

RecentViews.propTypes = {
    data: PropTypes.object,
}

export default RecentViews;