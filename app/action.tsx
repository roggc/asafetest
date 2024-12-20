"use client";

import { Suspense, useMemo } from "react";

type CallerProps<TProps, TResult> = {
  action: (props: TProps) => Promise<TResult>;
  props: TProps;
  call: (action: (props: TProps) => Promise<TResult>, props: TProps) => TResult;
};

const Caller = <TProps, TResult>({
  action,
  props,
  call,
}: CallerProps<TProps, TResult>) => {
  return call(action, props);
};

type ActionProps<TProps> = {
  action: (props: TProps) => Promise<any>;
  children?: React.ReactNode;
} & TProps;

export default function Action<TProps>({
  action,
  children = <>Loading...</>,
  ...props
}: ActionProps<TProps>) {
  const call = useMemo(() => {
    let result: any;
    let promise: Promise<void> | undefined;

    return (action: (props: TProps) => Promise<any>, props: TProps) => {
      if (result !== undefined) {
        return result;
      }
      if (!promise) {
        promise = (async () => {
          await Promise.resolve();
          result = await action(props);
        })();
      }
      throw promise;
    };
  }, [...Object.values(props)]);

  return (
    <Suspense fallback={children}>
      <Caller action={action} props={props as TProps} call={call} />
    </Suspense>
  );
}
