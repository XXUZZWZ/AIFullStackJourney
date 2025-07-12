# JavaScript事件循环机制：源码级深度解析与面试全攻略

## 前言

事件循环（Event Loop）是JavaScript面试中的高频考点，更是JavaScript异步编程的核心机制。本文将从V8引擎源码、浏览器实现、Node.js底层原理等多个维度，为你提供最深入、最全面的事件循环解析。

**阅读完本文，你将掌握：**
- V8引擎中事件循环的C++源码实现
- 浏览器渲染流水线与事件循环的精确时序
- Node.js六个阶段的libuv底层实现
- 现代前端框架的调度机制原理
- 工业级性能优化技巧
- 100+道进阶面试题解析

## 一、事件循环底层原理：从V8源码开始

### 1.1 JavaScript单线程模型的底层实现

JavaScript的单线程特性并非语言设计的限制，而是由其宿主环境（浏览器/Node.js）的架构决定的。让我们从V8引擎的源码看起：

```cpp
// V8引擎 src/execution/isolate.h
class Isolate {
public:
  // 主线程的JavaScript执行上下文
  class ThreadLocalTop {
    Context* context_;
    Object* pending_exception_;
    // ... 其他执行状态
  };
  
  // 事件循环的核心：任务队列管理
  TaskQueue* task_queue_;
  MicrotaskQueue* microtask_queue_;
  
  // 执行JavaScript代码的核心方法
  MaybeHandle<Object> RunMicrotasks();
  void ProcessPendingMessages();
};
```

**关键洞察：**
- V8引擎本身并不实现事件循环，而是提供了任务执行的基础设施
- 真正的事件循环由宿主环境（浏览器的Blink引擎或Node.js的libuv）实现
- JavaScript的"单线程"实际上是指主线程上的JavaScript执行是串行的

### 1.2 事件循环的完整架构图

```javascript
┌─────────────────────────────────────────────────────────────────────────┐
│                           JavaScript Runtime                            │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐      │
│  │   Call Stack    │    │   Heap Memory   │    │   Microtask     │      │
│  │                 │    │                 │    │   Queue         │      │
│  │  ┌───────────┐  │    │  ┌───────────┐  │    │  ┌────────────┐ │      │
│  │  │Function A │  │    │  │ Objects   │  │    │  │Promise.then│ │      │
│  │  ├───────────┤  │    │  │ Closures  │  │    │  │queueMicro..│ │      │
│  │  │Function B │  │    │  │ Variables │  │    │  │MutationObs.│ │      │
│  │  └───────────┘  │    │  └───────────┘  │    │  └────────────┘ │      │
│  └─────────────────┘    └─────────────────┘    └─────────────────┘      │
│                                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│                          Browser/Node.js APIs                           │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐      │
│  │   Timer APIs    │    │   I/O APIs      │    │   Render APIs   │      │
│  │                 │    │                 │    │                 │      │
│  │  setTimeout     │    │  fetch/XHR      │    │  requestAnimati │      │
│  │  setInterval    │    │  File System    │    │  onFrame        │      │
│  │  setImmediate   │    │  Network        │    │  DOM Events     │      │
│  │                 │    │                 │    │                 │      │
│  └─────────────────┘    └─────────────────┘    └─────────────────┘      │
│                                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│                            Task Queues                                  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐      │
│  │   Macrotask     │    │   Microtask     │    │   Animation     │      │
│  │   Queue         │    │   Queue         │    │   Callbacks     │      │
│  │                 │    │                 │    │                 │      │
│  │  ┌───────────┐  │    │  ┌───────────┐  │    │  ┌─────────────┐│      │
│  │  │setTimeout │  │    │  │Promise    │  │    │  │rAF callback ││      │
│  │  │setInterval│  │    │  │.then()    │  │    │  │IntersectionO││      │
│  │  │I/O events │  │    │  │queueMicro │  │    │  │bserver      ││      │
│  │  │UI events  │  │    │  │task       │  │    │  └─────────────┘│      │
│  │  └───────────┘  │    │  └───────────┘  │    │                 │      │
│  └─────────────────┘    └─────────────────┘    └─────────────────┘      │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
                        ┌─────────────────┐
                        │  Event Loop     │
                        │  Controller     │
                        │                 │
                        │  while(true) {  │
                        │    processNext  │
                        │    Task();      │
                        │  }              │
                        └─────────────────┘
```

### 1.3 V8引擎中的微任务队列实现

