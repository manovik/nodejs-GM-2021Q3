import { IContextData, IRequestInfo } from '@app/types';
import asyncHooks from 'async_hooks';
import { v4 } from 'uuid';

const ctx = new Map<number, IRequestInfo>();

const asyncHook = asyncHooks.createHook({
  init(asyncId, _type, triggerAsyncId) {
    if (ctx.has(triggerAsyncId)) {
      ctx.set(asyncId, <IRequestInfo>ctx.get(triggerAsyncId));
    }
  },
  destroy(asyncId) {
    if (ctx.has(asyncId)) {
      ctx.delete(asyncId);
    }
  }
});

asyncHook.enable();

const createRequestContext = (
  requestId = v4().substring(0, 8),
  data: IContextData
) => {
  const requestInfo: IRequestInfo = { requestId, data };

  ctx.set(asyncHooks.executionAsyncId(), requestInfo);
  return requestInfo;
};

const getRequestContext = () => ctx.get(asyncHooks.executionAsyncId());

export { createRequestContext, getRequestContext };
