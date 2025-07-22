export class URLPathParam {
  private basePath: string;
  private segments: string[];

  constructor(basePath: string = '') {
    this.basePath = basePath;
    this.segments = [];
  }
  
  append(value: string | number): URLPathParam {
    this.segments.push(value.toString());
    return this;
  }
  
  toString(): string {
    return this.basePath + '/' + this.segments.join('/');
  }

  // Optional: get segments array
  getSegments(): string[] {
    return [...this.segments];
  }

  // Optional: clear all segments
  clear(): URLPathParam {
    this.segments = [];
    return this;
  }
}