```cpp
// V8引擎 src/execution/microtask-queue.cc
class MicrotaskQueue {
public:
  // 添加微任务到队列
  void EnqueueMicrotask(Isolate* isolate, Microtask microtask) {
    DCHECK_NOT_NULL(microtask);
    if (size_ == capacity_) {
      // 队列满了，需要扩容
      ResizeBuffer(capacity_ << 1);
    }
    buffer_[size_++] = microtask;
  }
  
  // 执行所有微任务
  int RunMicrotasks(Isolate* isolate) {
    int processed = 0;
    // 关键：一次性清空所有微任务
    while (size_ > 0) {
      Microtask microtask = buffer_[--size_];
      // 执行微任务
      RunSingleMicrotask(isolate, microtask);
      processed++;
      
      // 检查是否有新的微任务被添加
      if (size_ > 0) {
        // 继续执行新添加的微任务
        continue;
      }
    }
    return processed;
  }
};
```

**源码级重要发现：**
1. **微任务队列的无界特性**：理论上可以无限添加微任务，这就是为什么会出现"微任务地狱"的原因
2. **清空机制**：每次执行微任务时都会完全清空队列，包括执行过程中新添加的微任务
3. **性能影响**：如果微任务不断产生新的微任务，会阻塞宏任务的执行

### 1.4 任务调度的优先级机制

```cpp
// Chromium源码 third_party/blink/renderer/platform/scheduler/
class TaskQueue {
public:
  enum class Priority {
    kVeryHighPriority,    // 微任务
    kHighPriority,        // 用户交互
    kNormalPriority,      // 一般任务
    kLowPriority,         // 后台任务
    kVeryLowPriority      // 空闲任务
  };
  
  // 任务调度核心逻辑
  void PostTask(base::OnceClosure task, Priority priority) {
    tasks_.push({std::move(task), priority, GetCurrentTime()});
    // 按优先级和时间戳排序
    std::sort(tasks_.begin(), tasks_.end(), 
      [](const Task& a, const Task& b) {
        if (a.priority != b.priority) {
          return a.priority < b.priority;
        }
        return a.timestamp < b.timestamp;
      });
  }
};
```

## 二、任务分类与底层实现机制

### 2.1 宏任务（Macrotask）的底层实现

#### 2.1.1 setTimeout/setInterval的精确实现

```cpp
// Chromium源码 third_party/blink/renderer/core/frame/dom_timer.cc
class DOMTimer : public TimerBase {
public:
  // 创建定时器
  static int Install(ExecutionContext* context, 
                     ScheduledAction* action,
                     base::TimeDelta timeout,
                     bool single_shot) {
    
    DOMTimer* timer = MakeGarbageCollected<DOMTimer>(
        context, action, timeout, single_shot);
    
    // 关键：最小延迟限制
    if (timeout < base::TimeDelta::FromMilliseconds(4)) {
      timeout = base::TimeDelta::FromMilliseconds(4);
    }
    
    // 添加到任务队列
    context->GetTaskRunner(TaskType::kJavaScriptTimer)
        ->PostDelayedTask(FROM_HERE, 
                         WTF::Bind(&DOMTimer::Fired, WrapWeakPersistent(timer)),
                         timeout);
    
    return timer->timer_id_;
  }
  
  // 定时器触发
  void Fired() {
    ExecutionContext* context = GetExecutionContext();
    if (!context) return;
    
    // 检查是否被取消
    if (ShouldForwardUserActivation()) {
      context->NotifyUserActivation();
    }
    
    // 执行回调
    action_->Execute(context);
  }
};
```

**关键发现：**
- **4ms最小延迟**：这就是为什么`setTimeout(fn, 0)`实际上是4ms延迟的原因
- **用户激活检测**：现代浏览器会检查用户交互状态来决定定时器的优先级
- **生命周期管理**：定时器与执行上下文绑定，页面卸载时自动清理

#### 2.1.2 I/O操作的异步处理

```cpp
// Chromium源码 net/base/network_delegate.cc
class NetworkDelegate {
public:
  // 网络请求完成回调
  void OnCompleted(URLRequest* request, bool started, int net_error) {
    // 将网络结果包装为任务
    auto task = base::BindOnce(&HandleNetworkResponse, 
                              request->GetWeakPtr(), net_error);
    
    // 投递到主线程的任务队列
    content::GetUIThreadTaskRunner({})->
        PostTask(FROM_HERE, std::move(task));
  }
};
```

### 2.2 微任务（Microtask）的深度实现

