# j-strong-table

### <a href="//jenjieju.github.io/pc/">DEMO</a>

### Installing

```
    npm i j-strong-table --save
```


## Running the demo

```
    npm install
    npm run dev
```

## Enjoy it
```
<div><button id="update">更新数据</button></div>
<div id="table"></div>
<script type="text/javascript" src="data.js"></script>
<script type="text/javascript">
(function() {

var table = new window.jTable('#table').setConfig({
        // height: 500
    }).setTitle([{
        // type: 'selection',
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

    table.setData(data);


    table.render();

    console.log(table)

})();
</script>
```

## Updata
```
0.0.2 create
0.0.3 update
0.0.4 新增rander函数(支持自定义渲染元素，具体格式看例子)
0.0.5 add demo
0.0.6 update demo
0.0.7 update:demo
0.0.8 update:精简render函数
```
