"mix":{
    "type": "mix",
    "canvasId": "",
    "canvas2d": true,
    "background": "none",
    "animation": true,
    "timing": "easeOut",
    "duration": 1000,
    "color": [
        "#1890FF",
        "#91CB74",
        "#FAC858",
        "#EE6666",
        "#73C0DE",
        "#3CA272",
        "#FC8452",
        "#9A60B4",
        "#ea7ccc"
    ],
    "padding": [
        15,
        15,
        0,
        15
    ],
    "rotate": false,
    "errorReload": true,
    "fontSize": 13,
    "fontColor": "#666666",
    "enableScroll": false,
    "touchMoveLimit": 60,
    "enableMarkLine": false,
    "dataLabel": true,
    "dataPointShape": true,
    "dataPointShapeType": "solid",
    "xAxis": {
        "disabled": false,
        "axisLine": true,
        "axisLineColor": "#CCCCCC",
        "calibration": false,
        "fontColor": "#666666",
        "fontSize": 13,
        "rotateLabel": false,
        "itemCount": 5,
        "boundaryGap": "center",
        "disableGrid": true,
        "gridColor": "#CCCCCC",
        "gridType": "solid",
        "dashLength": 4,
        "gridEval": 1,
        "scrollShow": false,
        "scrollAlign": "left",
        "scrollColor": "#A6A6A6",
        "scrollBackgroundColor": "#EFEBEF"
    },
    "yAxis": {
        "disabled": false,
        "disableGrid": false,
        "splitNumber": 5,
        "gridType": "dash",
        "dashLength": 4,
        "gridColor": "#CCCCCC",
        "padding": 10,
        "showTitle": true,
        "data": [
            {
                "position": "left",
                "title": "折线"
            },
            {
                "position": "right",
                "min": 0,
                "max": 200,
                "title": "柱状图",
                "textAlign": "left"
            },
            {
                "position": "right",
                "min": 0,
                "max": 200,
                "title": "点",
                "textAlign": "left"
            }
        ]
    },
    "legend": {
        "show": true,
        "position": "bottom",
        "float": "center",
        "padding": 5,
        "margin": 5,
        "backgroundColor": "rgba(0,0,0,0)",
        "borderColor": "rgba(0,0,0,0)",
        "borderWidth": 0,
        "fontSize": 13,
        "fontColor": "#666666",
        "lineHeight": 11,
        "hiddenColor": "#CECECE",
        "itemGap": 10
    },
    "extra": {
        "mix": {
            "column": {
                "width": 20,
                "seriesGap": 2,
                "barBorderCircle": false,
                "linearType": "none",
                "linearOpacity": 1,
                "colorStop": 0
            }
        },
        "tooltip": {
            "showBox": true,
            "showArrow": true,
            "showCategory": false,
            "borderWidth": 0,
            "borderRadius": 0,
            "borderColor": "#000000",
            "borderOpacity": 0.7,
            "bgColor": "#000000",
            "bgOpacity": 0.7,
            "gridType": "solid",
            "dashLength": 4,
            "gridColor": "#CCCCCC",
            "fontColor": "#FFFFFF",
            "splitLine": true,
            "horizentalLine": false,
            "xAxisLabel": false,
            "yAxisLabel": false,
            "labelBgColor": "#FFFFFF",
            "labelBgOpacity": 0.7,
            "labelFontColor": "#666666"
        },
        "markLine": {
            "type": "solid",
            "dashLength": 4,
            "data": []
        }
    }
}