import { isArray, isString, isFunction } from './checkVariable.js'
import { createElementFromHTML } from './tools.js'

/**
 * 递归渲染元素
 * @param  {[type]} dom          [description]
 * @param  {Array}  contentArray [description]
 */
export default function depth(dom, contentArray = [], data) {

    if (isArray(contentArray)) {
        contentArray.map((config) => {

            const { html, child = [], click = Function, events = [], attrs = [], onRendered } = config;

            if (isString(html) && html) {
                let d = createElementFromHTML(html);
                let _on = {};

                attrs.map(({ key, value }) => {
                    if (isString(key) && isString(value)) {
                        d.setAttribute(key, value)
                    }
                })

                events.map(({ type, event }) => {
                    if (isString(type) && isFunction(event)) {
                        d.addEventListener(type, (e) => {
                            event.apply({
                                _on,
                                config,
                                data,
                                $event: e,
                                $dom: d,
                                isThisTrigger: e.target === d
                            });
                        });
                    }
                });

                _on.nodeReplace = function(contentArray = []) {
                    let parent = this.$dom.parentNode;
                    parent.innerHTML = '';
                    depth(parent, contentArray, this.data);

                }.bind({
                    data,
                    $dom: d,
                });


                dom.appendChild(d);


                if (isFunction(onRendered)) {
                    onRendered.apply({
                        _on,
                        config,
                        data,
                        $dom: d,
                    })
                }


                depth(d, child, data);
            }
        })

    }

    return dom;
}