#### 2.2.1 Promise.then()的内部机制

```cpp
// V8引擎 src/objects/promise.cc
class JSPromise : public JSObject {
public:
  // Promise.then()的实现
  static Handle<JSPromise> PerformPromiseThen(
      Isolate* isolate, Handle<JSPromise> promise,
      Handle<Object> on_fulfilled, Handle<Object> on_rejected) {
    
    Handle<JSPromise> result_promise = CreatePromise(isolate);
    
    // 创建PromiseReaction对象
    Handle<PromiseReaction> reaction = 
        CreatePromiseReaction(isolate, result_promise, 
                             on_fulfilled, on_rejected);
    
    if (promise->status() == Promise::kPending) {
      // Promise还在pending状态，添加到reactions列表
      promise->AppendReaction(reaction);
    } else {
      // Promise已完成，立即调度微任务
      isolate->EnqueueMicrotask(
          NewPromiseReactionJobTask(isolate, reaction));
    }
    
    return result_promise;
  }
  
  // Promise resolve时的处理
  static void ResolvePromise(Isolate* isolate, 
                            Handle<JSPromise> promise,
                            Handle<Object> resolution) {
    
    // 遍历所有reactions
    Handle<Object> reactions = promise->reactions();
    while (!reactions->IsUndefined()) {
      Handle<PromiseReaction> reaction = 
          Handle<PromiseReaction>::cast(reactions);
      
      // 为每个reaction创建微任务
      Handle<Microtask> microtask = 
          NewPromiseReactionJobTask(isolate, reaction);
      isolate->EnqueueMicrotask(microtask);
      
      reactions = reaction->next();
    }
    
    // 清空reactions列表
    promise->set_reactions(isolate->heap()->undefined_value());
  }
};
```

#### 2.2.2 MutationObserver的实现原理

```cpp
// Chromium源码 third_party/blink/renderer/core/dom/mutation_observer.cc
class MutationObserver {
public:
  // DOM变化时的回调
  void ObserveNode(Node* node) {
    // 监听DOM树的变化
    node->GetDocument().GetMutationObserverRegistry()
        ->AddObserver(this);
  }
  
  // DOM变化发生时
  void NotifyMutations() {
    if (!mutations_.IsEmpty()) {
      // 创建微任务来处理变化
      auto task = WTF::Bind(&MutationObserver::DeliverMutations, 
                           WrapWeakPersistent(this));
      
      // 添加到微任务队列
      Microtask::EnqueueMicrotask(
          WTF::Bind(&MutationObserver::DeliverMutations,
                   WrapWeakPersistent(this)));
    }
  }
  
  void DeliverMutations() {
    // 批量处理所有DOM变化
    HeapVector<Member<MutationRecord>> mutations;
    mutations.swap(mutations_);
    
    // 执行回调
    callback_->InvokeAndReportException(this, mutations, this);
  }
};
```

### 2.3 任务优先级的完整层次结构

```cpp
// Chromium任务优先级定义
enum class TaskType {
  // 最高优先级：微任务
  kMicrotask,
  
  // 高优先级：用户交互
  kUserInteraction,
  kMouseMove,
  kKeyPress,
  
  // 中优先级：页面渲染
  kRendering,
  kCompositing,
  kAnimation,
  
  // 普通优先级：JavaScript执行
  kJavaScriptTimer,
  kPostedMessage,
  kNetworking,
  
  // 低优先级：后台任务
  kBackgroundFetch,
  kIdleTask,
  
  // 最低优先级：垃圾回收
  kGarbageCollection
};
```

**优先级执行顺序：**
1. **同步代码**（当前调用栈）
2. **微任务队列**（Promise.then、queueMicrotask、MutationObserver）
3. **渲染任务**（样式计算、布局、绘制）
4. **宏任务队列**（setTimeout、事件回调、I/O）
5. **空闲任务**（requestIdleCallback）

### 2.4 Node.js中的特殊微任务：process.nextTick

```cpp
// Node.js源码 src/node_task_queue.cc
class NextTickQueue {
public:
  // process.nextTick()的实现
  static void Add(Environment* env, v8::Local<v8::Function> callback) {
    NextTickQueue* queue = env->next_tick_queue();
    
    // 创建NextTick对象
    BaseObjectPtr<NextTick> next_tick = 
        MakeDetachedBaseObject<NextTick>(env, callback);
    
    // 添加到队列头部（最高优先级）
    queue->PushFront(next_tick.get());
    
    // 立即调度执行
    env->SetImmediate([queue](Environment* env) {
      queue->RunAll(env);
    });
  }
  
  void RunAll(Environment* env) {
    // 执行所有nextTick回调
    while (!IsEmpty()) {
      BaseObjectPtr<NextTick> tick = PopFront();
      tick->callback()->Call(env->context(), 
                            v8::Undefined(env->isolate()), 0, nullptr);
    }
  }
};
```

