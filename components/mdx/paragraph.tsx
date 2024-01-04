import React from 'react';
import { HTMLAttributes } from 'react';

const Paragraph = (props: HTMLAttributes<HTMLParagraphElement>) => {
  const { children, ...rest } = props;

  // Find anchor href url in children
  const links = React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) return null;
    if (typeof child.type !== 'object') return null;
    const childType = child.type as any;
    if (!childType?.type) return null;
    if (childType.type.render.displayName !== 'Anchor') return null;
    const props = child.props as { href: string };
    return props.href;
  });

  return (
    <>
      <p {...rest}>{children}</p>
      {links?.map((url, i) => <div key={i}>{url}</div>)}
    </>
  );
};

export default Paragraph;
