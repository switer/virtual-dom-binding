! function() {
    'use strict;'
    var h = virtualDom.h
    var diff = virtualDom.diff
    var patch = virtualDom.patch
    var createElement = virtualDom.create
    function Component(options) {
        return function(props) {
            this.state = new Mux({
                props: options.data,
                computed: options.computed
            })
            this.render = options.render
            // initial render
            var tree = this.render()
            var rootNode = createElement(tree)
            document.body.appendChild(rootNode)

            var ctx = this
            this.state.$watch(function (nextProps, preProps) {
                var newTree = ctx.render()
                var patches = diff(tree, newTree);
                rootNode = patch(rootNode, patches)
                tree = newTree
            })
            if (props) this.state.$set(options)
        }
    }

    var Clazz = Component({
        data: function() {
            return {
                count: 100
            }
        },
        computed: {},
        render: function() {
            return h('div', {
                style: {
                    textAlign: 'center',
                    lineHeight: (100 + this.state.count) + 'px',
                    border: '1px solid red',
                    width: (100 + this.state.count) + 'px',
                    height: (100 + this.state.count) + 'px'
                }
            }, [String(this.state.count)])
        }
    })
    var vc = new Clazz()
    setInterval(function () {
        if (vc.state.count > 1000) return
        vc.state.count += 10
    }, 500)
}();
