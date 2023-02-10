import { BPMNProcess, BPMNTask } from '../../type';
import { Activity } from '../base';

export enum TaskType {
  Send = 'send',
  User = 'user',
  Manual = 'manual',
  Script = 'script',
  Receive = 'receive',
  Service = 'service',
  Business = 'business',
}

export class TaskActivity extends Activity {
  get taskType() {
    if (this.key?.toLowerCase()?.includes('send')) return TaskType.Send;
    if (this.key?.toLowerCase()?.includes('user')) return TaskType.User;
    if (this.key?.toLowerCase()?.includes('manual')) return TaskType.Manual;
    if (this.key?.toLowerCase()?.includes('script')) return TaskType.Script;
    if (this.key?.toLowerCase()?.includes('receive')) return TaskType.Receive;
    if (this.key?.toLowerCase()?.includes('service')) return TaskType.Service;
    if (this.key?.toLowerCase()?.includes('business')) return TaskType.Business;
  }

  constructor(process: BPMNProcess, data?: Partial<TaskActivity>, key?: string) {
    super(process, data, key);
  }

  static build(el: BPMNTask, process: BPMNProcess, key?: string) {
    return new TaskActivity(process, { ...el }, key);
  }
}
