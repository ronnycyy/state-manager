// 手写 recoil

import { useState, useEffect, useCallback } from 'react';

interface IDisconnect {
  disconnect: () => void;
}

class Stateful<T> {
  // 编译时自动 this.value = value;
  constructor(protected value: T) { }

  // 观察者集合
  // 集合里面全是函数
  // 外部不能访问，里面可以访问
  private listeners = new Set<(value: T) => void>();

  // 提供一个订阅函数, 返回的退订方法
  public subscribe(cb: (value: T) => void): IDisconnect {
    this.listeners.add(cb);   // 订阅上了
    return {
      disconnect: () => this.listeners.delete(cb)
    }
  }

  // 暴露给外部拿值  设置类库的常规手法
  public snapshot(): T {
    return this.value;
  }

  // 发布更新
  private emit() {
    console.log('[ 发布更新了！观察者们! ]', this.listeners);
    // Set 转 Array 方便遍历，常规操作。
    // for..of 获取数组每个值
    // 通知每一个观察者
    for (const cb of Array.from(this.listeners)) {
      // 可以拿 this.value, 也可以用暴露的接口
      cb(this.snapshot());
    }
  }

  // 改变状态，发布更新
  // 派生类能够访问
  protected update(value: T) {
    if (this.value !== value) {
      this.value = value;
      this.emit();
    }
  }
}

// 原子类  最小化的状态
class Atom<T> extends Stateful<T> {
  // 没写 constructor, 默认调用父类(Stateful)的 constructor。

  // 改变某个原子的状态，调用父类发布更新
  public setState(value: T) {
    super.update(value);
  }
}

// 创建一个原子状态
// 不知道 default 是啥，就让用户自己传。
export function atom<V>(value: { key: string; default: V }) {
  return new Atom(value.default);
}

// 返回状态
export function useRecoilValue<T>(value: Stateful<T>) {
  const [, setForceUpdate] = useState({});

  useEffect(() => {
    // 注册一个`强制更新视图`的观察者
    // 订阅状态，状态变化时，强制更新本组件，这样 React 会重新构建一棵 Fiber 树，对比过程就会发现 atom 状态变了。
    const unsubscription = value.subscribe(() => {
      setForceUpdate({});
    });
    // 在本组件中，状态使用完毕，退订。
    return () => unsubscription.disconnect();
  }, [value]);

  return value.snapshot();
}

// 返回: 订阅状态，修改状态
export function useRecoilState<T>(atom: Atom<T>) {
  const value = useRecoilValue(atom);
  // 返回一个函数: (v: T) => atom.setState(v), 在 atom 不变的情况下保持原来的引用。
  // 用户把新的值传进来，然后 atom.setState -> super.update -> super.emit() -> 遍历 listeners 执行每一个 cb 发布更新，cb 中有一个 setForceUpdate, 于是视图渲染。
  const setValue = useCallback((v: T) => atom.setState(v), [atom]);

  // 没加 as const 时, 返回类型是一个元组，里面元素可能是 T，也可能是 (v:T)=>void)。 Array<(T | (v:T)=>void)>
  // return [value, setValue];

  // 加了 as const 后, 返回一个固定的两个元素的元组，第一个元素是T，第二个元素是(v:T)=>void。
  // 把返回值限制成 readonly [T, (v:T) => void]，这就对了。
  return [value, setValue] as const;
}

// 无论 Selector 还是 Atom，都是一个状态。
// 注意`原子状态`和`衍生状态`的概念。
class Selector<T> extends Stateful<T> {
  // 仅观察 Atom, 没有实际值
  // generate 就是 value.get, 比如用户传入的 ({ get }) =>{ const text = get(textState); return text.length };
  constructor(private readonly generate: SelectorGenerator<T>) {
    super(undefined as any);
    // 实现get函数:  拿到 原子状态，注册衍生状态的监听器，返回原子状态。
    this.value = generate({ get: (dep: Atom<any>) => this.addSub(dep) });
  }

  private registeredDeps = new Set<Atom<any>>();

  private addSub(dep: Atom<any>) {
    if (!this.registeredDeps.has(dep)) {
      // 注册观察者，原子状态变化时，衍生状态随之更新。
      dep.subscribe(() => this.updateSelector());
    }
    // 得到原子状态
    return dep.snapshot();
  }

  // 业务逻辑的值发生变化
  private updateSelector() {
    // 更新衍生状态， setForceUpdate 是原子状态变了就会更新视图，所以总的流程是  原子状态变 -> 衍生状态变 -> forceUpdate -> 树对比，更新。
    this.update(
      // generate 是用户传入的，用来得到衍生状态，如 ({ get }) =>{ const text = get(textState); return text.length }; 得到 text.length。
      this.generate({ get: (dep: Atom<any>) => this.addSub(dep) })
    );
  }
}

// get 得到 atom(...) 返回的值，也就是一个 recoil state (Atom<T>)
// 反向推导: 不知道T是什么，根据传入的值来定 <T>(dep:...)。 然后把 get 的返回值也定义成 T。
// 返回的 V 从用户那儿得到，再推导回 selector的<V>。
type SelectorGenerator<V> = (context: { get: <T>(dep: Atom<T>) => T }) => V;

// 根据原子状态，衍生出新的值
// get 返回的类型 V，作为 selector 的返回类型。
export function selector<V>(value: {
  key: string;
  get: SelectorGenerator<V>;
}): Selector<V> {
  return new Selector(value.get);
}