// 说明：
// 本文件演示 async/await 与 generator 语法编译后的运行时实现（兼容 ES5）。
// 关键辅助：
// - _regenerator / _regeneratorDefine2：运行 Generator 的核心（regenerator-runtime 的精简形态）。
// - asyncGeneratorStep / _asyncToGenerator：将 generator 包装为返回 Promise 的函数，模拟 async/await。
// 下方 addasync、foo、fooES5 展示了语法糖的展开过程与等价关系。
"use strict";

// regenerator 运行时：驱动 Generator 的迭代执行，提供 w（调度器）与 m（标记生成器）
function _regenerator() {
  /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e,
    t,
    r = "function" == typeof Symbol ? Symbol : {},
    n = r.iterator || "@@iterator",
    o = r.toStringTag || "@@toStringTag";
  function i(r, n, o, i) {
    var c = n && n.prototype instanceof Generator ? n : Generator,
      u = Object.create(c.prototype);
    return (
      _regeneratorDefine2(
        u,
        "_invoke",
        (function (r, n, o) {
          var i,
            c,
            u,
            f = 0,
            p = o || [],
            y = !1,
            G = {
              p: 0,
              n: 0,
              v: e,
              a: d,
              f: d.bind(e, 4),
              d: function d(t, r) {
                return (i = t), (c = 0), (u = e), (G.n = r), a;
              },
            };
          function d(r, n) {
            for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) {
              var o,
                i = p[t],
                d = G.p,
                l = i[2];
              r > 3
                ? (o = l === n) &&
                  ((u = i[(c = i[4]) ? 5 : ((c = 3), 3)]), (i[4] = i[5] = e))
                : i[0] <= d &&
                  ((o = r < 2 && d < i[1])
                    ? ((c = 0), (G.v = n), (G.n = i[1]))
                    : d < l &&
                      (o = r < 3 || i[0] > n || n > l) &&
                      ((i[4] = r), (i[5] = n), (G.n = l), (c = 0)));
            }
            if (o || r > 1) return a;
            throw ((y = !0), n);
          }
          return function (o, p, l) {
            if (f > 1) throw TypeError("Generator is already running");
            for (
              y && 1 === p && d(p, l), c = p, u = l;
              (t = c < 2 ? e : u) || !y;

            ) {
              i ||
                (c
                  ? c < 3
                    ? (c > 1 && (G.n = -1), d(c, u))
                    : (G.n = u)
                  : (G.v = u));
              try {
                if (((f = 2), i)) {
                  if ((c || (o = "next"), (t = i[o]))) {
                    if (!(t = t.call(i, u)))
                      throw TypeError("iterator result is not an object");
                    if (!t.done) return t;
                    (u = t.value), c < 2 && (c = 0);
                  } else
                    1 === c && (t = i["return"]) && t.call(i),
                      c < 2 &&
                        ((u = TypeError(
                          "The iterator does not provide a '" + o + "' method"
                        )),
                        (c = 1));
                  i = e;
                } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break;
              } catch (t) {
                (i = e), (c = 1), (u = t);
              } finally {
                f = 1;
              }
            }
            return { value: t, done: y };
          };
        })(r, o, i),
        !0
      ),
      u
    );
  }
  var a = {};
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}
  t = Object.getPrototypeOf;
  var c = [][n]
      ? t(t([][n]()))
      : (_regeneratorDefine2((t = {}), n, function () {
          return this;
        }),
        t),
    u =
      (GeneratorFunctionPrototype.prototype =
      Generator.prototype =
        Object.create(c));
  function f(e) {
    return (
      Object.setPrototypeOf
        ? Object.setPrototypeOf(e, GeneratorFunctionPrototype)
        : ((e.__proto__ = GeneratorFunctionPrototype),
          _regeneratorDefine2(e, o, "GeneratorFunction")),
      (e.prototype = Object.create(u)),
      e
    );
  }
  return (
    (GeneratorFunction.prototype = GeneratorFunctionPrototype),
    _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype),
    _regeneratorDefine2(
      GeneratorFunctionPrototype,
      "constructor",
      GeneratorFunction
    ),
    (GeneratorFunction.displayName = "GeneratorFunction"),
    _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"),
    _regeneratorDefine2(u),
    _regeneratorDefine2(u, o, "Generator"),
    _regeneratorDefine2(u, n, function () {
      return this;
    }),
    _regeneratorDefine2(u, "toString", function () {
      return "[object Generator]";
    }),
    (_regenerator = function _regenerator() {
      return { w: i, m: f };
    })()
  );
}
// 在对象上定义运行时所需的属性/方法（next/throw/return 等）
function _regeneratorDefine2(e, r, n, t) {
  var i = Object.defineProperty;
  try {
    i({}, "", {});
  } catch (e) {
    i = 0;
  }
  (_regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) {
    function o(r, n) {
      _regeneratorDefine2(e, r, function (e) {
        return this._invoke(r, n, e);
      });
    }
    r
      ? i
        ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t })
        : (e[r] = n)
      : (o("next", 0), o("throw", 1), o("return", 2));
  }),
    _regeneratorDefine2(e, r, n, t);
}
// 推动 generator 前进一步；未完成则把中间值 Promise 化并继续 then
function asyncGeneratorStep(n, t, e, r, o, a, c) {
  try {
    var i = n[a](c),
      u = i.value;
  } catch (n) {
    return void e(n);
  }
  i.done ? t(u) : Promise.resolve(u).then(r, o);
}
// 将 generator 函数转换为返回 Promise 的函数（模拟 async/await 的语义）
function _asyncToGenerator(n) {
  return function () {
    var t = this,
      e = arguments;
    return new Promise(function (r, o) {
      var a = n.apply(t, e);
      function _next(n) {
        asyncGeneratorStep(a, r, o, _next, _throw, "next", n);
      }
      function _throw(n) {
        asyncGeneratorStep(a, r, o, _next, _throw, "throw", n);
      }
      _next(void 0);
    });
  };
}
function addasync() {
  return _addasync.apply(this, arguments);
}
function _addasync() {
  _addasync = _asyncToGenerator(
    /*#__PURE__*/ _regenerator().m(function _callee() {
      return _regenerator().w(function (_context) {
        while (1)
          switch (_context.n) {
            case 0:
              // await 一个 1 秒后 resolve(1) 的 Promise
              _context.n = 1;
              return new Promise(function (resolve) {
                setTimeout(function () {
                  resolve(1);
                }, 1000);
              });
            case 1:
              // 返回 2（演示：与上一步 await 的值无关，直接返回常量）
              return _context.a(2, 2);
          }
      }, _callee);
    })
  );
  return _addasync.apply(this, arguments);
}
addasync().then(function (res) {
  // 输出 2
  console.log(res);
});
var bar = function bar() {
  // 简单工厂：立刻返回值 5 的 Promise
  return new Promise(function (resolve) {
    return resolve(5);
  });
};
// 语法糖
function foo() {
  return _foo.apply(this, arguments);
}
function _foo() {
  _foo = _asyncToGenerator(
    /*#__PURE__*/ _regenerator().m(function _callee2() {
      var a;
      return _regenerator().w(function (_context2) {
        while (1)
          switch (_context2.n) {
            case 0:
              // await bar()，得到 a
              _context2.n = 1;
              return bar();
            case 1:
              a = _context2.v;
              // 返回 a + 1
              return _context2.a(2, a + 1);
          }
      }, _callee2);
    })
  );
  return _foo.apply(this, arguments);
}
function fooES5() {
  // 使用 then 链实现与 foo 相同的效果
  return new Promise(function (resolve, reject) {
    bar()
      .then(function (a) {
        resolve(a + 1);
      })
      ["catch"](reject);
  });
}
// 本质是语法糖 ，只是写法更优雅，更像同步代码那样好理解；
// 结论：async/await 编译后仍以 Promise 为基础，通过 generator + 运行时调度来模拟同步风格的异步流程。