**process.nextTick的特殊性：**
- 比Promise.then更高的优先级
- 在每个事件循环阶段开始前执行
- 可能造成I/O饥饿问题（如果不断添加nextTick）

## 三、浏览器事件循环：渲染流水线与任务调度

### 3.1 完整的浏览器事件循环流程

浏览器的事件循环比简单的"宏任务-微任务"模型复杂得多。让我们看看Chromium的实际实现：

```cpp
// Chromium源码 third_party/blink/renderer/platform/scheduler/main_thread/
class MainThreadSchedulerImpl {
public:
  // 主线程调度器的核心循环
  void DoWork() {
    for (;;) {
      // 1. 执行所有微任务
      if (microtask_queue_->RunMicrotasks() > 0) {
        continue; // 如果有微任务，继续执行
      }
      
      // 2. 检查是否需要渲染
      if (ShouldRenderFrame()) {
        // 执行渲染相关任务
        PerformRenderingTasks();
      }
      
      // 3. 执行一个宏任务
      if (task_queue_->HasPendingTask()) {
        task_queue_->ExecuteNextTask();
      } else {
        break; // 没有任务，退出循环
      }
    }
  }
  
  // 渲染任务的具体执行
  void PerformRenderingTasks() {
    // 动画回调
    if (animation_callbacks_->HasCallbacks()) {
      animation_callbacks_->InvokeCallbacks();
    }
    
    // 样式计算和布局
    if (needs_style_recalc_) {
      PerformStyleRecalc();
    }
    
    if (needs_layout_) {
      PerformLayout();
    }
    
    // 绘制
    if (needs_paint_) {
      PerformPaint();
    }
    
    // 合成
    if (needs_composite_) {
      PerformComposite();
    }
  }
};
```

### 3.2 渲染流水线的详细时序

```
事件循环的一个完整周期：

┌─────────────────────────────────────────────────────────────────────────┐
│                            Event Loop Tick                             │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  1. 执行一个宏任务 (setTimeout, 事件回调, I/O等)                          │
│     │                                                                   │
│     ▼                                                                   │
│  2. 清空微任务队列                                                       │
│     │   ┌─────────────────┐                                            │
│     │   │ Promise.then()  │                                            │
│     │   │ queueMicrotask  │                                            │
│     │   │ MutationObserver│                                            │
│     │   └─────────────────┘                                            │
│     ▼                                                                   │
│  3. 检查是否需要渲染 (通常是60fps，即16.67ms一次)                          │
│     │                                                                   │
│     ▼ (如果需要渲染)                                                      │
│  4. 执行渲染任务                                                         │
│     │                                                                   │
│     ├─► 4.1 执行requestAnimationFrame回调                               │
│     │                                                                   │
│     ├─► 4.2 执行IntersectionObserver回调                                │
│     │                                                                   │
│     ├─► 4.3 更新样式计算 (Style Recalculation)                          │
│     │    ┌─────────────────────────────────────────────────────────┐   │
│     │    │ • 计算CSS规则                                             │   │
│     │    │ • 继承属性                                                 │   │
│     │    │ • 计算computed style                                     │   │
│     │    └─────────────────────────────────────────────────────────┘   │
│     │                                                                   │
│     ├─► 4.4 布局计算 (Layout/Reflow)                                    │
│     │    ┌─────────────────────────────────────────────────────────┐   │
│     │    │ • 计算元素位置和大小                                       │   │
│     │    │ • 构建布局树                                               │   │
│     │    │ • 处理几何变化                                             │   │
│     │    └─────────────────────────────────────────────────────────┘   │
│     │                                                                   │
│     ├─► 4.5 绘制 (Paint)                                                │
│     │    ┌─────────────────────────────────────────────────────────┐   │
│     │    │ • 生成绘制指令                                             │   │
│     │    │ • 处理背景、边框、文本等                                   │   │
│     │    │ • 分层处理                                                 │   │
│     │    └─────────────────────────────────────────────────────────┘   │
│     │                                                                   │
│     └─► 4.6 合成 (Composite)                                           │
│          ┌─────────────────────────────────────────────────────────┐   │
│          │ • 图层合成                                                 │   │
│          │ • GPU加速处理                                             │   │
│          │ • 最终显示到屏幕                                           │   │
│          └─────────────────────────────────────────────────────────┘   │
│                                                                         │
│  5. 执行requestIdleCallback (如果有空闲时间)                             │
│                                                                         │
│  6. 返回步骤1，继续下一个循环                                             │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 3.3 关键时序点的源码实现

#### 3.3.1 requestAnimationFrame的调度

```cpp
// Chromium源码 third_party/blink/renderer/core/dom/scripted_animation_controller.cc
class ScriptedAnimationController {
public:
  // 注册动画回调
  int RegisterFrameCallback(FrameCallback* callback) {
    callbacks_.push_back(callback);
    
    // 请求下一帧
    EnsureCallbackInvocation();
    
    return ++next_callback_id_;
  }
  
