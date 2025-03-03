
/**
 * 文件夹节点
 */
export class FolderNode {
  name: string;
  parent: FolderNode | null;
  children: FolderNode[];
  files: string[] = [];

  constructor(name: string) {
    this.name = name;
    this.children = [];
    this.parent = null;
  }

  /**
   * 添加子节点
   * @param child 
   */
  addChild(child: FolderNode) {
    this.children.push(child);
    child.parent = this;
  }

  /**
   * 添加文件
   * @param file
   * @returns
   * @memberof FolderNode
   */
  addFile(file: string) {
    this.files.push(file);  
  }

  
}