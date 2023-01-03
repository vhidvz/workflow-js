import { HelloWorld } from '../src';

describe('test hello function', () => {
  it("should return 'Hello World...!'", () => {
    expect(HelloWorld()).toBe('Hello World...!');
  });
});
