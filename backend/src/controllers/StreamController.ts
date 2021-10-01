import { MessageService, StreamService } from "@backend/services";
import { INewStream, INewStreamResponse } from "@warpy/lib";

function handles(event: string) {
  return function (
    target: any,
    _propertyKey: any,
    descriptor: PropertyDescriptor
  ) {
    console.log("ok", descriptor);
    if (!descriptor.value) {
      throw new Error("no");
    }

    MessageService.on(event, descriptor.value);
  };
}

function Controller(domain: string) {
  return (constructor: any) => {
    constructor.prototype.domain = domain;
    const controller = new constructor();

    return controller;
  };
}

@Controller("stream")
export class StreamController {
  @handles("create")
  async createNewStream({
    user,
    title,
    hub,
  }: INewStream): Promise<INewStreamResponse> {
    const stream = await StreamService.createNewStream(user, title, hub);

    return stream;
  }
}
