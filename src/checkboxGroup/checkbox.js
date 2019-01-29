import renderTreeHtml from '@/renderTreeHtml.js'
import './checkbox.scss'
import { createElementFromHTML, watch } from '@/tools.js'
import Watcher from '@/watcher.js'
import { isFunction } from '@/checkVariable.js'

export default class checkbox {
    constructor(dom, config) {
        this.$dom = dom;
        this.config = config;
        this.initData();
        this.render(this.$dom);

    }
    initData() {
        const { onChange } = this.config || {};

        this.data = new Watcher({
            checked: false,
        }, (key, n, o) => {
            this.render(this.$dom);
            if (key == 'checked' && n != o) {
                isFunction(onChange) && onChange.call(this, n, o);
            }
        });
    }
    render(dom) {

        if (this.$container) {
            this.$container.remove();
        }

        const $container = this.$container = createElementFromHTML(`<span></span>`);

        const self = this;
        renderTreeHtml($container, [{
            html: `<label class="j-checkbox" ${this.data.checked?'checked':''}></label>`,
            child: [{
                html: `<span class="j-checkbo-box"><span></span></span>`
            }, {
                html: `<input type="checkbox" ${this.data.checked?'checked':''}/>`,
                events: [{
                    type: 'change',
                    event() {
                        self.data.checked = this.$dom.checked;
                    }
                }]
            }]
        }], this.data);

        dom.appendChild(this.$container);
    }
}