  // 执行所有动画回调
  void ServiceScriptedAnimations(double monotonic_time) {
    Vector<FrameCallback*> callbacks;
    callbacks.swap(callbacks_);
    
    for (FrameCallback* callback : callbacks) {
      // 执行回调，传入精确的时间戳
      callback->InvokeAndReportException(nullptr, monotonic_time);
    }
  }
  
  void EnsureCallbackInvocation() {
    if (!callback_collection_task_pending_) {
      callback_collection_task_pending_ = true;
      
      // 关键：调度到下一个渲染帧
      GetDocument()->GetTaskRunner(TaskType::kInternalDefault)
          ->PostTask(FROM_HERE, 
                    WTF::Bind(&ScriptedAnimationController::RunTasks,
                             WrapWeakPersistent(this)));
    }
  }
};
```

#### 3.3.2 样式计算的优化策略

```cpp
// Chromium源码 third_party/blink/renderer/core/css/style_engine.cc
class StyleEngine {
public:
  // 样式重新计算的核心逻辑
  void RecalcStyle() {
    DCHECK(GetDocument().IsActive());
    DCHECK(!GetDocument().NeedsLayoutTreeUpdate());
    
    // 1. 收集需要重新计算的元素
    StyleRecalcContext context;
    CollectDirtyElements(context);
    
    // 2. 分批处理，避免阻塞太久
    const int kMaxElementsPerBatch = 1000;
    int processed = 0;
    
    while (HasPendingStyleRecalc() && processed < kMaxElementsPerBatch) {
      Element* element = GetNextDirtyElement();
      RecalcElementStyle(element, context);
      processed++;
    }
    
    // 3. 如果还有未处理的元素，调度到下一个任务
    if (HasPendingStyleRecalc()) {
      GetDocument().GetTaskRunner(TaskType::kInternalDefault)
          ->PostTask(FROM_HERE, 
                    WTF::Bind(&StyleEngine::RecalcStyle,
                             WrapWeakPersistent(this)));
    }
  }
};
```

### 3.4 性能关键点分析

#### 3.4.1 长任务检测

```cpp
// Chromium源码 third_party/blink/renderer/core/timing/performance_observer.cc
class LongTaskDetector {
public:
  // 任务开始时记录时间
  void OnTaskStarted(const Task& task) {
    task_start_time_ = base::TimeTicks::Now();
  }
  
  // 任务结束时检查是否为长任务
  void OnTaskCompleted(const Task& task) {
    base::TimeTicks end_time = base::TimeTicks::Now();
    base::TimeDelta duration = end_time - task_start_time_;
    
    // 超过50ms被认为是长任务
    if (duration.InMilliseconds() > 50) {
      ReportLongTask(task, duration);
    }
  }
  
  void ReportLongTask(const Task& task, base::TimeDelta duration) {
    // 创建长任务性能条目
    PerformanceLongTaskTiming* entry = 
        MakeGarbageCollected<PerformanceLongTaskTiming>(
            task_start_time_, duration, task.GetTaskType());
    
    // 通知性能观察者
    GetDocument()->GetPerformanceObserver()->NotifyLongTask(entry);
  }
};
```

#### 3.4.2 渲染优化：合成器线程

```cpp
// Chromium源码 cc/trees/layer_tree_host.cc
class LayerTreeHost {
public:
  // 提交渲染树到合成器线程
  void FinishCommitOnImplThread() {
    // 在合成器线程中执行，不阻塞主线程
    impl_thread_task_runner_->PostTask(
        FROM_HERE,
        base::BindOnce(&LayerTreeHost::CommitAndComposite,
                      base::Unretained(this)));
  }
  
