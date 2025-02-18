```typescript
import { instantiate, Node } from 'cc';

export class ObjectPoolManager {
    private static _instance: ObjectPoolManager;
    // 存储不同类型对象的对象池
    private objectPools: { [key: string]: Node[] } = {};

    private constructor() { }

    // 单例模式获取对象池管理类实例
    public static getInstance(): ObjectPoolManager {
        if (!this._instance) {
            this._instance = new ObjectPoolManager();
        }
        return this._instance;
    }

    /**
     * 从对象池中获取一个对象
     * @param prefabName 预制体名称，作为对象池的标识
     * @param prefab 预制体节点
     * @returns 对象节点
     */
    public getObject(prefabName: string, prefab: Node): Node {
        let pool = this.objectPools[prefabName];
        if (!pool) {
            pool = [];
            this.objectPools[prefabName] = pool;
        }

        if (pool.length > 0) {
            // 如果对象池中有可用对象，取出一个并激活
            const node = pool.pop()!;
            node.active = true;
            return node;
        } else {
            // 如果对象池为空，实例化一个新对象
            return instantiate(prefab);
        }
    }

    /**
     * 将对象放回对象池
     * @param prefabName 预制体名称，作为对象池的标识
     * @param node 对象节点
     */
    public releaseObject(prefabName: string, node: Node) {
        let pool = this.objectPools[prefabName];
        if (!pool) {
            pool = [];
            this.objectPools[prefabName] = pool;
        }
        // 禁用对象并放入对象池
        node.active = false;
        pool.push(node);
    }

    /**
     * 清空指定类型的对象池
     * @param prefabName 预制体名称，作为对象池的标识
     */
    public clearPool(prefabName: string) {
        const pool = this.objectPools[prefabName];
        if (pool) {
            // 销毁对象池中的所有对象
            for (const node of pool) {
                node.destroy();
            }
            delete this.objectPools[prefabName];
        }
    }

    /**
     * 清空所有对象池
     */
    public clearAllPools() {
        for (const prefabName in this.objectPools) {
            this.clearPool(prefabName);
        }
    }
}


```

### 使用示例

```typescript
import { _decorator, Component, Node, Prefab } from 'cc';
import { ObjectPoolManager } from './ObjectPoolManager';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {
    @property(Prefab)
    soldierPrefab: Prefab | null = null;

    start() {
        const objectPoolManager = ObjectPoolManager.getInstance();
        const prefabName = 'Soldier';

        // 从对象池获取士兵对象
        const soldier1 = objectPoolManager.getObject(prefabName, this.soldierPrefab!.data);
        this.node.addChild(soldier1);

        // 模拟一段时间后将士兵对象放回对象池
        setTimeout(() => {
            objectPoolManager.releaseObject(prefabName, soldier1);
        }, 5000);
    }
}


```

### 代码说明
1. **ObjectPoolManager 类**：
    - `objectPools`：一个对象，用于存储不同类型对象的对象池，键为预制体名称，值为节点数组。
    - `getInstance`：单例模式获取对象池管理类的实例。
    - `getObject`：从对象池中获取一个对象，如果对象池为空，则实例化一个新对象。
    - `releaseObject`：将对象放回对象池，并禁用该对象。
    - `clearPool`：清空指定类型的对象池，并销毁其中的所有对象。
    - `clearAllPools`：清空所有对象池。

2. **GameManager 类**：
    - 在 `start` 方法中，从对象池获取一个士兵对象，并将其添加到当前节点下。
    - 使用 `setTimeout` 模拟一段时间后将士兵对象放回对象池。

通过使用对象池管理类，可以有效减少频繁创建和销毁士兵对象带来的性能开销。