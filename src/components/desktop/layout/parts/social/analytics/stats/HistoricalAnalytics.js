import React, {useEffect} from "react";
import ApexCharts from "apexcharts";

import layoutStyles from "../../../../../../../css/layout.css";

import {formatDate} from "../../../../../../../util/date";
import {useAnalyticsState} from "../context";

function HistoricalAnalytics(props) {

    const state = useAnalyticsState();

    function getSeries() {
        if(state.historicalChart === "POST"){
            return "posts views";
        }

        if(state.historicalChart === "PROFILE"){
            return "profile views";
        }

        if(state.historicalChart === "LIKES"){
            return "likes";
        }

        if(state.historicalChart === "FOLLOWERS"){
            return "followers";
        }
    }

    function getOptions(viewsData, timeData) {
        return {
            colors:['#7286e9', '#15de97', '#da133e', '#da4113'],
            chart: {
                type: 'area',
                toolbar: {
                    show: false,
                },
                width: '100%',
            },
            grid: {
                show: false,
            },
            dataLabels: {
                enabled: false,
            },
            series: [{
                name: getSeries(),
                data: viewsData,
            }],
            xaxis: {
                categories: timeData,
                labels: {
                    show: false,
                },
                title: {
                    text: 'Last 30 days',
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
            },
            fill: {
                type: 'gradient',
                gradient: {
                    opacityFrom: 0.91,
                    opacityTo: 0.1,
                }
            },
        }
    }

    useEffect(() => {
        let data = props.data.posts.map((el) => el.count);
        let time = props.data.posts.map((el) => formatDate(el.timestamp));
        switch(state.historicalChart) {
            case "POST":
                break;
            case "PROFILE":
                data = props.data.user.map((el) => el.count);
                time = props.data.user.map((el) => formatDate(el.timestamp));
                break;
            case "LIKES":
                data = props.data.favorites.map((el) => el.count);
                time = props.data.favorites.map((el) => formatDate(el.timestamp));
                break;
            case "FOLLOWERS":
                data = props.data.followers.map((el) => el.count);
                time = props.data.followers.map((el) => formatDate(el.timestamp));
                break;
        }

        const chart = new ApexCharts(document.querySelector("#historical-chart"), getOptions(
            data, time
        ));

        chart.render();

        return () => {
            chart.destroy();
        }
    }, [state.historicalChart, state.historicalStats]);

    return (
        <div className={layoutStyles.flex + ' ' + layoutStyles.flexGrow} style={{maxWidth: "100%"}}>
            <div className={layoutStyles.flexGrow}>
                <div id="historical-chart" />
            </div>
        </div>
    );
}

export default HistoricalAnalytics;