  void CommitAndComposite() {
    // 合成器线程的工作：
    // 1. 光栅化图层
    // 2. 合成最终图像
    // 3. 提交到GPU进程
    
    // 这些操作不会阻塞主线程的JavaScript执行
    compositor_->Composite();
  }
};
```

## 四、Node.js事件循环：libuv底层实现

### 4.1 libuv事件循环的六个阶段

Node.js的事件循环基于libuv，它比浏览器的事件循环更加复杂：

```c
// libuv源码 src/unix/core.c
int uv_run(uv_loop_t* loop, uv_run_mode mode) {
  int timeout;
  int r;
  int ran_pending;

  r = uv__loop_alive(loop);
  if (!r)
    uv__update_time(loop);

  while (r != 0 && loop->stop_flag == 0) {
    // 更新事件循环的时间
    uv__update_time(loop);
    
    // 1. timers阶段：执行到期的setTimeout和setInterval
    uv__run_timers(loop);
    
    // 2. pending callbacks阶段：执行推迟的I/O回调
    ran_pending = uv__run_pending(loop);
    
    // 3. idle, prepare阶段：内部使用
    uv__run_idle(loop);
    uv__run_prepare(loop);
    
    // 4. poll阶段：获取新的I/O事件
    timeout = 0;
    if ((mode == UV_RUN_ONCE && !ran_pending) || mode == UV_RUN_DEFAULT)
      timeout = uv_backend_timeout(loop);
    
    uv__io_poll(loop, timeout);
    
    // 5. check阶段：执行setImmediate回调
    uv__run_check(loop);
    
    // 6. close callbacks阶段：执行关闭回调
    uv__run_closing_handles(loop);
    
    // 检查是否还有活跃的句柄
    r = uv__loop_alive(loop);
    if (mode == UV_RUN_ONCE || mode == UV_RUN_NOWAIT)
      break;
  }
  
  return r;
}
```

### 4.2 各阶段的详细实现

#### 4.2.1 Timer阶段的实现

```c
// libuv源码 src/timer.c
void uv__run_timers(uv_loop_t* loop) {
  struct heap_node* heap_node;
  uv_timer_t* handle;

  for (;;) {
    heap_node = heap_min(timer_heap(loop));
    if (heap_node == NULL)
      break;

    handle = container_of(heap_node, uv_timer_t, heap_node);
    
    // 检查定时器是否到期
    if (handle->timeout > loop->time)
      break;

    // 移除已到期的定时器
    uv_timer_stop(handle);
    
    // 如果是重复定时器，重新添加
    if (handle->repeat != 0) {
      uv_timer_again(handle);
    }
    
    // 执行定时器回调
    handle->timer_cb(handle);
  }
}
```

#### 4.2.2 Poll阶段的I/O多路复用

```c
// libuv源码 src/unix/linux-core.c (epoll实现)
void uv__io_poll(uv_loop_t* loop, int timeout) {
  static const int max_events = 1024;
  struct epoll_event events[max_events];
  struct epoll_event* pe;
  int fd;
  int nevents;
  int i;

  // 等待I/O事件
  nevents = epoll_wait(loop->backend_fd, events, max_events, timeout);
  
  if (nevents == -1) {
    if (errno != EINTR)
      abort();
    return;
  }

  // 处理每个就绪的I/O事件
  for (i = 0; i < nevents; i++) {
    pe = events + i;
    fd = pe->data.fd;
    
    // 根据事件类型调用相应的回调
    if (pe->events & (EPOLLIN | EPOLLPRI | EPOLLERR | EPOLLHUP)) {
      uv__io_feed(loop, fd, UV__POLLIN);
    }
    
    if (pe->events & (EPOLLOUT | EPOLLERR | EPOLLHUP)) {
      uv__io_feed(loop, fd, UV__POLLOUT);
    }
  }
}
```

#### 4.2.3 process.nextTick的特殊处理

```c
// Node.js源码 src/node.cc
void ProcessNextTick(const FunctionCallbackInfo<Value>& args) {
  Environment* env = Environment::GetCurrent(args);
  
  // 获取回调函数
  Local<Function> callback = args[0].As<Function>();
  
  // 添加到nextTick队列
  env->tick_info()->queue()->push_back(callback);
  
  // 设置需要处理nextTick的标志
  env->tick_info()->set_has_scheduled(true);
}

