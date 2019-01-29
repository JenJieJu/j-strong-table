import Watcher from '@/watcher.js'
import checkbox from './checkbox.js'
import { isFunction } from '@/checkVariable.js'

export default class checkboxs {
    constructor(config = {}) {
        this.config = config;
        this.elements = [];
        this.checkAllElements = [];
        this.defaultChosen = config.defaultChosen || [];

        this.data = new Watcher({
            // elements: [],
            chosen: [],
            // checkAllElement: undefined,
            data: []
        }, (k, n, o) => {
            if (k == 'chosen') {
                this.doFilter();
            }
        })

        return this;
    }
    destroy() {
        console.log('destroy')
    }
    doFilter() {

        if (this.timer) {
            clearTimeout(this.timer);
        }

        this.timer = setTimeout(() => {
            this.data.data = Array.from(new Set([].concat(this.data.chosen, this.defaultChosen)));
            const onChange = this.config.onChange;
            if (isFunction(onChange)) {
                onChange.call(this, this.data.data);

                console.log(this.elements.map(i => i.data.name + '/' + i.checkbox.data.checked))
            }

        }, 0);

    }
    choose(data, isChoose, e) {

        this.sameElementCheck(data, isChoose)

        let { chosen } = this.data;
        let jsonData = JSON.stringify(data);

        if (isChoose) {

            chosen.push(data);

        } else {


            chosen = chosen.filter((d, i) => {
                return JSON.stringify(d) != jsonData
            })

            this.defaultChosen = this.defaultChosen.filter((d, i) => {
                return JSON.stringify(d) != jsonData
            })

        }


        let isAllChoose = true;

        this.elements.map(e => {
            if (!e.checkbox.data.checked) {
                isAllChoose = false;
            }
        })
        if (isAllChoose) {
            this.checkAllElements.map(e => {
                e.data.checked = true;
            })
        } else {
            this.checkAllElements.map(e => {
                e.data.checked = false;
            })
        }

        this.data.chosen = [].concat(chosen);

    }

    getSameElement(data) {
        let elements = [];
        this.elements.map(e => {
            if (JSON.stringify(e.data) == JSON.stringify(data)) {
                elements.push(e.checkbox);
            }
        })
        return elements
    }

    sameElementCheck(data, isChoose) {
        const elements = this.getSameElement(data);
        elements.map(e => {
            e.data.checked = true;
        })
    }

    chooseAllBoxCheck(isChoose) {

        let { chosen } = this.data;
        chosen = [];

        if (isChoose) {

            this.elements.map(i => {
                if (!i.checkbox.data.checked) {
                    i.checkbox.data.checked = true;
                }
                chosen.push(i.data);
            })

        } else {

            this.elements.map(i => {
                if (i.checkbox.data.checked) {
                    i.checkbox.data.checked = false;
                }

            })
        }

        this.data.chosen = [].concat(chosen);

    }

    push($dom, data = {}, isAll = false) {
        let self = this;
        if (isAll) {
            this.checkAllElements.push(new checkbox($dom, {
                onChange: function(isChoose) {
                    self.chooseAllBoxCheck(isChoose);
                }
            }));

        } else {

            function onChange(isChoose) {
                self.choose(this.config.data, this.data.checked, this);
            }

            const cb = new checkbox($dom, {
                data,
                onChange
            });

            const element = {
                $dom,
                data,
                checkbox: cb
            }

            this.elements.push(element);


        }


    }
}