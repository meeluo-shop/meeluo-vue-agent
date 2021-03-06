"use strict";
function _toConsumableArray(t) {
  if (Array.isArray(t)) {
    for (var e = 0, n = Array(t.length); e < t.length; e++) n[e] = t[e];
    return n;
  }
  return Array.from(t);
}
var _extends =
  Object.assign ||
  function (t) {
    for (var e = 1; e < arguments.length; e++) {
      var n = arguments[e];
      for (var o in n)
        Object.prototype.hasOwnProperty.call(n, o) && (t[o] = n[o]);
    }
    return t;
  };
function t(t, e, n) {
  return void 0 == n ? t : ((t = null == t ? {} : t), (t[e] = n), t);
}
export function Draggable(e) {
  function n(t) {
    t.parentElement.removeChild(t);
  }
  function o(t, e, n) {
    var o = 0 === n ? t.children[0] : t.children[n - 1].nextSibling;
    t.insertBefore(e, o);
  }
  function i(t, e) {
    return t
      .map(function (t) {
        return t.elm;
      })
      .indexOf(e);
  }
  function r(t, e, n) {
    if (!t) return [];
    var o = t.map(function (t) {
        return t.elm;
      }),
      i = [].concat(_toConsumableArray(e)).map(function (t) {
        return o.indexOf(t);
      });
    return n
      ? i.filter(function (t) {
          return t !== -1;
        })
      : i;
  }
  function s(t, e) {
    var n = this;
    this.$nextTick(function () {
      return n.$emit(t.toLowerCase(), e);
    });
  }
  function a(t) {
    var e = this;
    return function (n) {
      null !== e.realList && e["onDrag" + t](n), s.call(e, t, n);
    };
  }
  var u = ["Start", "Add", "Remove", "Update", "End"],
    l = ["Choose", "Sort", "Filter", "Clone"],
    d = ["Move"].concat(u, l).map(function (t) {
      return "on" + t;
    }),
    c = null,
    f = {
      options: Object,
      list: { type: Array, required: !1, default: null },
      value: { type: Array, required: !1, default: null },
      noTransitionOnDrag: { type: Boolean, default: !1 },
      clone: {
        type: Function,
        default: function (t) {
          return t;
        },
      },
      element: { type: String, default: "div" },
      move: { type: Function, default: null },
      componentData: { type: Object, required: !1, default: null },
    },
    h = {
      name: "draggable",
      props: f,
      data: function () {
        return {
          transitionMode: !1,
          noneFunctionalComponentMode: !1,
          init: !1,
        };
      },
      render: function (e) {
        var n = this.$slots["default"];
        if (n && 1 === n.length) {
          var o = n[0];
          o.componentOptions &&
            "transition-group" === o.componentOptions.tag &&
            (this.transitionMode = !0);
        }
        var i = 0,
          r = n,
          s = this.$slots,
          a = s.header,
          u = s.footer;
        a &&
          ((i = a.length),
          (r = r
            ? [].concat(_toConsumableArray(a), _toConsumableArray(r))
            : [].concat(_toConsumableArray(a)))),
          u &&
            (r = r
              ? [].concat(_toConsumableArray(r), _toConsumableArray(u))
              : [].concat(_toConsumableArray(u))),
          (this.headerOffset = i);
        var l = null,
          d = function (e, n) {
            l = t(l, e, n);
          };
        if ((d("attrs", this.$attrs), this.componentData)) {
          var c = this.componentData,
            f = c.on,
            h = c.props;
          d("on", f), d("props", h);
        }
        return e(this.element, l, r);
      },
      mounted: function () {
        var t = this;
        if (
          ((this.noneFunctionalComponentMode =
            this.element.toLowerCase() !== this.$el.nodeName.toLowerCase()),
          this.noneFunctionalComponentMode && this.transitionMode)
        )
          throw new Error(
            "Transition-group inside component is not supported. Please alter element value or remove transition-group. Current element value: " +
              this.element
          );
        var n = {};
        u.forEach(function (e) {
          n["on" + e] = a.call(t, e);
        }),
          l.forEach(function (e) {
            n["on" + e] = s.bind(t, e);
          });
        var o = _extends({}, this.options, n, {
          onMove: function (e, n) {
            return t.onDragMove(e, n);
          },
        });
        !("draggable" in o) && (o.draggable = ">*"),
          (this._sortable = new e(this.rootContainer, o)),
          this.computeIndexes();
      },
      beforeDestroy: function () {
        void 0 !== this._sortable && this._sortable.destroy();
      },
      computed: {
        rootContainer: function () {
          return this.transitionMode ? this.$el.children[0] : this.$el;
        },
        isCloning: function () {
          return (
            !!this.options &&
            !!this.options.group &&
            "clone" === this.options.group.pull
          );
        },
        realList: function () {
          return this.list ? this.list : this.value;
        },
      },
      watch: {
        options: {
          handler: function (t) {
            for (var e in t)
              d.indexOf(e) == -1 && this._sortable.option(e, t[e]);
          },
          deep: !0,
        },
        realList: function () {
          this.computeIndexes();
        },
      },
      methods: {
        getChildrenNodes: function () {
          if (
            (this.init ||
              ((this.noneFunctionalComponentMode =
                this.noneFunctionalComponentMode && 1 == this.$children.length),
              (this.init = !0)),
            this.noneFunctionalComponentMode)
          )
            return this.$children[0].$slots["default"];
          var t = this.$slots["default"];
          return this.transitionMode ? t[0].child.$slots["default"] : t;
        },
        computeIndexes: function () {
          var t = this;
          this.$nextTick(function () {
            t.visibleIndexes = r(
              t.getChildrenNodes(),
              t.rootContainer.children,
              t.transitionMode
            );
          });
        },
        getUnderlyingVm: function (t) {
          var e = i(this.getChildrenNodes() || [], t);
          if (e === -1) return null;
          var n = this.realList[e];
          return { index: e, element: n };
        },
        getUnderlyingPotencialDraggableComponent: function (t) {
          var e = t.__vue__;
          return e &&
            e.$options &&
            "transition-group" === e.$options._componentTag
            ? e.$parent
            : e;
        },
        emitChanges: function (t) {
          var e = this;
          this.$nextTick(function () {
            e.$emit("change", t);
          });
        },
        alterList: function (t) {
          if (this.list) t(this.list);
          else {
            var e = [].concat(_toConsumableArray(this.value));
            t(e), this.$emit("input", e);
          }
        },
        spliceList: function m() {
          var t = arguments,
            m = function (e) {
              return e.splice.apply(e, t);
            };
          this.alterList(m);
        },
        updatePosition: function p(t, e) {
          var p = function (n) {
            return n.splice(e, 0, n.splice(t, 1)[0]);
          };
          this.alterList(p);
        },
        getRelatedContextFromMoveEvent: function (t) {
          var e = t.to,
            n = t.related,
            o = this.getUnderlyingPotencialDraggableComponent(e);
          if (!o) return { component: o };
          var i = o.realList,
            r = { list: i, component: o };
          if (e !== n && i && o.getUnderlyingVm) {
            var s = o.getUnderlyingVm(n);
            if (s) return _extends(s, r);
          }
          return r;
        },
        getVmIndex: function (t) {
          var e = this.visibleIndexes,
            n = e.length;
          return t > n - 1 ? n : e[t];
        },
        getComponent: function () {
          return this.$slots["default"][0].componentInstance;
        },
        resetTransitionData: function (t) {
          if (this.noTransitionOnDrag && this.transitionMode) {
            var e = this.getChildrenNodes();
            e[t].data = null;
            var n = this.getComponent();
            (n.children = []), (n.kept = void 0);
          }
        },
        onDragStart: function (t) {
          (this.context = this.getUnderlyingVm(t.item)),
            (t.item._underlying_vm_ = this.clone(this.context.element)),
            (c = t.item);
        },
        onDragAdd: function (t) {
          this.updateEvenemt(t);
          var e = t.item._underlying_vm_;
          if (void 0 !== e) {
            n(t.item);
            var o = this.getVmIndex(t.newIndex);
            this.spliceList(o, 0, e), this.computeIndexes();
            var i = { element: e, newIndex: o };
            this.emitChanges({ added: i });
          }
        },
        onDragRemove: function (t) {
          if (
            (this.updateEvenemt(t),
            o(this.rootContainer, t.item, t.oldIndex),
            this.isCloning)
          )
            return void n(t.clone);
          var e = this.context.index;
          this.spliceList(e, 1);
          var i = { element: this.context.element, oldIndex: e };
          this.resetTransitionData(e), this.emitChanges({ removed: i });
        },
        onDragUpdate: function (t) {
          this.updateEvenemt(t), n(t.item), o(t.from, t.item, t.oldIndex);
          var e = this.context.index,
            i = this.getVmIndex(t.newIndex);
          this.updatePosition(e, i);
          var r = { element: this.context.element, oldIndex: e, newIndex: i };
          this.emitChanges({ moved: r });
        },
        updateEvenemt: function (t) {
          this.updateProperty(t, "newIndex"),
            this.updateProperty(t, "oldIndex");
        },
        updateProperty: function (t, e) {
          t.hasOwnProperty(e) && (t[e] += this.headerOffset);
        },
        computeFutureIndex: function (t, e) {
          if (!t.element) return 0;
          var n = []
              .concat(_toConsumableArray(e.to.children))
              .filter(function (t) {
                return "none" !== t.style.display;
              }),
            o = n.indexOf(e.related),
            i = t.component.getVmIndex(o),
            r = n.indexOf(c) != -1;
          return r || !e.willInsertAfter ? i : i + 1;
        },
        onDragMove: function (t, e) {
          var n = this.move;
          if (!n || !this.realList) return !0;
          var o = this.getRelatedContextFromMoveEvent(t),
            i = this.context,
            r = this.computeFutureIndex(o, t);
          return (
            _extends(i, { futureIndex: r }),
            _extends(t, { relatedContext: o, draggedContext: i }),
            n(t, e)
          );
        },
        onDragEnd: function (t) {
          this.computeIndexes(), (c = null);
        },
      },
    };
  return h;
}