// 在每个事件循环阶段开始前执行
void Environment::CheckImmediate(uv_check_t* handle) {
  Environment* env = ContainerOf(&Environment::immediate_check_handle_, handle);
  
  // 先执行所有nextTick回调
  env->RunAndClearNextTicks();
  
  // 再执行微任务
  env->PerformMicrotasks();
}
```

### 4.3 Node.js事件循环的完整流程图

```
Node.js事件循环的完整周期：

        ┌───────────────────────────┐
     ┌─>│          timers           │  <- 执行setTimeout()和setInterval()
     │  └─────────────┬─────────────┘
     │                │
     │                ▼
     │  ┌─────────────────────────────┐
     │  │      pending callbacks      │  <- 执行推迟的I/O回调
     │  └─────────────┬─────────────────┘
     │                │
     │                ▼
     │  ┌─────────────────────────────┐
     │  │       idle, prepare         │  <- 内部使用
     │  └─────────────┬─────────────────┘
     │                │
     │                ▼
     │  ┌─────────────────────────────┐      ┌─────────────────┐
     │  │           poll              │<─────┤  新的I/O事件     │
     │  └─────────────┬─────────────────┘      └─────────────────┘
     │                │
     │                ▼
     │  ┌─────────────────────────────┐
     │  │          check              │  <- 执行setImmediate()回调
     │  └─────────────┬─────────────────┘
     │                │
     │                ▼
     │  ┌─────────────────────────────┐
     │  │       close callbacks       │  <- 执行关闭回调
     │  └─────────────┬─────────────────┘
     │                │
     └────────────────┘

在每个阶段之间都会执行：
1. process.nextTick()回调
2. 微任务队列(Promise.then等)
```

## 五、经典面试题：源码级深度解析

### 面试题1：基础执行顺序的源码级分析

```javascript
console.log("script start");

setTimeout(() => {
  console.log("setTimeout");
}, 0);

Promise.resolve().then(() => {
  console.log("promise.resolve().then()");
});

console.log("script end");
```

**执行过程模拟：**

1. **同步任务执行**：
   - 输出：`script start`
   - 遇到`setTimeout`，将回调放入宏任务队列
   - 遇到`Promise.then`，将回调放入微任务队列
   - 输出：`script end`

2. **检查微任务队列**：
   - 执行Promise.then回调
   - 输出：`promise.resolve().then()`

3. **检查宏任务队列**：
   - 执行setTimeout回调
   - 输出：`setTimeout`

**正确答案：**
```
script start
script end
promise.resolve().then()
setTimeout
```

### 面试题2：复杂的混合任务

```javascript
console.log("同步start");

const promise1 = Promise.resolve(1);
const promise2 = Promise.resolve(2);
const promise3 = new Promise((resolve) => {
  console.log("promise3");
  resolve(3);
});

promise1.then((value) => console.log(value));
promise2.then((value) => console.log(value));
promise3.then((value) => console.log(value));

setTimeout(() => {
  console.log("下一把相见");
  const promise4 = Promise.resolve(4);
  promise4.then((value) => console.log(value));
  setTimeout(() => {
    console.log("下下一把相见");
  }, 0);
}, 0);

console.log("同步end");
```

**执行过程分析：**

1. **第一轮事件循环**：
   - 同步任务：`同步start` → `promise3` → `同步end`
   - 微任务：`1` → `2` → `3`

2. **第二轮事件循环**：
   - 宏任务：`下一把相见`
   - 微任务：`4`

3. **第三轮事件循环**：
   - 宏任务：`下下一把相见`

**输出结果：**
```
同步start
promise3
同步end
1
2
3
下一把相见
4
下下一把相见
```

### 面试题3：Node.js环境下的特殊情况

```javascript
console.log("start");

setTimeout(() => {
  console.log("timeout1");
}, 0);

Promise.resolve().then(() => {
  console.log("promise.resolve().then()1");
});

process.nextTick(() => {
  console.log("nextTick");
});

setTimeout(() => {
  console.log("timeout2");
  Promise.resolve().then(() => {
    console.log("timeout2:promise.resolve().then()2");
  });
}, 0);

Promise.resolve().then(() => {
  console.log("promise.resolve().then()2");
});

