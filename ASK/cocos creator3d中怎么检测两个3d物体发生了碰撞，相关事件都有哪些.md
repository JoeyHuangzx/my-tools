在Cocos Creator 3D中，检测两个3D物体发生碰撞可以借助物理系统来实现。以下为你详细介绍具体的操作步骤以及相关的碰撞事件。

### 1. 配置物理系统
在使用碰撞检测之前，需要确保物理系统已经正确配置，并且为需要进行碰撞检测的物体添加合适的碰撞组件和刚体组件。

#### 步骤：
- **创建场景**：打开Cocos Creator 3D，创建一个新的场景或打开已有场景。
- **添加刚体组件**：选中需要参与碰撞检测的3D物体，在属性检查器中点击“添加组件”，选择“物理” -> “RigidBody”（刚体组件）。刚体组件使物体能够参与物理模拟。
- **添加碰撞组件**：同样在属性检查器中，点击“添加组件”，选择“物理” -> “BoxCollider”（盒子碰撞体）、“SphereCollider”（球体碰撞体）等合适的碰撞体组件。碰撞体组件定义了物体的碰撞形状。

### 2. 编写脚本检测碰撞
在Cocos Creator 3D中，可以通过编写脚本来监听碰撞事件。以下是一个示例脚本：
```typescript
import { _decorator, Component, ITriggerEvent, RigidBody, Collider } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CollisionDetection')
export class CollisionDetection extends Component {
    // 在节点激活时添加碰撞监听
    start() {
        const collider = this.node.getComponent(Collider);
        if (collider) {
            // 监听触发开始事件
            collider.on('onTriggerEnter', this.onTriggerEnter, this);
            // 监听触发持续事件
            collider.on('onTriggerStay', this.onTriggerStay, this);
            // 监听触发结束事件
            collider.on('onTriggerExit', this.onTriggerExit, this);

            // 监听碰撞开始事件
            collider.on('onCollisionEnter', this.onCollisionEnter, this);
            // 监听碰撞持续事件
            collider.on('onCollisionStay', this.onCollisionStay, this);
            // 监听碰撞结束事件
            collider.on('onCollisionExit', this.onCollisionExit, this);
        }
    }

    // 触发开始事件处理函数
    onTriggerEnter(event: ITriggerEvent) {
        console.log('Trigger Enter: ', event.otherCollider.node.name);
    }

    // 触发持续事件处理函数
    onTriggerStay(event: ITriggerEvent) {
        console.log('Trigger Stay: ', event.otherCollider.node.name);
    }

    // 触发结束事件处理函数
    onTriggerExit(event: ITriggerEvent) {
        console.log('Trigger Exit: ', event.otherCollider.node.name);
    }

    // 碰撞开始事件处理函数
    onCollisionEnter(event: any) {
        console.log('Collision Enter: ', event.otherCollider.node.name);
    }

    // 碰撞持续事件处理函数
    onCollisionStay(event: any) {
        console.log('Collision Stay: ', event.otherCollider.node.name);
    }

    // 碰撞结束事件处理函数
    onCollisionExit(event: any) {
        console.log('Collision Exit: ', event.otherCollider.node.name);
    }
}
```

### 3. 将脚本挂载到节点上
将上述脚本挂载到需要进行碰撞检测的3D物体节点上，这样该节点就能够监听并处理碰撞事件。

### 相关碰撞事件说明
- **触发事件（Trigger Events）**：
  - `onTriggerEnter`：当两个碰撞体开始重叠时触发，前提是至少有一个碰撞体的 `isTrigger` 属性设置为 `true`。
  - `onTriggerStay`：当两个碰撞体持续重叠时，每一帧都会触发该事件。
  - `onTriggerExit`：当两个碰撞体结束重叠时触发。

- **碰撞事件（Collision Events）**：
  - `onCollisionEnter`：当两个碰撞体开始接触时触发。
  - `onCollisionStay`：当两个碰撞体持续接触时，每一帧都会触发该事件。
  - `onCollisionExit`：当两个碰撞体结束接触时触发。

通过以上步骤和事件监听，你可以在Cocos Creator 3D中实现两个3D物体的碰撞检测。