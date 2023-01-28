export class Attribute {
  $!: { id: string; name?: string };

  get id(): string {
    return this.$.id;
  }

  get name(): string | undefined {
    return this.$.name;
  }

  constructor(data?: Partial<Attribute>) {
    if (data) Object.assign(this, data);
  }
}
