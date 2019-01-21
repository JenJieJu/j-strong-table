<!DOCTYPE html>
<html lang="en">

<head>
    <!-- 禁止 Chrome 浏览器中自动提示翻译 -->
    <meta name="google" value="notranslate">
    <!-- 禁止百度转码 -->
    <meta http-equiv="Cache-Control" content="no-siteapp">
    <!-- 取消缓存 -->
    <meta http-equiv="cache-control" content="max-age=0" />
    <meta http-equiv="cache-control" content="no-cache" />
    <meta http-equiv="expires" content="0" />
    <meta http-equiv="expires" content="Tue, 01 Jan 1980 1:00:00 GMT" />
    <meta http-equiv="pragma" content="no-cache" />
    <!-- 手机屏幕适配 -->
    <meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=no">
    <meta name="format-detection" content="telephone=no">
    <style type="text/css">
    html,
    body {
        width: 100%;
        padding: 0px;
        margin: 0px;
        /*text-align: center;*/
        font-size: 14px;
        height: 100%;
    }

    .box {
        /*width: 800px;*/
        margin: 0 auto;
    }

    #table {
        width: 100%;
    }

    #pagination {
        margin: 20px 0;
    }
    </style>
</head>

<body>
    <div class="box">
        <div id="table"></div>
        <div id="pagination"></div>
    </div>
    <script type="text/javascript" src="lib/j-simple-pagination/dist/index.js"></script>
    <script type="text/javascript" src="data.js"></script>
    <script type="text/javascript">
    (function() {

        var data = (() => {
                let array = [];
                for (var i = 0; i < 2; i++) {
                    let ary = [].concat(window.data);
                    ary.sort(function() {
                        return Math.random() > .5 ? -1 : 1;
                    })
                    array = array.concat(ary);
                }
                return array
            })(),
            pageSize = 6,
            pageIndex = 1;
        showCount = 4;



        function cutByLen(data, len) {
            let result = []
            for (var i = 0, length = data.length; i < length; i += len) {
                result.push(data.slice(i, i + len));
            }
            return result;
        }

        var pageDatas = cutByLen(data, pageSize);

        var table = new window.jTable('#table').setConfig({
            height: 500
        }).setTitle([{
            type: 'selection',
            width: 60,
            fixed: true,
        },{
            width: 60,
            fixed: true,
            render: function(data) {
                if (data.headPicFileName) {
                    return [{
                        html: '<div style="text-align:center;"><img src="' + data.headPicFileName + '" alt="" width="30" height="30" /></div>'
                    }]
                }
            }
        }, {
            label: '姓名',
            key: 'name',
            width: 100,
            fixed: true
        }, {
            label: '嵌套key.key',
            key: 'key.key',
            width: 100,
        }, {
            label: '医生 ID',
            key: 'userId',
            width: 100
        }, {
            label: '医疗机构',
            key: 'hospital',
            width: 100,
        }, {
            label: '医院 ID',
            key: 'hospitalId',
            width: 100
        }, {
            label: 'render',
            key: 'status',
            width: 100,
            render: function(data) {
                return [{
                    html: '<div style="font-size:20px;">div1</div>',
                    events: [{
                        type: 'click',
                        event: function() {
                            console.log(this)
                            alert('div1')
                        }
                    }]
                }, {
                    html: '<input type="text" />',
                    events: [{
                        type: 'keypress',
                        event: function() {
                            console.log(this)
                        }
                    }]
                }, {
                    html: '<div>div2</div>',
                    events: [{
                        type: 'mouseMove',
                        event: function() {
                            console.log(this)
                            alert('div2')
                        }
                    }],
                    child: [{
                        html: '<span style="color:red;">span1</span>',
                        events: [{
                            type: 'click',
                            event: function() {
                                console.log(this)
                                alert('span1')
                            }
                        }]
                    }, {
                        html: '<span style="color:green;">span2</span>',
                        events: [{
                            type: 'click',
                            event: function() {
                                console.log(this)
                                alert('span2')
                            }
                        }]
                    }]
                }]
            }
        }, {
            label: '科室',
            key: 'departments',
            width: 100
        }, {
            label: '职称',
            key: 'title',
            width: 100
        }, {
            label: '注册来源',
            key: 'source',
            width: 100,
        }, {
            label: '审核时间',
            key: 'limitedPeriodTime',
            width: 100,
            fixed: 'right'
        }]);


        function changePage(i) {
            var datas = pageDatas[i - 1];
            console.log(datas, pageDatas)
            table.setData(datas);
            table.render();
        };
        changePage(pageIndex)


        var Pagination = new window.jSimplePagination('#pagination', {
            pageSize: pageSize,
            dataTotal: data.length,
            pageIndex: pageIndex,
            showCount: showCount,
            onChange: function(data) {
                changePage(data.pageIndex);
            }
        });

    })();
    </script>
</body>

</html>