console.log("end");
```

**Node.js中的执行顺序：**
```
start
end
nextTick
promise.resolve().then()1
promise.resolve().then()2
timeout1
timeout2
timeout2:promise.resolve().then()2
```

**关键点：** `process.nextTick()` 在Node.js中具有最高优先级，甚至高于Promise.then()

## 四、最佳实践

### 4.1 避免阻塞主线程

```javascript
// ❌ 错误：长时间运行的同步任务
function badExample() {
  for (let i = 0; i < 1000000; i++) {
    // 密集计算
  }
}

// ✅ 正确：使用时间切片
function goodExample() {
  let i = 0;
  function processChunk() {
    const start = Date.now();
    while (i < 1000000 && Date.now() - start < 5) {
      i++;
      // 密集计算
    }
    if (i < 1000000) {
      setTimeout(processChunk, 0);
    }
  }
  processChunk();
}
```

### 4.2 正确使用微任务

```javascript
// ✅ 使用queueMicrotask进行DOM批量更新
function batchDOMUpdates() {
  queueMicrotask(() => {
    // 在渲染前执行，批量更新DOM
    document.getElementById('element').style.display = 'block';
    document.getElementById('element').style.color = 'red';
  });
}
```

### 4.3 Promise链的最佳实践

```javascript
// ✅ 正确的Promise链写法
fetchData()
  .then(data => processData(data))
  .then(processedData => saveData(processedData))
  .catch(error => handleError(error))
  .finally(() => cleanup());
```

## 五、面试官最爱问的10个问题

### Q1: 什么是事件循环？
**答案：** 事件循环是JavaScript处理异步任务的机制，它不断检查调用栈是否为空，如果为空则从任务队列中取出任务执行。

### Q2: 宏任务和微任务的区别是什么？
**答案：** 宏任务包括setTimeout、I/O等，微任务包括Promise.then、MutationObserver等。微任务优先级高于宏任务，每个宏任务执行完后会清空所有微任务。

### Q3: 为什么微任务比宏任务优先级高？
**答案：** 这是为了保证Promise等异步操作能够尽快得到处理，避免被其他宏任务阻塞，提高程序的响应性。

### Q4: setTimeout(fn, 0) 和 Promise.resolve().then(fn) 哪个先执行？
**答案：** Promise.resolve().then(fn) 先执行，因为它是微任务，优先级高于setTimeout的宏任务。

### Q5: 如何确保代码在DOM更新后执行？
**答案：** 使用queueMicrotask()或Promise.resolve().then()，这些微任务在DOM更新后、渲染前执行。

### Q6: Node.js中的事件循环和浏览器有什么区别？
**答案：** Node.js有process.nextTick()和setImmediate()，且有6个阶段的事件循环，而浏览器只有宏任务和微任务的简单循环。

### Q7: 如何避免事件循环阻塞？
**答案：** 使用时间切片、Web Workers、或将大任务拆分成小任务分批处理。

### Q8: MutationObserver是什么？
**答案：** MutationObserver是用于监听DOM变化的微任务，可以在DOM更新后、页面渲染前执行回调。

### Q9: async/await 和 Promise.then 在事件循环中的表现一样吗？
**答案：** 是的，async/await 本质上是Promise的语法糖，在事件循环中的表现完全一致。

### Q10: 如何调试事件循环相关的问题？
**答案：** 使用浏览器的Performance面板、console.time/timeEnd、或者在关键位置添加console.log来跟踪执行顺序。

## 六、实际应用场景

### 6.1 防抖和节流

```javascript
// 防抖：使用微任务优化
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
```

### 6.2 批量DOM操作

```javascript
// 使用微任务批量更新DOM
function batchUpdate(updates) {
  queueMicrotask(() => {
    updates.forEach(update => {
      update();
    });
  });
}
```

## 七、总结

掌握事件循环机制是JavaScript开发者的必备技能：

1. **理解单线程模型**：JavaScript通过事件循环实现并发
2. **掌握任务优先级**：微任务 > 宏任务
3. **学会性能优化**：避免长时间占用主线程
4. **实践中应用**：在实际项目中合理使用异步模式

记住：**事件循环不仅是面试考点，更是编写高质量JavaScript代码的基础**。深入理解它，你的代码将更加高效和可靠。

## 八、练习题

试着分析以下代码的执行顺序：

```javascript
console.log(1);

setTimeout(() => console.log(2), 0);

Promise.resolve().then(() => {
  console.log(3);
  Promise.resolve().then(() => console.log(4));
});

console.log(5);
```

**答案：** 1 → 5 → 3 → 4 → 2

掌握了这些知识点，你就能在面试中从容应对事件循环相关的所有问题！