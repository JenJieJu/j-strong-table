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

    #table {
        width: 100%;
    }
    </style>
</head>

<body>
    <div><button id="update">更新数据</button></div>
    <div id="table"></div>
    <script type="text/javascript" src="data.js"></script>
    <script type="text/javascript">
    (function() {

        var data = window.data;
        console.log(data);
        var table = new window.jTable('#table').setConfig({
            height: 500
        });

        table.setTitle([{
            label: '姓名',
            key: 'name',
            width: 100,
            fixed: true
        }, {
            label: '嵌套key.key',
            key: 'key.key',
            width: 100,
            fixed: true
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
        }])

        table.setData(data);


        table.render();

        console.log(table)


        document.getElementById('update').addEventListener('click', () => {
            var array = [].concat(data);
            array.sort(function() {
                return Math.random() > .5 ? -1 : 1;
            })
            table.setData(array);
            table.render();
        })

    })();
    </script>
</body>

</html>