// js向下兼容
if (!global || !global._babelPolyfill) {
    require('babel-polyfill')
}

// import VConsole from 'vconsole'
// var vConsole = new VConsole();
// 

import './css.scss'
import { isArray, isFunction } from './checkVariable.js'
import { createElement, selectorElement, getDayDetail } from './tools.js'
import renderTreeHtml from './renderTreeHtml.js'

export default window.jTable = class jTable {
    /**
     * 表格构造器
     * @param  {string} selector elementId
     * @return {obj}          table实例
     */
    constructor(selector) {
        this.$dom = selectorElement(selector);
        // 数据
        this.data = [];
        this.titles = [];
        // 容器
        this.$container;
        this.height;
        // 中间表格
        this.$title;
        this.$body;
        this.bodyHeight = 0;
        this.bodyWidth = 0;
        // 左侧表格
        this.leftTitles = [];
        this.$leftTitle;
        this.$leftBody;
        this.leftTableWidth = 0;
        // 右侧表格
        this.rightTitles = [];
        this.$rightTitle;
        this.$rightBody;
        this.rightTableWidth = 0;

        return this
    }
    /**
     * 渲染函数
     * @return {obj} table实例
     */
    render() {

        if (this.$container) {
            this.$container.remove();
        }

        const container = this.$container = createElement('div');
        const center = createElement('div');
        const left = createElement('div');
        const right = createElement('div');


        container.className = 'j-table j-left';
        center.className = 'j-table-center';
        left.className = 'j-table-left';
        right.className = 'j-table-right';

        this.$container.style.height = this.height ? `${this.height}px` : '';

        this.$dom.appendChild(container);
        container.appendChild(center);
        container.appendChild(left);
        container.appendChild(right);



        let self = this;

        // 渲染中间表格
        this.$title = this.renderTitle(center);
        this.$title.addEventListener('mousewheel', function(e) {

            let scrollLeft = this.scrollLeft + e.deltaX;
            self.scroll('title', { x: scrollLeft })
            self.scroll('body', { x: scrollLeft })

        });

        this.$body = this.renderData(center);
        this.$body.addEventListener('scroll', function(e) {
            self.scroll('title', { x: this.scrollLeft })
            self.scroll('leftBody', { y: this.scrollTop })
            self.scroll('rightBody', { y: this.scrollTop })
        })

        // 渲染左侧表格
        this.$leftTitle = this.renderTitle(left);
        this.$leftBody = this.renderData(left)
        this.$leftBody.addEventListener('mousewheel', function(e) {

            let scrollTop = self.$body.scrollTop + e.deltaY;
            let scrollLeft = self.$body.scrollLeft + e.deltaX;
            self.scroll('leftBody', { y: scrollTop })
            self.scroll('rightBody', { y: scrollTop })
            self.scroll('title', { x: scrollLeft })
            self.scroll('body', { y: scrollTop, x: scrollLeft })

        });


        // 渲染右侧表格
        this.$rightTitle = this.renderTitle(right)
        this.$rightBody = this.renderData(right)
        this.$rightBody.addEventListener('mousewheel', function(e) {

            let scrollTop = self.$body.scrollTop + e.deltaY;
            let scrollLeft = self.$body.scrollLeft + e.deltaX;
            self.scroll('leftBody', { y: scrollTop })
            self.scroll('rightBody', { y: scrollTop })
            self.scroll('title', { x: scrollLeft })
            self.scroll('body', { y: scrollTop, x: scrollLeft })

        });


        this.setAdaptive(left, right);


    }

    /**
     * 自适应监听(窗口大小改变)
     * @param {dom} left  左侧表格dom
     * @param {dom} right 右侧表格dom
     */
    setAdaptive(left, right) {

        let timer, preWidth, self = this;

        function setTimer() {

            if (timer) {
                clearInterval(timer);
            }

            timer = setInterval(() => {
                let maxWidth = self.$container.clientWidth
                if (preWidth != maxWidth) {
                    preWidth = maxWidth;
                    setWidth(preWidth);
                }

            }, 10)
        };

        function setWidth(preWidth) {

            let { bodyWidth } = self;

            if (bodyWidth < preWidth) {

                left.style.width = `0px`;
                right.style.width = `0px`;
            } else {
                left.style.width = `${self.leftTableWidth}px`;
                right.style.width = `${self.rightTableWidth}px`;
            }

            bodyWidth = preWidth;


            self.$title.children[0].style.width = `${bodyWidth}px`;
            self.$body.children[0].style.width = `${bodyWidth}px`;
            self.$leftTitle.children[0].style.width = `${bodyWidth}px`;
            self.$leftBody.children[0].style.width = `${bodyWidth}px`;
            self.$rightTitle.children[0].style.width = `${bodyWidth}px`;
            self.$rightBody.children[0].style.width = `${bodyWidth}px`;
            self.scroll('rightTitle', { x: 999999999 })
            self.scroll('rightBody', { x: 999999999 })
        }


        setTimer()


    }

    /**
     * 设置表格参数
     * @param {number} options.height 表格高度
     */
    setConfig({ height }) {
        this.height = height;
        return this
    }

    /**
     * 设置表格body内容
     * @param {Array} data body内容
     */
    setData(data = []) {

        // data = mData;
        if (isArray(data) === false) {
            console.warn(data);
            return
        }
        this.data = data;
        return this;
    }
    /**
     * 设置表格标题内容
     * @param {Array} titles 标题内容
     */
    setTitle(titles = []) {
        if (isArray(titles) === false) {
            return
        }

        let leftTitles = [];
        let rightTitles = [];
        let centerTitles = [];
        let bodyWidth = 0;
        titles.map((d, i) => {
            bodyWidth += (d.width - 0);
            if (d.fixed == 'right') {
                this.rightTableWidth += d.width;
                rightTitles.push(d);

            } else if (d.fixed) {
                this.leftTableWidth += d.width;
                leftTitles.push(d);
            } else {
                centerTitles.push(d);
            }
        })


        this.bodyWidth = bodyWidth;
        this.leftTitles = leftTitles;
        this.rightTitles = rightTitles;
        this.titles = [].concat(leftTitles, centerTitles, rightTitles);
        return this;
    }

    /**
     * 渲染colgroup，用于固定每列宽度
     * @param  {[type]} dom [description]
     * @return {[type]}     [description]
     */
    renderColgroupToTarget(dom) {
        let colgroup = createElement('colgroup');
        this.titles.map(i => {
            let th = createElement('col');
            th.$data = i;
            th.innerHTML = `${i.label}`;
            th.width = `${i.width}`
            colgroup.appendChild(th);
            return th;
        })
        dom.appendChild(colgroup);
        return colgroup
    }

    /**
     * 滚动函数
     * @param  {sting} type      滚动类型
     * @param  {nmuber} options.x x轴滚动距离
     * @param  {number} options.y y轴滚动距离
     */
    scroll(type, { x, y }) {

        let key = {
            title: '$title',
            body: '$body',
            leftTitle: '$leftTitle',
            leftBody: '$leftBody',
            rightTitle: '$rightTitle',
            rightBody: '$rightBody',
        } [type];

        if (x !== undefined) {
            this[key].scrollLeft = x;

            // 滚动内容
            if (type === 'body' || type === 'title') {
                let className = this.$container.className.replace(' j-left', '').replace(' j-right', '');
                if (x <= 0) {
                    this.$container.className = `${className} j-left`;
                } else if (x >= this.bodyWidth - this.$body.clientWidth) {
                    this.$container.className = `${className} j-right`;
                } else {
                    this.$container.className = className
                }
            }


        }
        if (y !== undefined) {
            this[key].scrollTop = y;
        }
    }

    /**
     * 渲染标题栏
     * @param  {obj} dom       table实例
     * @param  {String} className 渲染的table样式
     * @return {dom}           table容器
     */
    renderTitle(dom, className = '') {
        let container = createElement('div');
        let table = createElement('table');
        let thead = createElement('thead');
        let tr = createElement('tr');

        container.className = 'j-table-title ' + className;
        table.cellSpacing = 0;
        table.cellPadding = 0;
        table.border = 0;

        let ths = this.titles.map(i => {
            let th = createElement('th');
            th.$data = i;
            th.innerHTML = `<div>${i.label}</div>`;

            tr.appendChild(th);
            return th;
        })

        this.renderColgroupToTarget(table);


        dom
            .appendChild(container)
            .appendChild(table)
            .appendChild(thead)
            .appendChild(tr);

        this.headerHeight = container.clientHeight;


        return container;
    }

    /**
     * 渲染body数据
     * @param  {String} className 渲染的table样式
     * @return {obj} table实例
     */
    renderData(dom, className = '') {
        let container = createElement('div');
        let table = createElement('table');
        let tbody = createElement('tbody');


        container.className = 'j-table-body ' + className;
        table.cellSpacing = 0;
        table.cellPadding = 0;
        table.border = 0;
        this.bodyHeight = this.height - this.headerHeight;
        container.style.height = this.bodyHeight ? `${this.bodyHeight}px` : '';

        let trs = this.data.map((d) => {
            let tr = createElement('tr');
            tr.$data = d;

            let tds = this.titles.map((t) => {

                let td = createElement('td');
                let value,
                    key = t.key,
                    keys = key.split('.'),
                    render = t.render,
                    contentDom;

                // 嵌套
                if (keys.length > 1) {
                    value = d;
                    keys.map(k => {
                        if (value !== undefined) {
                            value = value[k];
                        }
                    })
                } else {
                    value = d[key];
                }

                if (isFunction(render)) {
                    contentDom = render(d);
                    if (contentDom !== undefined) {
                        let div = createElement('div');
                        contentDom = renderTreeHtml(div, contentDom, d);
                        td.appendChild(div);
                    }
                } else {
                    td.innerHTML = `<div>${value === undefined ? '' : value}</div>`;
                }

                td.$data = d;
                tr.appendChild(td);
                return td;
            })
            tr.$tds = tds;
            tbody.appendChild(tr);
            return tr;
        })

        this.renderColgroupToTarget(table);

        dom
            .appendChild(container)
            .appendChild(table)
            .appendChild(tbody)

        return container;
    }
}